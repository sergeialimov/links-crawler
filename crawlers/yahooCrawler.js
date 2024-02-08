const { AbstractCrawler } = require('./abstractCrawler');
const {
  SEARCH_ENGINES,
  YAHOO_AD_SELECTORS,
  YAHOO_BASE_URL,
} = require('../constants');

class YahooCrawler extends AbstractCrawler {
  constructor() {
    super();
    this.searchEngine = SEARCH_ENGINES.YAHOO;
  }

  async getSponsoredLinks(selector) {
    return this.page.evaluate((sel) => {
      const links = [];
      const adElements = document.querySelectorAll(sel);
      adElements.forEach((element) => {
        const href = element.getAttribute('href');
        if (href && !links.includes(href)) {
          links.push(href);
        }
      });
      return links;
    }, selector);
  }

  async crawl(keyword, pageNumber) {
    let sponsoredLinks = [];
    try {
      await this.launchBrowser();

      const url = `${YAHOO_BASE_URL}?p=${encodeURIComponent(keyword)}&fp=${pageNumber}`;
      await this.openPage(url);

      sponsoredLinks = await this.getSponsoredLinks(YAHOO_AD_SELECTORS);
    } catch (error) {
      console.error(`Error occurred while crawling ${this.searchEngine}: ${error}`);
    } finally {
      await this.closeBrowser();
    }

    return {
      searchEngine: this.searchEngine,
      keyword,
      sponsoredLinks,
      pageNum: pageNumber,
    };
  }
}

module.exports = { YahooCrawler };
