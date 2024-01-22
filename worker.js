const puppeteer = require('puppeteer');
const { aggregateResults } = require('./aggregator');
const { crawlPage } = require('./crawlers');


async function startCrawling(pages, keywords) {
  const promises = [];
  // const searchEngines = ['google', 'bing', 'yahoo'];
  const searchEngines = ['google'];

  for (let keyword of keywords) {
    for (let searchEngine of searchEngines) {
      for (let page = 1; page <= pages; page++) {
        promises.push(crawlPage(keyword, searchEngine, page));
      }
    }
  }

  const results = await Promise.all(promises);
  return aggregateResults(results);
}

module.exports = { startCrawling };
