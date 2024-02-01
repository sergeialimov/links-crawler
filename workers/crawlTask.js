const { parentPort, workerData } = require('worker_threads');
const { GoogleCrawler } = require('../crawlers/googleCrawler'); // Adjust path as necessary
const {
  crawlYahoo,
  crawlBing,
} = require('../crawlers'); // Keep the other crawlers as they are

async function crawlPage(keyword, searchEngine, pageNumber) {
  switch (searchEngine) {
    case 'google': {
      const googleCrawler = new GoogleCrawler();
      return googleCrawler.crawlGoogle(keyword, pageNumber);
    }
    case 'yahoo':
      return crawlYahoo(keyword, pageNumber);
    case 'bing':
      return crawlBing(keyword, pageNumber);
    default:
      throw new Error('Unsupported search engine');
  }
}

crawlPage(workerData.keyword, workerData.searchEngine, workerData.page)
  .then((result) => {
    parentPort.postMessage(result);
  })
  .catch((error) => {
    parentPort.postMessage({ error: error.message });
  });

module.exports = { crawlPage };
