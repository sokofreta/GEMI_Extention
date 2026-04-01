import cheerio from "cheerio";
import axios from "axios";
import { environment } from "../enviroment/enviroment.js";
import { ActorModel } from "../schemas/actor.schema.js";
import { LogModel } from "../schemas/log.schema.js";

export default class ScrapeTool {
  constructor() {
    this.serverURL = environment.externalUrl;
    this.authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkpXVCJ9.eyJlbWFpbCI6InNpbHZlcnRoZTE2NUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3MDU5MzMzMzEsImV4cCI6MTcwNTkzNjkzMSwiaWF0IjoxNzA1OTMzMzMxLCJpc3MiOiJUaGVhdHJpY2FsUG9ydGFsU2VydmljZSIsImF1ZCI6IlRoZWF0cmljYWxQb3J0YWxTZXJ2aWNlIn0.0KcwvAAuRLq8D6NDdBQKyqXTwEbJSQkfHGFIyxq__kY";
    this.delayBetweenRequests = 3600000 / 1000;
    this.maxActorsPerHour = 1000;
    this.actorsScrapedThisHour = 0;
    this.lastScrapeTimestamp = null;
    this.url = "https://www.ordino.gr/en_actor_detail.asp?id=";
    this.scrapedData = [];
  }

  async scrapeDataFromURL(actorId) {
    const URL = this.url + actorId;

    try {
      const response = await axios.get(URL);
      const scraped_html = response.data;
      const details = await this.scrapeData(scraped_html);
      if (details) {
        this.scrapedData.push(details);
      }
    } catch (error) {
      console.error("Error while scraping:", error);
      await this.logError(error);
    }

  }

  async postScrapedDataToServer() {
    const headers = {
      Authorization: `Bearer ${this.authToken}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.post(this.serverURL, this.scrapedData, { headers });
    } catch (error) {
      console.error("Error while posting data to server:", error.message);
    }
  }

  async scrapeData(html) {
    const details = ActorStructure();

    const $ = cheerio.load(html);
    const actorname = $(".bodytitle1 > .bodytitle1 > .bodytitle1")
      .text()
      .trim()
      .replace(/[^\w\s]/g, "");

    const firstTdBodyMain = $("td.bodymain").first();
    const bElementsInFirstTd = firstTdBodyMain.find("b");

    const firstRole = firstTdBodyMain.find("b:first-child").text().trim();

    $("a:has(img[src*='photos/small/'])").each((index, element) => {
      const href = $(element).attr("href");
      details.images.push(href.trim().replace(/\s+/g, " "));
    });

    const roles = bElementsInFirstTd
      ? bElementsInFirstTd
          .map((index, element) => $(element).text().trim())
          .get()
      : [];

    const spansAfterLanguages = $(
      'span.bodymain:contains("Languages")'
    ).nextAll("span.bodymain");

    spansAfterLanguages.each((index, element) => {
      const textContent = $(element).text().trim().replace(/\s+/g, " ");
      details.languages.push(textContent);
    });

    details.fullname = actorname;
    details.role = firstRole;
    details.roles = roles;

    $("td.bodymain").each((index, element) => {
      const text = $(element).text().trim();
      const [key, value] = text.split(":");

      if (key && value) {
        if (key === "Hair color") {
          details.hairColor = value.trim().replace(/\s+/g, " ");
        } else if (key === "Eye color") {
          details.eyeColor = value.trim().replace(/\s+/g, " ");
        } else if (key === "Height") {
          details.height = value.trim().replace(/\s+/g, " ");
        } else if (key === "Weight") {
          details.weight = value.trim().replace(/\s+/g, " ");
        }
      }
    });

    return details;
  }

  async scrapeDataForActorRange(startActorId, endActorId) {
    const scraped_data = [];
    for (
      let currentActorId = startActorId;
      currentActorId <= endActorId;
      currentActorId++
    ) {
      if (this.actorsScrapedThisHour >= this.maxActorsPerHour) {
        const currentTime = Date.now();
        const timeElapsedSinceLastScrape =
          currentTime - this.lastScrapeTimestamp;

        if (timeElapsedSinceLastScrape < this.delayBetweenRequests) {
          const delay = this.delayBetweenRequests - timeElapsedSinceLastScrape;
          console.log(
            `Hourly limit reached. Waiting for ${
              delay / 1000
            } seconds before resuming.`
          );
          await this.sleep(delay);
        }

        this.actorsScrapedThisHour = 0;
        this.lastScrapeTimestamp = null;
      }
      await this.scrapeDataFromURL(currentActorId);
      this.actorsScrapedThisHour++;
      if (!this.lastScrapeTimestamp) {
        this.lastScrapeTimestamp = Date.now();
      }
    }
    console.log("Scraping completed!", this.scrapedData);
    const result=await this.saveScrapedData(this.scrapedData);
    // await this.postScrapedDataToServer();
    return result;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async  logError(error, context) {
    try {
      const logEntry = new LogModel({
        message: error.message,
        stack: error.stack,
        context:"",
      });
      await logEntry.save();
      console.log("Error logged successfully");
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
  }
  async getVenues(movieId) {
    const URL = `https://ordino.gr/movie_detail.asp?id=${movieId}`;
    try {
      const response = await axios.get(URL);
      const html = response.data;
      const details = await this.scrapeMovies(html);

      return details;
    } catch (error) {
      console.error("Error while scraping:", error);
    }
  }

  async scrapeMovies(data) {
console.log(data)
  }
  async  saveScrapedData(scrapedData) {
    try {
      const bulkOperations = scrapedData.map((actor) => ({
        updateOne: {
          filter: { fullname: actor.fullname },
          update: { $set: actor },
          upsert: true,
        },
      }));
  
      const result = await ActorModel.bulkWrite(bulkOperations);
      console.log("Bulk write operation completed:", result);
      return result;
    } catch (error) {
      console.error("Error during bulk write operation:", error);
    }
  }
}

export const ActorStructure = () => {
  return {
    role: "",
    fullname: "",
    age: "",
    eyeColor: "",
    weight: "",
    languages: [],
    hairColor: "",
    height: "",
    description: "",
    bio: "",
    birthdate: "",
    images: [],
    roles: [],
    system: 13,
  };
};

export const VanueStructure = () => {
  return {
    title: "",
    description: "",
    images: [],
    system: 13,
  };
}
