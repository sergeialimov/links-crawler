const puppeteer = require('puppeteer');
const {
  SEARCH_ENGINES,
  NETWORK_IDLE_EVENT,
  YAHOO_AD_SELECTORS,
  YAHOO_BASE_URL,
} = require('../constants');
const { parseHeadlessMode } = require('../utils');

async function crawlYahoo(keyword, pageNumber) {
  let browser;
  let sponsoredLinks = [];
  try {
    browser = await puppeteer.launch({
      headless: parseHeadlessMode(process.env.HEADLESS_MODE),
    });
    const page = await browser.newPage();

    const url = `${YAHOO_BASE_URL}?p=${encodeURIComponent(keyword)}&fp=${pageNumber}`;
    await page.goto(url, { waitUntil: NETWORK_IDLE_EVENT });

    sponsoredLinks = await page.evaluate((selectors) => {
      const adElements = document.querySelectorAll(selectors);
      const links = [];
      adElements.forEach((element) => {
        const href = element.getAttribute('href');
        if (href) {
          links.push(href);
        }
      });
      return links;
    }, YAHOO_AD_SELECTORS);
  } catch (error) {
    console.error(`Error occurred while crawling ${SEARCH_ENGINES.YAHOO}: ${error}`);
  }

  if (browser) {
    await browser.close();
  }

  return {
    searchEngine: SEARCH_ENGINES.YAHOO,
    keyword,
    sponsoredLinks,
    pageNum: pageNumber,
  };
}

module.exports = { crawlYahoo };
