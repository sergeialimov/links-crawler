const puppeteer = require('puppeteer');

async function crawlYahoo(keyword, pageNum) {
  console.log(`-- crawlYahoo: crawling keyword ${keyword} on page ${pageNum}`);

  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the Yahoo search page
  await page.goto(`https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}&fp=${pageNum}`);

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

  console.log(`-- crawlYahoo: ${sponsoredLinks.length} links found for keyword ${keyword} on page ${pageNum}`);

  // Close the browser
  await browser.close();

  // Return the links
  return sponsoredLinks;
}

module.exports = { crawlYahoo };
