const puppeteer = require('puppeteer');

async function crawlYahoo(keyword, pageNumber) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Navigate to the Yahoo search page
  await page.goto(`https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}&fp=${pageNumber}`);

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

  await browser.close();

  return {
    searchEngine: 'yahoo',
    keyword,
    sponsoredLinks,
    pageNum: pageNumber,
  };
}

module.exports = { crawlYahoo };
