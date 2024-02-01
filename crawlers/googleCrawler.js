const puppeteer = require('puppeteer');
const {
  SEARCH_ENGINES,
  NETWORK_IDLE_EVENT,
  GOOGLE_BASE_URL,
  GOOGLE_AD_SELECTOR,
  GOOGLE_MORE_RESULTS_BUTTON_SELECTOR,
  GOOGLE_MAX_SCROLLS,
} = require('../constants');
const { parseHeadlessMode } = require('../utils');

async function crawlGoogle(keyword, pageNumber) {
  let browser;
  let page;
  let sponsoredLinks = [];
  try {
    browser = await puppeteer.launch({
      headless: parseHeadlessMode(process.env.HEADLESS_MODE),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 2080 });

    const url = `${GOOGLE_BASE_URL}?q=${encodeURIComponent(keyword)}`;
    await page.goto(url, { waitUntil: NETWORK_IDLE_EVENT });

    // Click the "More results" button 'pageNumber' times
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < pageNumber; i += 1) {
      let moreResultsButton;
      let notFoundCounter = 0;

      while (!moreResultsButton && notFoundCounter < GOOGLE_MAX_SCROLLS) {
        console.log('-- scroll');
        // Scroll down the page
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        // Wait for a short period to allow the page to load
        await page.waitForTimeout(1000);

        // Check if the 'moreResultsButton' is present
        moreResultsButton = await page.$(GOOGLE_MORE_RESULTS_BUTTON_SELECTOR);
        if (!moreResultsButton) {
          notFoundCounter += 1;
          console.log('-- notFoundCounter', notFoundCounter);
        }
      }

      // Click the "More results" button
      await page.evaluate((sel) => {
        moreResultsButton = document.querySelector(sel);
        if (moreResultsButton) {
          console.log('-- moreResultsButton', moreResultsButton);
          moreResultsButton.click();
        }
      }, GOOGLE_MORE_RESULTS_BUTTON_SELECTOR);
      await page.waitForNetworkIdle();
      await page.waitForTimeout(10000);
    }
    /* eslint-enable no-await-in-loop */

    // Extract the sponsored links
    sponsoredLinks = await page.evaluate((sel) => {
      const links = [];
      const ads = document.querySelectorAll(sel);
      ads.forEach((ad) => {
        const linkElement = ad.querySelector('a');
        if (linkElement) {
          links.push(linkElement.href);
        }
      });
      return links;
    }, GOOGLE_AD_SELECTOR);
  } catch (error) {
    console.error(`Error in ${SEARCH_ENGINES.GOOGLE}: ${error.message}`);
  }

  if (browser) {
    await browser.close();
  }

  return {
    searchEngine: SEARCH_ENGINES.GOOGLE,
    keyword,
    sponsoredLinks,
    page: pageNumber,
  };
}

module.exports = { crawlGoogle };
