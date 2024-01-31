/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const {
  SEARCH_ENGINES,
  NETWORK_IDLE_EVENT,
  RESULTS_PER_PAGE,
  GOOGLE_BASE_URL,
  GOOGLE_AD_SELECTOR,
} = require('../constants');

async function crawlGoogle(keyword, pageNumber) {
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS_MODE,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    const url = `${GOOGLE_BASE_URL}?q=${encodeURIComponent(keyword)}&start=${(pageNumber - 1) * RESULTS_PER_PAGE}`;
    await page.goto(url, { waitUntil: NETWORK_IDLE_EVENT });

    let lastHeight = await page.evaluate('document.body.scrollHeight');
    let newHeight;
    let stabilizationCount = 0;

    while (stabilizationCount < 3) { // We wait for 3 checks where the height does not change
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForNetworkIdle(); // This waits for network activity to be idle for 500ms

      newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === lastHeight) {
        stabilizationCount += 1;
      } else {
        stabilizationCount = 0; // Reset the count if the height changed
        lastHeight = newHeight;
      }

      // Wait a short while to give the page a chance to start any new network activity
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    }

    // Extract the sponsored links
    const sponsoredLinks = await page.evaluate(() => {
      const links = [];
      const ads = document.querySelectorAll(GOOGLE_AD_SELECTOR);
      ads.forEach((ad) => {
        const linkElement = ad.querySelector('a');
        if (linkElement) {
          links.push(linkElement.href);
        }
      });
      return links;
    });

    return {
      searchEngine: SEARCH_ENGINES.GOOGLE,
      keyword,
      sponsoredLinks,
      page: pageNumber,
    };
  } catch (error) {
    console.error('Error in crawlGoogle:', error.message);
    return {
      searchEngine: SEARCH_ENGINES.GOOGLE,
      keyword,
      sponsoredLinks: [],
      page: pageNumber,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { crawlGoogle };
