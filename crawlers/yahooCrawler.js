const puppeteer = require('puppeteer');
const {
  YAHOO_AD_SELECTORS,
  YAHOO_BASE_URL,
  SEARCH_ENGINES,
} = require('../constants');

async function crawlYahoo(keyword, pageNumber) {
  let sponsoredLinks = [];
  try {
    const browser = await puppeteer.launch({ headless: process.env.HEADLESS_MODE });
    const page = await browser.newPage();

    const url = `${YAHOO_BASE_URL}?p=${encodeURIComponent(keyword)}&fp=${pageNumber}`;
    await page.goto(url);

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

    await browser.close();
  } catch (error) {
    console.error(`Error occurred while crawling Yahoo: ${error}`);
  }

  return {
    searchEngine: SEARCH_ENGINES.YAHOO,
    keyword,
    sponsoredLinks,
    pageNum: pageNumber,
  };
}

module.exports = { crawlYahoo };
