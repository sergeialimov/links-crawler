const { AbstractCrawler } = require('./abstractCrawler'); // Adjust the path as necessary
const {
  SEARCH_ENGINES,
  NETWORK_IDLE_EVENT,
  YAHOO_AD_SELECTORS,
  YAHOO_BASE_URL,
} = require('../constants');

class YahooCrawler extends AbstractCrawler {
  async crawl(keyword, pageNumber) {
    let sponsoredLinks = [];
    try {
      await this.launchBrowser();

      const url = `${YAHOO_BASE_URL}?p=${encodeURIComponent(keyword)}&fp=${pageNumber}`;
      await this.page.goto(url, { waitUntil: NETWORK_IDLE_EVENT });

      sponsoredLinks = await this.getSponsoredLinks(YAHOO_AD_SELECTORS);
    } catch (error) {
      console.error(`Error occurred while crawling ${SEARCH_ENGINES.YAHOO}: ${error}`);
    } finally {
      await this.closeBrowser();
    }

    return {
      searchEngine: SEARCH_ENGINES.YAHOO,
      keyword,
      sponsoredLinks,
      pageNum: pageNumber,
    };
  }
}

module.exports = { YahooCrawler };
