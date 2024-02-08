const puppeteer = require('puppeteer');
const { parseHeadlessMode } = require('../utils');
const {
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
      this.browser = null;
    }
  }

  async waitForNetworkIdle({
    idleTime = DEFAULT_IDLE_TIMEOUT,
    timeout = DEFAULT_TIMEOUT,
  } = {}) {
    await this.page.waitForNetworkIdle({ idleTime, timeout })
      .catch((e) => console.log('Network idle not reached within timeout', e));
  }

  async getSponsoredLinks() {
    throw new Error('getSponsoredLinks must be implemented by subclasses');
  }

  async crawl() {
    throw new Error("Method 'crawl()' must be implemented.");
  }
}

module.exports = { AbstractCrawler };
