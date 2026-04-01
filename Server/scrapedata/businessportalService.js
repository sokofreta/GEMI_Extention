import puppeteer from "puppeteer";
import { businessIdsModel } from "../schemas/businessIds.schema.js";
import { LogModel } from "../schemas/log.schema.js";
import ScrapeTool from "./ordinoService.js";
import { BusinessModel } from "../schemas/businessPortal.schema.js";
import { io } from "../main.js";
import moment from "moment";
export class BusinessPortalService {
  constructor(
    startDate = "2024-01-01",
    endDate = "2024-12-31",
    delay = 1000,
    tk = "55134",
    region = "Κεντρική Μακεδονία",
    status = "Ενεργή",
    oneToOne = false,
    activities = []
  ) {
    this.url = "https://publicity.businessportal.gr";
    this.startDate = startDate;
    this.endDate = endDate;
    this.io = io;
    this.delay = delay;
    this.tk = tk;
    this.region = region;
    this.status = status;
    this.stop = false;
    this.scrapedData = [];
    this.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    this.oneToOne = oneToOne;
  }

  async getBusinessPortalData(startDate, endDate, delay = 5000, oneToOne) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 24 * 60 * 60 * 1000;
    let isScrapingStopped = false;

    io.on("stop-scraping", () => {
      isScrapingStopped = true;
      console.log("Scraping stopped by user.");
    });

