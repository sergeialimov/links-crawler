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

  private ensurePageIsInitialized(): void {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
  }

  public isPageSet(): boolean {
    return this.page !== null;
  }

  public async openPage(url: string): Promise<void> {
    this.ensurePageIsInitialized();
    await this.page!.goto(url, { waitUntil: NETWORK_IDLE_EVENT as PuppeteerLifeCycleEvent });
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  public async waitForNetworkIdle({
    idleTime = DEFAULT_IDLE_TIMEOUT,
    timeout = DEFAULT_TIMEOUT,
  } = {}): Promise<void> {
    this.ensurePageIsInitialized();
    await this.page!.waitForNetworkIdle({ idleTime, timeout })
      .catch((e) => console.log('Network idle not reached within timeout', e));
  }

  public async click(selector: string): Promise<void> {
    this.ensurePageIsInitialized();
    await this.page!.click(selector);
  }

  public async waitForSelector(
    selector: string,
    timeout = WAIT_TIMEOUT,
  ): Promise<ElementHandle<Element> | null> {
    this.ensurePageIsInitialized();
    try {
      return await this.page!.waitForSelector(selector, { timeout });
    } catch (error) {
      return null;
    }
  }

  public async evaluate<T>(
    pageFunction: (...args: any[]) => T,
    ...args: any[]
  ): Promise<T> {
    this.ensurePageIsInitialized();
    return await this.page!.evaluate(pageFunction, ...args) as T;
  }

  public async waitForTimeout(timeout = WAIT_TIMEOUT): Promise<void> {
    this.ensurePageIsInitialized();
    await new Promise((resolve) => { setTimeout(resolve, timeout); });
  }

  public async scrollToTheBottom(
    selector: string,
    maxScrolls: number,
    waitTimeout: number,
  ): Promise<boolean> {
    this.ensurePageIsInitialized();
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
    this.ensurePageIsInitialized();
    await this.page!.waitForSelector(selector, { visible: true });
    await this.page!.click(selector);
  }
}

export default BrowserAutomation;
