const { parentPort, workerData } = require('worker_threads');
const { GoogleCrawler, YahooCrawler, BingCrawler } = require('../crawlers');
const { SEARCH_ENGINES } = require('../constants');

async function crawlPage(keyword, searchEngine, pageNumber) {
  switch (searchEngine) {
    case SEARCH_ENGINES.GOOGLE: {
      const googleCrawler = new GoogleCrawler();
      return googleCrawler.crawl(keyword, pageNumber);
    }
    case SEARCH_ENGINES.YAHOO: {
      const yahooCrawler = new YahooCrawler();
      return yahooCrawler.crawl(keyword, pageNumber);
    }
    case SEARCH_ENGINES.BING: {
      const bingCrawler = new BingCrawler();
      return bingCrawler.crawl(keyword, pageNumber);
    }
    default:
      throw new Error(`Unsupported search engine ${searchEngine}`);
  }
}

async function executeCrawl() {
  try {
    const result = await crawlPage(
      workerData.keyword,
      workerData.searchEngine,
      workerData.page,
    );
    parentPort.postMessage(result);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}

executeCrawl();

module.exports = { crawlPage };
