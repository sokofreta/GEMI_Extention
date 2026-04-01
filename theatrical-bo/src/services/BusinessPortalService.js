import puppeteer from 'puppeteer';

export default class BusinessPortalService {
    async getBusinessPortalData() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://publicity.businessportal.gr/');

        // Perform search
        await page.waitForSelector('input[placeholder="dd/mm/yyyy"]');
        await page.type('input[placeholder="dd/mm/yyyy"]', '01/01/2023'); // Example date
        await page.click('.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeLarge.MuiButton-containedSizeLarge.css-v1xlyt');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        let hasNextPage = true;

        while (hasNextPage) {
            await page.waitForSelector('.MuiPagination-ul');

            const data = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('.item-selector'));
                return items.map(item => item.innerText);
            });

            console.log(data);

            const nextButton = await page.$('button[aria-label="Go to next page"]');
            if (nextButton) {
                await nextButton.click();
                await page.waitForNavigation({ waitUntil: 'networkidle0' });
            } else {
                hasNextPage = false;
            }
        }

        await browser.close();
    }
}
