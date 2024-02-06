const puppeteer = require('puppeteer');
const { parseHeadlessMode } = require('../utils');
const { NETWORK_IDLE_EVENT, SEARCH_ENGINES } = require('../constants');
// const { SEARCH_ENGINES, NETWORK_IDLE_EVENT } = require('../constants');

class AbstractCrawler {
  constructor() {
    if (this.constructor === AbstractCrawler) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.browser = null;
    this.page = null;
  }

  async launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: parseHeadlessMode(process.env.HEADLESS_MODE),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
  }

  async openPage(url) {
    await this.page.goto(url, { waitUntil: NETWORK_IDLE_EVENT });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async getSponsoredLinks(selector, searchEngine) {
    return this.page.evaluate((sel, engine) => {
      const links = [];
      const adElements = document.querySelectorAll(sel);
      console.log('-- SEARCH_ENGINES', SEARCH_ENGINES);
      // adElements.forEach((element) => {
      //   let href;
      //   if (engine === SEARCH_ENGINES.GOOGLE) {
      //     href = element.getAttribute('href');
      //     const linkElement = element.querySelector('a');
      //     if (linkElement) {
      //       links.push(linkElement.href);
      //     }
      //   } else if (engine === SEARCH_ENGINES.YAHOO) {
      //     href = element.getAttribute('href');
      //   } else if (engine === SEARCH_ENGINES.BING) {
      //     href = element.innerText.trim();
      //   }
      //   if (href) {
      //     links.push(href);
      //   }
      // });
      // return links;
    }, selector, searchEngine);
  }

  async crawl() {
    throw new Error("Method 'crawl()' must be implemented.");
  }
}

module.exports = { AbstractCrawler };