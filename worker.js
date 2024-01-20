const puppeteer = require('puppeteer');
const { aggregateResults } = require('./aggregator');

async function crawlPage(keyword, searchEngine, pages) {
  let browser, page;
  try {
      // Launch the browser
      browser = await puppeteer.launch();
      page = await browser.newPage();

      // URL construction based on the search engine
      let url;
      switch (searchEngine) {
          case 'google':
              url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${(pages - 1) * 10}`;
              break;
          case 'bing':
              url = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&first=${(pages - 1) * 10 + 1}`;
              break;
          case 'yahoo':
              url = `https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}&b=${(pages - 1) * 10 + 1}`;
              break;
          default:
              throw new Error('Unsupported search engine');
      }

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Extract sponsored links
      // The selector used here is hypothetical and needs to be adjusted based on the actual page structure
      const sponsoredLinks = await page.evaluate(() => {
          const links = [];
          const ads = document.querySelectorAll('selector-for-sponsored-links'); // Replace with actual selector for sponsored links
          ads.forEach(ad => {
              const link = ad.querySelector('a').href;
              links.push(link);
          });
          return links;
      });

      return sponsoredLinks;
  } catch (error) {
      console.error('Error in crawlPage:', error.message);
      return [];
  } finally {
      if (browser) {
          await browser.close();
      }
  }
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
