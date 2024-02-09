import puppeteer, {
  Browser, Page, ElementHandle, PuppeteerLifeCycleEvent,
} from 'puppeteer';
import { parseHeadlessMode } from '../utils';
import {
  NETWORK_IDLE_EVENT,
  DEFAULT_TIMEOUT,
  DEFAULT_IDLE_TIMEOUT,
  WAIT_TIMEOUT,
} from '../constants';

class BrowserAutomation {
  private browser: Browser | null = null;

  private page: Page | null = null;

  async launchBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: parseHeadlessMode(process.env.HEADLESS_MODE),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
  }

  public isPageSet(): boolean {
    return this.page !== undefined && this.page !== null;
  }

  async openPage(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    await this.page.goto(url, { waitUntil: NETWORK_IDLE_EVENT as PuppeteerLifeCycleEvent });
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async waitForNetworkIdle({
    idleTime = DEFAULT_IDLE_TIMEOUT,
    timeout = DEFAULT_TIMEOUT,
  } = {}): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    await this.page.waitForNetworkIdle({ idleTime, timeout })
      .catch((e) => console.log('Network idle not reached within timeout', e));
  }

  public async click(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    await this.page.click(selector);
  }

  public async waitForSelector(
    selector: string,
    timeout = WAIT_TIMEOUT,
  ): Promise<ElementHandle<Element> | null> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    try {
      return await this.page.waitForSelector(selector, { timeout });
    } catch (error) {
      console.log(`Selector ${selector} not found, proceeding without it`);
      return null;
    }
  }

  public async evaluate<T>(
    pageFunction: (...args: any[]) => T,
    ...args: any[]
  ): Promise<T> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    const result = await this.page.evaluate(pageFunction as any, ...args);
    return result as T;
  }

  public async waitForTimeout(timeout = WAIT_TIMEOUT): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    await new Promise((resolve) => { setTimeout(resolve, timeout); });
  }

  public async scrollToTheBottom(
    selector: string,
    maxScrolls: number,
    waitTimeout: number,
  ): Promise<boolean> {
    let notFoundCounter = 0;
    let buttonFound = false;

    while (!buttonFound && notFoundCounter < maxScrolls) {
      await this.evaluate(async () => {
        const { scrollHeight } = document.body;
        for (let j = 0; j < scrollHeight; j += 200) {
          window.scrollTo(0, j);
        }
      });

      await this.waitForTimeout(waitTimeout);
      const moreResultsButton = await this.waitForSelector(selector);
      if (moreResultsButton) {
        buttonFound = true;
      } else {
        notFoundCounter += 1;
      }
    }

    return buttonFound;
  }

  public async clickSelector(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    await this.page.waitForSelector(selector, { visible: true });
    await this.page.click(selector);
  }
}

export default BrowserAutomation;
