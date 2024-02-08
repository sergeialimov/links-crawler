const { AbstractCrawler } = require('./abstractCrawler');
const {
  SEARCH_ENGINES,
  RESULTS_PER_PAGE,
  BING_BASE_URL,
  BING_URL_SELECTOR,
  BING_COOKIE_BUTTON_SELECTOR,
  WAIT_TIMEOUT,
} = require('../constants');

class BingCrawler extends AbstractCrawler {
  constructor() {
    super();
    this.searchEngine = SEARCH_ENGINES.BING;
  }

  async getSponsoredLinks(selector) {
    return this.page.evaluate((sel) => {
      const ads = document.querySelectorAll(sel);
      const links = [];
      ads.forEach((ad) => {
        if (ad.innerText.trim() !== '' && !links.includes(ad.innerText.trim())) {
          links.push(ad.innerText.trim());
        }
      });
      return links;
    }, selector);
  }

  async crawl(keyword, pageNumber) {
    await this.launchBrowser();
    let sponsoredLinks = [];

    try {
      const offset = (pageNumber - 1) * RESULTS_PER_PAGE;
      const url = `${BING_BASE_URL}?q=${encodeURIComponent(keyword)}&first=${offset}`;

      await this.openPage(url);

      // Handling the cookie consent pop-up
      if (await this.page.$(BING_COOKIE_BUTTON_SELECTOR) !== null) {
        await this.page.click(BING_COOKIE_BUTTON_SELECTOR);
      }

      // Wait for the sponsored ads to load
      await this.page.waitForSelector(BING_URL_SELECTOR, { timeout: WAIT_TIMEOUT });
      sponsoredLinks = await this.getSponsoredLinks(BING_URL_SELECTOR);

      return {
        searchEngine: this.searchEngine,
        keyword,
        sponsoredLinks,
        page: pageNumber,
      };
    } catch (error) {
      console.error(`Error occurred while crawling ${SEARCH_ENGINES.BING}: ${error}`);
      throw error;
    } finally {
      await this.closeBrowser();
    }
  }
}

module.exports = { BingCrawler };
