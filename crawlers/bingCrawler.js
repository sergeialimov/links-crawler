const puppeteer = require('puppeteer');

const {
  SEARCH_ENGINES,
  RESULTS_PER_PAGE,
  BING_BASE_URL,
  BING_URL_SELECTOR,
  BING_COOKIE_BUTTON_SELECTOR,
} = require('../constants');
const { parseHeadlessMode } = require('../utils');

async function crawlBing(keyword, pageNumber) {
  let browser;
  let sponsoredLinks = [];
  try {
    browser = await puppeteer.launch({
      headless: parseHeadlessMode(process.env.HEADLESS_MODE),
    });
    const page = await browser.newPage();

    // Calculate the offset for the Bing search results based on the page number.
    const offset = (pageNumber - 1) * RESULTS_PER_PAGE;
    const url = `${BING_BASE_URL}?q=${encodeURIComponent(keyword)}&first=${offset}`;

    await this.openPage(page, url);

    // Handling the cookie consent pop-up
    if (await page.$(BING_COOKIE_BUTTON_SELECTOR) !== null) {
      await page.click(BING_COOKIE_BUTTON_SELECTOR);
    }

    // Wait for the sponsored ads to load
    await page.waitForSelector(BING_URL_SELECTOR);

    sponsoredLinks = await page.evaluate((sel) => {
      const ads = document.querySelectorAll(sel);
      // Extract the text content, which is the URL
      return Array.from(ads).map((attribute) => attribute.innerText.trim());
    }, BING_URL_SELECTOR);
  } catch (error) {
    console.error(`Error occurred while crawling ${SEARCH_ENGINES.BING}: ${error}`);
  }

  if (browser) {
    await browser.close();
  }

  return {
    searchEngine: SEARCH_ENGINES.BING,
    keyword,
    sponsoredLinks,
    page: pageNumber,
  };
}

module.exports = { crawlBing };
