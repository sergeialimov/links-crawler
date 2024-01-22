const puppeteer = require('puppeteer');

async function crawlBing(keyword, pageNumber) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Calculate the offset for the Bing search results based on the page number.
  const offset = (pageNumber - 1) * 10;
  const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&first=${offset}`;

  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Handling the cookie consent pop-up
  const cookieButtonSelector = '#bnp_btn_accept'; // Selector for the 'Accept' button in the cookie consent pop-up
  if (await page.$(cookieButtonSelector) !== null) {
    await page.click(cookieButtonSelector);
  }

  // Wait for the sponsored ads to load
  await page.waitForSelector('.b_ad');

  // Extract the sponsored links
  const sponsoredLinks = await page.evaluate(() => {
    const ads = document.querySelectorAll('.b_ad');
    return Array.from(ads).map((ad) => {
      // We now need to look for the 'a' tag since the structure is different in headless mode
      const linkElement = ad.querySelector('a');
      return linkElement ? linkElement.href : '';
    }).filter((href) => href); // Filter out any empty strings
  });

  await browser.close();
  return {
    searchEngine: 'bing',
    keyword,
    sponsoredLinks,
    page: pageNumber,
  };
}

module.exports = { crawlBing };
