const puppeteer = require('puppeteer');
const { parseHeadlessMode } = require('../utils');
const {
  SEARCH_ENGINES,
  NETWORK_IDLE_EVENT,
  DEFAULT_TIMEOUT,
  DEFAULT_IDLE_TIMEOUT,
} = require('../constants');

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

  async waitForNetworkIdle({
    idleTime = DEFAULT_IDLE_TIMEOUT,
    timeout = DEFAULT_TIMEOUT,
  } = {}) {
    await this.page.waitForNetworkIdle({ idleTime, timeout })
      .catch((e) => console.log('Network idle not reached within timeout', e));
  }

  async getSponsoredLinks(selector, searchEngine) {
    return this.page.evaluate((sel, engine, engines) => {
      const links = [];
      const adElements = document.querySelectorAll(sel);
      adElements.forEach((element) => {
        let href;
        if (engine === engines.GOOGLE) {
          href = element.getAttribute('href');
          const linkElement = element.querySelector('a');
          if (linkElement) {
            links.push(linkElement.href);
          }
        } else if (engine === engines.YAHOO) {
          href = element.getAttribute('href');
        } else if (engine === engines.BING) {
          href = element.innerText.trim();
        }
        if (href) {
          links.push(href);
        }
      });
      return links;
    }, selector, searchEngine, SEARCH_ENGINES);
  }

  async crawl() {
    throw new Error("Method 'crawl()' must be implemented.");
  }
}

module.exports = { AbstractCrawler };
