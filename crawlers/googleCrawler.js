const { AbstractCrawler } = require('./abstractCrawler'); // Adjust the path as necessary
const {
  SEARCH_ENGINES,
  GOOGLE_BASE_URL,
  GOOGLE_AD_SELECTOR,
  GOOGLE_MORE_RESULTS_BUTTON_SELECTOR,
  GOOGLE_MAX_SCROLLS,
} = require('../constants');

class GoogleCrawler extends AbstractCrawler {
  constructor() {
    super();
    this.moreResultsButton = null;
    this.notFoundCounter = 0;
  }

  async scrollToTheBottom() {
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
        const links = await this.getSponsoredLinks(GOOGLE_AD_SELECTOR, SEARCH_ENGINES.GOOGLE);
        sponsoredLinks = sponsoredLinks.concat(links);

        if (this.moreResultsButton) {
          await this.clickMoreResultsButton();
          await this.page.waitForNetworkIdle();
        }
      }

      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error(`Error in ${SEARCH_ENGINES.GOOGLE}: ${error.message}`);
    } finally {
      await this.closeBrowser();
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
