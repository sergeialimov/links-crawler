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

class GoogleCrawler {
  constructor() {
    this.browser = null;
    this.page = null;
    this.moreResultsButton = null;
    this.notFoundCounter = 0;
  }

  async scrollToTheBottom() {
    /* eslint-disable no-await-in-loop */
    while (!this.moreResultsButton && this.notFoundCounter < GOOGLE_MAX_SCROLLS) {
      await this.page.evaluate(async () => {
        const { scrollHeight } = document.body;
        for (let j = 0; j < scrollHeight; j += 200) {
          window.scrollTo(0, j);
          await new Promise((resolve) => {
            setTimeout(resolve, 100);
          });
        }
      });

      await this.page.waitForTimeout(1000);
      this.moreResultsButton = await this.page.$(GOOGLE_MORE_RESULTS_BUTTON_SELECTOR);
      if (!this.moreResultsButton) {
        this.notFoundCounter += 1;
      }
    }
  }

  async getSponsoredLinks() {
    /* eslint-disable no-await-in-loop */
    return this.page.evaluate((sel) => {
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
  }

  async crawlGoogle(keyword, pageNumber) {
    let sponsoredLinks = [];
    try {
      this.browser = await puppeteer.launch({
        headless: parseHeadlessMode(process.env.HEADLESS_MODE),
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.page = await this.browser.newPage();

      const url = `${GOOGLE_BASE_URL}?q=${encodeURIComponent(keyword)}&hl=en&gl=us`;
      await this.page.goto(url, { waitUntil: NETWORK_IDLE_EVENT });

      for (let i = 0; i < pageNumber; i += 1) {
        this.moreResultsButton = null;
        this.notFoundCounter = 0;

        await this.scrollToTheBottom();
        sponsoredLinks = sponsoredLinks.concat(await this.getSponsoredLinks());

        await this.page.evaluate((sel) => {
          const moreResultsButton = document.querySelector(sel);
          if (moreResultsButton) {
            console.log('-- moreResultsButton', moreResultsButton);
            moreResultsButton.click();
          }
        }, GOOGLE_MORE_RESULTS_BUTTON_SELECTOR);
        await this.page.waitForNetworkIdle();
      }

      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error(`Error in ${SEARCH_ENGINES.GOOGLE}: ${error.message}`);
    }

    if (this.browser) {
      await this.browser.close();
    }

    return {
      searchEngine: SEARCH_ENGINES.GOOGLE,
      keyword,
      sponsoredLinks,
      page: pageNumber,
    };
  }
}

module.exports = { GoogleCrawler };
