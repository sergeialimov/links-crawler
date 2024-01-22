const puppeteer = require('puppeteer');

async function crawlGoogle(keyword, pages) {
    let browser, page;
    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${(pages - 1) * 10}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const sponsoredLinks = await page.evaluate(() => {
            const links = [];
            const ads = document.querySelectorAll('[data-text-ad]');
            ads.forEach(ad => {
                const linkElement = ad.querySelector('a');
                if (linkElement) {
                    links.push(linkElement.href);
                }
            });
            return links;
        });

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
