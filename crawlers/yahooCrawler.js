const puppeteer = require('puppeteer');

async function crawlYahoo(keyword, pageNum) {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Navigate to the Yahoo search page
  await page.goto(`https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}&b=${pageNum}`);

  // Wait for the ads to load using the selectors you provided
  await page.waitForSelector('.searchCenterBottomAds');
  await page.waitForSelector('.searchCenterTopAds');

  // Extract the links from the ads
  const links = await page.evaluate(() => {
    const bottomAdsLinks = Array.from(document.querySelectorAll('.searchCenterBottomAds a')).map((a) => a.href);
    const topAdsLinks = Array.from(document.querySelectorAll('.searchCenterTopAds a')).map((a) => a.href);
    return bottomAdsLinks.concat(topAdsLinks);
  });

  // Close the browser
  await browser.close();

  // Return the links
  return links;
}

module.exports = { crawlYahoo };
