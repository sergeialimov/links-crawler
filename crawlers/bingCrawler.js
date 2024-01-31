const puppeteer = require('puppeteer');

const { bingUrlSelector } = require('../constants');

async function crawlBing(keyword, pageNumber) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Calculate the offset for the Bing search results based on the page number.
  const offset = (pageNumber - 1) * 10;
  const url = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&first=${offset}`;

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Handling the cookie consent pop-up
  const cookieButtonSelector = '#bnp_btn_accept'; // Selector for the 'Accept' button in the cookie consent pop-up
  if (await page.$(cookieButtonSelector) !== null) {
    await page.click(cookieButtonSelector);
  }

  // Wait for the sponsored ads to load
  await page.waitForSelector(bingUrlSelector);

  const sponsoredLinks = await page.evaluate((sel) => {
    const ads = document.querySelectorAll(sel);
    // Extract the text content, which is the URL
    return Array.from(ads).map((attribute) => attribute.innerText.trim());
  }, bingUrlSelector);

  await browser.close();

  return {
    searchEngine: 'bing',
    keyword,
    sponsoredLinks,
    page: pageNumber,
  };
}

module.exports = { crawlBing };
