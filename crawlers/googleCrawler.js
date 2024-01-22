/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');

async function crawlGoogle(keyword, pages) {
  let browser;
  let page;

  try {
    console.log('-- crawlGoogle');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${(pages - 1) * 10}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    let lastHeight = await page.evaluate('document.body.scrollHeight'); let
      newHeight;
    let stabilizationCount = 0;

    while (stabilizationCount < 3) { // We wait for 3 checks where the height does not change
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForNetworkIdle(); // This waits for network activity to be idle for 500ms

      newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === lastHeight) {
        stabilizationCount += 1;
      } else {
        stabilizationCount = 0; // Reset the count if the height changed
        lastHeight = newHeight;
      }

      // Wait a short while to give the page a chance to start any new network activity
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    }

    // Extract the sponsored links
    const sponsoredLinks = await page.evaluate(() => {
      const links = [];
      const ads = document.querySelectorAll('[data-text-ad]');
      ads.forEach((ad) => {
        const linkElement = ad.querySelector('a');
        if (linkElement) {
          links.push(linkElement.href);
        }
      });
      return links;
    });
    // add logs about number of sponsored links found, mention keyword and page number
    console.log(`-- crawlGoogle: ${sponsoredLinks.length} sponsored links found for keyword ${keyword} on page ${pages}`);

    return sponsoredLinks;
  } catch (error) {
    console.error('Error in crawlGoogle:', error.message);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { crawlGoogle };