    this.logInitialDetails(start, end, delay, oneDay, oneToOne);
    const status = (stats) => {
      if (stats.inserted === 1) return "inserted";
      if (stats.alreadyPresent === 1) return "alreadyPresent";
      if (stats.failed === 1) return "failed";
      return "unknown";
    };
    const isSingleDay = end - start <= oneDay;
    try {
      let results;
      if (isSingleDay) {
        console.log("Fetching data for a single day range");
        results = await this.processSingleDay(
          startDate,
          endDate,
          delay,
          isScrapingStopped,
          status
        );
      } else if (oneToOne === "false") {
        console.log("Fetching data for a single day range");
        results = await this.processSingleDay(
          startDate,
          endDate,
          delay,
          isScrapingStopped,
          status
        );
      } else {
        console.log("Fetching data for multiple days range");
        results = await this.processMultipleDays(
          start,
          end,
          oneDay,
          delay,
          isScrapingStopped,
          status
        );
      }

      await this.logResults({ start, end, results });

      return results;
    } catch (error) {
      console.error("Error during scraping:", error);
      throw error;
    }
  }

  logInitialDetails(start, end, delay, oneDay, oneToOne) {
    console.log("Delay:", delay);
    console.log("Start Date:", start);
    console.log("End Date:", end);
    console.log("Difference in days:", (end - start) / oneDay);
  }

  async processSingleDay(startDate, endDate, delay, isScrapingStopped, status) {
    const results = await this.scrapeForDateRange(startDate, endDate);

    const totalItems = results.length;
    let scrapedCount = 0;

    this.io.emit("discovered", { discovered: totalItems });

    const results1 = await this.processBusinesses(
      results,
      delay,
      isScrapingStopped,
      status,
      scrapedCount
    );
    console.log("Scraping process for single day completed.");
    return results1;
  }

  async processMultipleDays(
    start,
    end,
    oneDay,
    delay,
    isScrapingStopped,
    status
  ) {
    let currentDate = new Date(start);
    const allResults = [];

    while (currentDate <= end) {
      if (isScrapingStopped) break;

      const nextDate = new Date(currentDate.getTime() + oneDay);
      const results = await this.scrapeForDateRange(currentDate, nextDate);

      this.io.emit("discovered", { discovered: results.length });

      let scrapedCount = 0;
      const dayResults = await this.processBusinesses(
        results,
        delay,
        isScrapingStopped,
        status,
        scrapedCount
      );
      console.log("Day results:", dayResults);

      allResults.push(...dayResults);

      currentDate = nextDate;

      console.log("Sleeping for", delay * 1000, "ms");
      await this.sleep(delay * 1000);
    }

    console.log("Scraping process for multiple days completed.");
    return allResults;
  }
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async processBusinesses(
    results,
    delay,
    isScrapingStopped,
    status,
    scrapedCount
  ) {
    let resultss = [];
    for (let id of results) {
      if (isScrapingStopped) {
        console.log("Scraping process stopped by user.");
        break;
      }

      console.log(`Scraping business with ID: ${id}`);
      const details = await this.scrapeBusinessDetails(id);

      scrapedCount++;

      const stats = details?.stats || {};
      const itemStatus = status(stats);

      this.io.emit("scrape-progress-item", {
        id,
        status: itemStatus,
        stat: stats,
      });

      if (scrapedCount % 10 === 0) {
        console.log(
          `Scraped ${scrapedCount} businesses, waiting for ${delay} ms...`
        );
        await this.sleep(delay);
      }

      resultss.push({ id, status: itemStatus, stats });
    }
    return resultss;
  }

  async logResults({ start, end, results }) {
    try {
      const logData = results.map((result) => ({
        businessId: result.id,
        status: result.status,
      }));

      const logEntry = {
        startDate: start,
        endDate: end,
        results: logData,
      };
      await LogModel.create(logEntry);
      console.log("Log entry created successfully:", logEntry);
    } catch (error) {
      console.error("Failed to log results:", error);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async gemi(page) {
    try {
      // const searchTerms = [
      //   "97 ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ ΝΟΙΚΟΚΥΡΙΩΝ ΩΣ ΕΡΓΟΔΟΤΩΝ ΟΙΚΙΑΚΟΥ ΠΡΟΣΩΠΙΚΟΥ",
      //   "ΚΑ ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ ΕΞΩΧΩΡΙΩΝ ΟΡΓΑΝΙΣΜΩΝ",
      //   "00 ΕΛΛΕΙΨΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑΣ",
      //   "Α ΓΕΩΡΓΙΑ, ΔΑΣΟΚΟΜΙΑ ΚΑΙ ΑΛΙΕΙΑ",
      // ];
      const searchTerms = this.activities.split(",").map((term) => term.trim());
      for (const searchTerm of searchTerms) {
        console.log(`Searching and selecting: ${searchTerm}`);

        await page.waitForSelector(".tag-list .tag-item .search", {
          visible: true,
        });

        await page.evaluate(() => {
          const input = document.querySelector(".tag-list .tag-item .search");
          if (input) input.value = "";
        });

        await page.type(".tag-list .tag-item .search", searchTerm);

        await page.waitForSelector(".dropdown-content .root", {
          visible: true,
        });

        const optionsDebug = await page.evaluate(() => {
          const options = Array.from(
            document.querySelectorAll(".dropdown-content .root .node-label")
          ).map((option) => option.textContent.trim());
          return options;
        });

        console.log("Available options:", optionsDebug);

        const selected = await page.evaluate((term) => {
          const options = Array.from(
            document.querySelectorAll(".dropdown-content .root .node")
          );
          for (let option of options) {
            const label = option
              .querySelector(".node-label")
              ?.textContent.trim();
            const checkbox = option.querySelector("input[type='checkbox']");
            if (label === term && checkbox && !checkbox.checked) {
              checkbox.click();
              checkbox.dispatchEvent(new Event("change", { bubbles: true }));
              return true;
            }
          }
          return false;
        }, searchTerm);

        if (selected) {
          console.log(`Successfully selected: ${searchTerm}`);
        } else {
          console.log(`Failed to find or select checkbox for: ${searchTerm}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error in gemi method:", error);
    }
  }

  async scrapeForDateRange(startDate, endDate) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(this.url);

    const filterClicked = await this.clickFilterButton(page);
    if (!filterClicked) {
      console.log("Failed to find or click the filter button.");
      await browser.close();
      return [];
    }
    await this.setDates(page, startDate, endDate);
    await this.selectStatusDropdown(page);
    await this.selectRegionAndScrape(page);
    await this.enterPostalCode(page);
    await this.gemi(page);
    const searchClicked = await this.clickSearchButton(page);
    if (!searchClicked) {
      console.log("Failed to find or click the search button.");
      await browser.close();
      return [];
    }

    const results = await this.scrapePaginationResults(page);
    await browser.close();
    return results;
  }

  async clickFilterButton(page) {
    await page.waitForSelector("button.MuiButtonBase-root", { visible: true });
    const filterButton = await page.evaluateHandle(() => {
      const buttons = Array.from(
        document.querySelectorAll("button.MuiButtonBase-root")
      );
      return buttons.find((button) => button.textContent.trim() === "Φιλτρα");
    });

    if (filterButton) {
      console.log("Filter button found, clicking it.");
      await filterButton.asElement().click();
      return true;
    } else {
      console.log("Filter button not found.");
      return false;
    }
  }

  async setDates(page, startDate, endDate) {
    console.log("Setting dates:", startDate, endDate);

    const formatDate = (date) => {
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const formattedStartDate = formatDate(new Date(startDate));
    const formattedEndDate = formatDate(new Date(endDate));

    await page.focus("#mui-12");
    await page.keyboard.type(formattedStartDate, { delay: 100 });
    await page.focus("#mui-13");
    await page.keyboard.type(formattedEndDate, { delay: 100 });
    await page.waitForSelector('input[placeholder="dd/mm/yyyy"]', {
      visible: true,
    });

    await page.evaluate(
      (formattedStartDate, formattedEndDate) => {
        const startInput = document.querySelector("#mui-12");
        const endInput = document.querySelector("#mui-13");

        if (startInput && endInput) {
          startInput.value = formattedStartDate;
          endInput.value = formattedEndDate;

          startInput.dispatchEvent(new Event("input", { bubbles: true }));
          startInput.dispatchEvent(new Event("change", { bubbles: true }));

          endInput.dispatchEvent(new Event("input", { bubbles: true }));
          endInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
      },
      formattedStartDate,
      formattedEndDate
    );

    await page.waitForFunction(
      (formattedStartDate, formattedEndDate) => {
        const startValue = document.querySelector("#mui-12")?.value;
        const endValue = document.querySelector("#mui-13")?.value;
        return (
          startValue === formattedStartDate && endValue === formattedEndDate
        );
      },
      {},
      formattedStartDate,
      formattedEndDate
    );

    console.log(
      `Confirmed dates: From ${formattedStartDate} to ${formattedEndDate}`
    );
  }

  async clickSearchButton(page) {
    await page.waitForSelector("button.MuiButtonBase-root", { visible: true });
    const searchButton = await page.evaluateHandle(() => {
      const buttons = Array.from(
        document.querySelectorAll("button.MuiButtonBase-root")
      );
      return buttons.find(
        (button) => button.textContent.trim() === "Αναζήτηση"
      );
    });

    if (searchButton) {
      console.log("Search button found, clicking it.");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await searchButton.asElement().click();
      return true;
    } else {
      console.log("Search button not found.");
      return false;
    }
  }
  async enterPostalCode(page) {
    await page.waitForSelector(
      'label[for="outlined-basic2"] + div input[type="text"]'
    );
    console.log("Postal code input field is available.");

    await page.type(
      'label[for="outlined-basic2"] + div input[type="text"]',
      this.tk
    );
    console.log(`Entered postal code '${this.tk}' into the input field.`);
  }
  async selectStatusDropdown(page) {
    await page.evaluate(() => {
      const legendElement = Array.from(
        document.querySelectorAll("legend.css-yjsfm1")
      ).find((el) => el.textContent.trim() === "Κατάσταση");
      if (legendElement) {
        const inputContainer = legendElement.closest(".MuiInputBase-root");
        if (inputContainer) {
          const dropdownTrigger = inputContainer.querySelector(
            ".MuiAutocomplete-popupIndicator"
          );
          if (dropdownTrigger) {
            dropdownTrigger.click();
          } else {
            throw new Error(
              "Dropdown trigger not found within Κατάσταση container"
            );
          }
        } else {
          throw new Error("Input container not found for Κατάσταση");
        }
      } else {
        throw new Error("Κατάσταση legend not found");
      }
    });
    console.log("Clicked the 'Κατάσταση' dropdown trigger.");

    await page.waitForSelector('ul[role="listbox"]', { visible: true });
    console.log("Dropdown menu opened successfully.");

    const options = await page.$$('ul[role="listbox"] li');
    let optionSelected = false;
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (const option of options) {
      const text = await page.evaluate((el) => el.textContent.trim(), option);
      if (text === this.status) {
        await option.click();
        console.log(`Option ${this.status} selected.`);
        optionSelected = true;
        break;
      }
    }

    if (!optionSelected) {
      throw new Error(`Option ${this.status} not found in the dropdown.`);
    }

    const selectedValue = await page.$eval(".MuiChip-label", (el) =>
      el.textContent.trim()
    );
    if (selectedValue === this.status) {
      console.log(`Selection of ${this.status} confirmed.`);
    } else {
      console.error(`Failed to select  ${this.status}.`);
    }
  }

  async selectRegionAndScrape(page) {
    await page.click("#Places_trigger");
    console.log("Dropdown opened.");

    await page.waitForSelector(".dropdown-content", { visible: true });
    console.log("Dropdown content is visible.");

    await page.waitForSelector(
      `label[title="${this.region}"] input[type="checkbox"]`
    );
    console.log(`Region "${this.region}" found in the dropdown.`);

    const isAlreadySelected = await page.evaluate((region) => {
      const regionCheckbox = document.querySelector(
        `label[title="${region}"] input[type="checkbox"]`
      );
      return regionCheckbox && regionCheckbox.checked;
    }, this.region);

    if (!isAlreadySelected) {
      console.log(`Region '${this.region}' is not selected, selecting now.`);

      await page.evaluate((region) => {
        const regionLabel = document.querySelector(`label[title="${region}"]`);
        if (regionLabel) {
          const checkbox = regionLabel.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.click();
          }
        }
      }, this.region);

      await new Promise((resolve) => setTimeout(resolve, 500));

      await page.click("#Places_trigger");
      console.log("Dropdown closed.");

      await page.waitForSelector(".dropdown-content", { hidden: true });
      console.log("Dropdown fully closed.");

      const isSelected = await page.evaluate((region) => {
        const regionCheckbox = document.querySelector(
          `label[title="${region}"] input[type="checkbox"]`
        );
        return regionCheckbox ? regionCheckbox.checked : false;
      }, this.region);

      if (isSelected) {
        console.log(`Region '${this.region}' selected successfully.`);
      } else {
        console.error(`Failed to select region '${this.region}'.`);
      }
    } else {
      console.log(`Region '${this.region}' is already selected.`);
    }
  }

  async scrapePaginationResults(page) {
    const results = [];
    const seenIds = new Set();
    const timeoutDuration = 3000;
    const service = new ScrapeTool();

    let totalDiscovered = 0;
    let successCount = 0;

    const waitForSelectorWithTimeout = async (selector) => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout waiting for selector")),
          timeoutDuration
        )
      );
      return Promise.race([
        page.waitForSelector(selector, { visible: true }),
        timeoutPromise,
      ]);
    };

    this.io.emit("scrape-summary", {
      status: "started",
      date: new Date().toISOString(),
      totalDiscovered: 0,
    });

    await waitForSelectorWithTimeout('nav[aria-label="pagination navigation"]');
    const maxPages = await page.evaluate(() => {
      const paginationNav = document.querySelector(
        'nav[aria-label="pagination navigation"]'
      );
      if (!paginationNav) return 1;
      const liElements = paginationNav.querySelectorAll("ul > li");
      const secondLastLi = liElements[liElements.length - 2];
      const button = secondLastLi.querySelector(
        'button[aria-label^="Go to page"]'
      );
      if (!button) return 1;
      const ariaLabel = button.getAttribute("aria-label") || "";
      const maxPage = ariaLabel.split(" ").pop();
      return parseInt(maxPage, 10) || 1;
    });

    console.log(`Max pages found: ${maxPages}`);

    for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
      await waitForSelectorWithTimeout(".MuiTable-root");

      const pageResults = await page.evaluate(() => {
        const rows = Array.from(
          document.querySelectorAll(".MuiTableBody-root .MuiTableRow-root")
        );
        return rows.map((row) => row.querySelector("th").innerText);
      });

      totalDiscovered += pageResults.length;
      console.log("Total Discovered on page", currentPage, ":", pageResults);
      if (pageResults.length === 0) {
        console.log("No results found on this page, stopping.");
        break;
      }

      pageResults.forEach((id) => {
        if (!seenIds.has(id)) {
          results.push(id);
          seenIds.add(id);
        }
      });

      if (currentPage < maxPages) {
        const nextButton = await page.$('button[aria-label="Go to next page"]');
        if (nextButton) {
          console.log("Moving to the next page:", currentPage + 1);
          await nextButton.click();

          await new Promise((resolve) => setTimeout(resolve, 2000));
          await page.waitForSelector(".MuiTableBody-root .MuiTableRow-root", {
            visible: true,
          });
        } else {
          console.log("Next page button not found, stopping.");
          break;
        }
      }
    }

    const bulkOps = results.map((id) => ({
      insertOne: {
        document: { id: id },
      },
    }));

    try {
      const result = await businessIdsModel.bulkWrite(bulkOps, {
        ordered: false,
      });
      successCount = result.insertedCount;

      console.log("Scraping process completed successfully");
    } catch (err) {
      console.error("Error during bulk write:", err);
      await service.logError(err);
    }

    return results;
  }

  async getBusinessPortalIds() {
    try {
      const ids = await businessIdsModel.find({}).sort({ scraped: -1 });
      return ids;
    } catch (err) {
      console.error(err);
    }
  }

  async scrapeBusinessDetails(id) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const url = `${this.url}/company/${id}`;
    let stats = {
      scraped: 0,
      inserted: 0,
      alreadyPresent: 0,
      failed: 0,
    };

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
      await this.sleep(3000)
      await page.goBack();
    } catch (error) {
      stats.failed++;
      if (error.name === "TimeoutError") {
        console.error(`Navigation timeout for URL: ${url}`);
      } else {
        console.error(`Error navigating to URL: ${url}`, error);
      }
      await browser.close();
      this.io.emit("scrape-progress", {
        status: "error",
        message: `Error navigating to URL: ${url}`,
        id: id,
        stats,
      });
      return null;
    }
     
    try {
      await page.waitForSelector(".MuiTableRow-root", { timeout: 5000 });
      await page.waitForSelector("h4.MuiTypography-h4", { timeout: 5000 });

      await page.waitForSelector('div[id="Activity"]', {
        visible: true,
        timeout: 5000,
      });

      const skoposSection = await page.evaluate(() => {
        const activityElement = document.querySelector('div[id="Activity"]');
        if (!activityElement) return null;

        const childDivs = activityElement.querySelectorAll(":scope > div");
        if (childDivs.length < 2) return null;

        const secondDiv = childDivs[1];
        const nestedDivs = secondDiv.querySelectorAll(":scope > div");

        const allText = Array.from(nestedDivs)
          .map((div) => div.textContent.trim())
          .filter((text) => text.length > 0);

        if (allText.length === 0) return null;

        const combinedText = allText.join(" ");
        const cleanedText = combinedText.replace(/^Σκοπός\s*/i, "").trim();

        const mainKADMatch = cleanedText.match(
          /^(.*?)Κύριος\sΚΑΔ\s*(\d+)(.*)$/
        );
        const mainKAD = mainKADMatch ? mainKADMatch[2].trim() : null;
        const beforeKAD = mainKADMatch ? mainKADMatch[1].trim() : null;
        const afterMainKAD = mainKADMatch ? mainKADMatch[3].trim() : null;

        const beforeSecondaryKAD = afterMainKAD
          ? afterMainKAD.split("Δευτερεύοντες")[0].trim()
          : null;

        const secondaryKADMatch = afterMainKAD
          ? afterMainKAD.match(/Δευτερεύοντες\sΚΑΔ\s*(.*)/)
          : null;
        const secondaryKADText = secondaryKADMatch ? secondaryKADMatch[1] : "";

        const parseSecondaryKADs = (text) => {
          const regex = /(\d{8})([^\d]+)/g;
          const map = {};
          let match;

          while ((match = regex.exec(text)) !== null) {
            const key = match[1];
            const value = match[2].trim();
            map[key] = value;
          }

          return map;
        };

        const secondaryKADs = parseSecondaryKADs(secondaryKADText);

        return {
          purposeText: beforeKAD || null,
          mainKAD: mainKAD || null,
          mainKADInfo: beforeSecondaryKAD || null,
          secondaryKADs: secondaryKADs,
        };
      });

      console.log("Extracted Text Sections:", skoposSection);

      console.log(`Scraping URL: ${url}`);
      const fieldMapping = this.data_stracture();
      const businessDetails = await page.evaluate((fieldMapping) => {
        const details = {};
        Object.keys(fieldMapping).forEach((field) => {
          details[fieldMapping[field]] = "";
        });

        const nameElement = document.querySelector("h4.MuiTypography-h4");
        if (nameElement) {
          details["fullName"] = nameElement.textContent.trim();
        }

        const rows = Array.from(document.querySelectorAll(".MuiTableRow-root"));
        rows.forEach((row) => {
          const labelElement = row.querySelector(".MuiBox-root");
          const valueElement = row.querySelector(".MuiBox-root.css-1yp8bgi");

          if (labelElement && valueElement) {
            const label = labelElement.textContent.trim();
            let value = valueElement.textContent.trim();

            if (value === "(Δεν βρέθηκε κάποιο στοιχείο)") {
              value = "";
            }

            const englishField = fieldMapping[label];
            if (englishField) {
              const linkElement = valueElement.querySelector("a");
              if (linkElement) {
                value = linkElement.href;
              }

              const chipElement = valueElement.querySelector(".MuiChip-root");
              if (chipElement) {
                value = chipElement.textContent.trim();
              }

              if (englishField === "email" && value.startsWith("mailto:")) {
                value = value.replace("mailto:", "");
              }
              if (englishField === "phoneNumber" && value.startsWith("tel:")) {
                value = value.replace("tel:", "");
              }
              if (
                englishField === "chamberPhoneNumber" &&
                value.startsWith("tel:")
              ) {
                value = value.replace("tel:", "");
              }
              details[englishField] = value || "";
            }
          }
        });

        if (details.establishmentDate) {
          const dateParts = details.establishmentDate.split("/");
          if (dateParts.length === 3) {
            details.establishmentDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
        }

        return details;
      }, fieldMapping);

      console.log("Scraped Business Details:", businessDetails);
      businessDetails.purpose = skoposSection ? skoposSection.purposeText : "";
      businessDetails.kad = skoposSection ? skoposSection.mainKAD : "";
      businessDetails.kad_details = skoposSection
        ? skoposSection.mainKADInfo
        : "";
      businessDetails.secondaryKADs = skoposSection
        ? skoposSection.secondaryKADs
        : "";
      businessDetails.mainKAD = skoposSection ? skoposSection.mainKAD : "";

      await browser.close();

      const data_create = this.data_instert_structure(businessDetails);

      try {
        const updateResult = await BusinessModel.updateOne(
          { companyNumber: businessDetails.companyNumber },
          {
            $set: data_create,
          },
          { upsert: true }
        );

        if (updateResult.upsertedCount > 0) {
          stats.inserted++;
        } else {
          stats.alreadyPresent++;
        }

        this.io.emit("scrape-progress", {
          status: "success",
          message: `Successfully scraped business with ID: ${id}`,
          id: id,
          companyNumber: id,
          stats,
        });

        await businessIdsModel.findOneAndUpdate(
          { id: businessDetails.companyNumber },
          { $set: { scraped: true }, percentage: 100 }
        );

        return {
          companyNumber: businessDetails.companyNumber,
          stats,
        };
      } catch (err) {
        stats.failed++;
        console.error("Error inserting/updating business details:", err);
        this.io.emit("scrape-progress", {
          status: "error",
          message: `Error inserting/updating business with ID: ${id}`,
          id: id,
          stats,
        });
        return null;
      }
    } catch (error) {
      stats.failed++;
      console.error(`Error scraping details for URL: ${url}`, error);
      await browser.close();

      this.io.emit("scrape-progress", {
        status: "error",
        message: `Error scraping details for business with ID: ${id}`,
        id: id,
        stats,
      });

      return null;
    }
  }

  async getBusinessPortalInfo() {
    try {
      const business_info = await BusinessModel.find({});
      return business_info;
    } catch (err) {
      console.error(err);
    }
  }

  async getBusinessPortalDetails(limit, page, delay) {
    try {
      const skip = (page - 1) * limit;
      const ids = await businessIdsModel
        .find({})
        .sort({ id: -1 })
        .skip(skip)
        .limit(limit);

      const service = new ScrapeTool();
      let scrapedCount = 0;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i].id;

        console.log(`Scraping business with ID: ${id}`);
        const details = await this.scrapeBusinessDetails(id);

        console.log(details);

        scrapedCount++;
        if (scrapedCount % 10 === 0) {
          console.log(
            `Scraped ${scrapedCount} businesses, waiting for ${delay} ms...`
          );
          await this.sleep(delay);
        }
      }

      console.log("Scraping process completed.");
    } catch (err) {
      console.error("Error in scraping business details:", err);
    }
  }
  data_stracture() {
    return {
      "Αριθμός ΓΕΜΗ": "companyNumber",
      EUID: "euid",
      "Διακριτικοί Τίτλοι": "tradeTitles",
      "Επωνυμία με λατινικούς χαρακτήρες": "latinName",
      ΑΦΜ: "vatNumber",
      "Ημ/νία Σύστασης": "establishmentDate",
      "Νομική Μορφή": "legalForm",
      Κατάσταση: "status",
      Διεύθυνση: "address",
      Ιστοσελίδα: "website",
      "e-shop": "eshop",
      "E-mail": "email",
      Τηλέφωνο: "phoneNumber",
      "Aρμόδια Υπηρεσία ΓΕΜΗ": "responsibleService",
      "Τμήμα Επιμελητηρίου": "chamberDepartment",
      "Αριθμός Μητρώου Επιμελητηρίου": "chamberRegistryNumber",
      "Τηλέφωνο Επικοινωνίας Επιμελητηρίου": "chamberPhoneNumber",
      "Ιστοσελίδα Επιμελητηρίου": "chamberWebsite",
      "Ημερομηνία Εγγραφης": "registrationDate",
    };
  }
  data_instert_structure(businessDetails) {
    return {
      companyNumber: businessDetails.companyNumber || "",
      euid: businessDetails.euid || "",
      tradeTitles: businessDetails.tradeTitles || "",
      latinName: businessDetails.latinName || "",
      vatNumber: businessDetails.vatNumber || "",
      establishmentDate: businessDetails.establishmentDate
        ? moment(businessDetails.establishmentDate, "DD/MM/YYYY").toDate()
        : "",
      legalForm: businessDetails.legalForm || "",
      status: businessDetails.status || "",
      address: businessDetails.address || "",
      website: businessDetails.website || "",
      eshop: businessDetails.eshop || "",
      fullName: businessDetails.fullName || "",
      email: businessDetails.email || "",
      phoneNumber: businessDetails.phoneNumber || "",
      responsibleService: businessDetails.responsibleService || "",
      chamberDepartment: businessDetails.chamberDepartment || "",
      chamberRegistryNumber: businessDetails.chamberRegistryNumber || "",
      chamberPhoneNumber: businessDetails.chamberPhoneNumber || "",
      chamberWebsite: businessDetails.chamberWebsite || "",
      registrationDate: businessDetails.registrationDate || "",
      purpose: businessDetails.purpose || "",
      kad: businessDetails.kad || "",
      kad_details: businessDetails.kad_details || "",
      secondaryKADs: businessDetails.secondaryKADs || "",
      beforeSecondaryKAD: businessDetails.beforeSecondaryKAD || "",
      mainKAD: businessDetails.mainKAD || "",
      drastiriotites: {
        purpose: businessDetails.purpose || "",
        main_kad: businessDetails.kad || "",
        main_kad_info: businessDetails.kad_details || "",
        secondaryKADs: businessDetails.secondaryKADs || "",
      },
    };
  }
}
