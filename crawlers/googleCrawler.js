const puppeteer = require('puppeteer');

async function crawlGoogle(keyword, pages) {
    let browser, page;
    console.log('-- crawlGoogle');
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${(pages - 1) * 10}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        let lastHeight = await page.evaluate('document.body.scrollHeight'), newHeight;
        let stabilizationCount = 0;

        while (stabilizationCount < 3) {  // We wait for 3 consecutive checks where the height does not change
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForNetworkIdle();  // This waits for network activity to be idle for 500ms

            newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === lastHeight) {
                stabilizationCount++;
            } else {
                stabilizationCount = 0;  // Reset the count if the height changed
                lastHeight = newHeight;
            }

            // Wait a short while to give the page a chance to start any new network activity
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Extract the sponsored links
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
        console.log('-- sponsoredLinks', sponsoredLinks.length);

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
