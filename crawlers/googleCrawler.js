const { AbstractCrawler } = require('./abstractCrawler');
const {
  SEARCH_ENGINES,
  GOOGLE_BASE_URL,
  GOOGLE_AD_SELECTOR,
  GOOGLE_MERCHANT_ID_SELECTOR,
  GOOGLE_MORE_RESULTS_BUTTON_SELECTOR,
  GOOGLE_MAX_SCROLLS,
  WAIT_TIMEOUT,
} = require('../constants');

class GoogleCrawler extends AbstractCrawler {
  constructor() {
    super();
    this.searchEngine = SEARCH_ENGINES.GOOGLE;
    this.moreResultsButton = null;
    this.notFoundCounter = 0;
  }

  async scrollToTheBottom() {
    while (!this.moreResultsButton && this.notFoundCounter < GOOGLE_MAX_SCROLLS) {
      await this.page.evaluate(async () => {
        const { scrollHeight } = document.body;
        for (let j = 0; j < scrollHeight; j += 200) {
          window.scrollTo(0, j);
        }
      });

      await this.page.waitForTimeout(WAIT_TIMEOUT);
      this.moreResultsButton = await this.page.$(GOOGLE_MORE_RESULTS_BUTTON_SELECTOR);
      if (!this.moreResultsButton) {
        this.notFoundCounter += 1;
      }
    }
  }

  async getSponsoredLinks(adSelector, merchantSelector) {
    return this.page.evaluate((adSel, merchantSel) => {
      const links = [];

      // Step 1: Locate all elements with merchant IDs and extract links
      const elementsWithMerchantId = document.querySelectorAll(merchantSel);
      elementsWithMerchantId.forEach((element) => {
        const href = element.getAttribute('href');
        if (href) {
          links.push(href);
        }
      });

      // Step 2: Locate all elements by the passed selector
      const selectedElements = document.querySelectorAll(adSel);
      selectedElements.forEach((element) => {
        const href = element.getAttribute('href');
        // Avoid duplicate links if they were already added in step 1
        if (href && !links.includes(href)) {
          links.push(href);
        }
      });

      return links;
    }, adSelector, merchantSelector);
  }

  async clickMoreResultsButton() {
    await this.page.evaluate((sel) => {
      const moreResultsButton = document.querySelector(sel);
      if (moreResultsButton) {
        moreResultsButton.click();
      }
    }, GOOGLE_MORE_RESULTS_BUTTON_SELECTOR);
  }

  async crawl(keyword, pageNumber) {
    let sponsoredLinks = [];
    try {
      await this.launchBrowser();

      const url = `${GOOGLE_BASE_URL}?q=${encodeURIComponent(keyword)}&hl=en&gl=us`;
      await this.openPage(url);

      for (let i = 0; i < pageNumber; i += 1) {
        this.moreResultsButton = null;
        this.notFoundCounter = 0;

        await this.scrollToTheBottom();
        const links = await this.getSponsoredLinks(GOOGLE_AD_SELECTOR, GOOGLE_MERCHANT_ID_SELECTOR);
        sponsoredLinks = sponsoredLinks.concat(links);

        if (this.moreResultsButton) {
          await this.clickMoreResultsButton();
          await this.waitForNetworkIdle();
        }
      }

      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error(`Error occurred while crawling ${this.searchEngine}: ${error}`);
    } finally {
      await this.closeBrowser();
    }

    return {
      searchEngine: this.searchEngine,
      keyword,
      sponsoredLinks,
      page: pageNumber,
    };
  }
}

module.exports = { GoogleCrawler };
