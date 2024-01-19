const puppeteer = require('puppeteer');
const { aggregateResults } = require('./aggregator');

async function crawlPage(keyword, searchEngine, pages) {
  // Puppeteer code to crawl each search engine page
  // Return the list of sponsored links
}

async function startCrawling(pages, keywords) {
  const promises = [];
  const searchEngines = ['google', 'bing', 'yahoo'];

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
