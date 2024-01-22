const puppeteer = require('puppeteer');

async function crawlYahoo(keyword, pageNumber) {
  console.log(`-- crawlYahoo: crawling keyword ${keyword} on page ${pageNumber}`);

  // Launch the browser
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Navigate to the Yahoo search page
  await page.goto(`https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}&fp=${pageNumber}`);

  // Extract links from elements with data-matarget="ad-ql" and "ad"
  const sponsoredLinks = await page.evaluate(() => {
    const adElements = document.querySelectorAll('a[data-matarget="ad-ql"], a[data-matarget="ad"]');
    const links = [];
    adElements.forEach((element) => {
      const href = element.getAttribute('href');
      if (href) {
        links.push(href);
      }
    });
    return links;
  });

  console.log(`-- crawlYahoo: ${sponsoredLinks.length} links found for keyword ${keyword} on page ${pageNumber}`);

  // Close the browser
  await browser.close();

  // Return the links
  return {
    searchEngine: 'yahoo',
    keyword,
    sponsoredLinks,
    pageNum: pageNumber,
  };
}

module.exports = { crawlYahoo };
