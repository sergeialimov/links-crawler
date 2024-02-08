import BrowserAutomation from '../libs/BrowserAutomation';
import { CrawlResult } from '../interfaces/types';

abstract class AbstractCrawler {
  protected browserAutomation: BrowserAutomation;

  constructor() {
    if (new.target === AbstractCrawler) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.browserAutomation = new BrowserAutomation();
  }

  public isPageSet(): boolean {
    return this.browserAutomation.isPageSet();
  }

  async launchBrowser(): Promise<void> {
    await this.browserAutomation.launchBrowser();
  }

  async openPage(url: string): Promise<void> {
    await this.browserAutomation.openPage(url);
  }

  async closeBrowser(): Promise<void> {
    await this.browserAutomation.closeBrowser();
  }

  async waitForNetworkIdle(options?: { idleTime?: number; timeout?: number }): Promise<void> {
    await this.browserAutomation.waitForNetworkIdle(options);
  }

  async waitForSelector(
    selector: string,
    timeout?: number,
  ): Promise<void> {
    await this.browserAutomation.waitForSelector(selector, timeout);
  }

  abstract getSponsoredLinks(selector: string, secondSelector?: string): Promise<string[]>;

  abstract crawl(keyword: string, pageNumber: number): Promise<CrawlResult>;
}

export default AbstractCrawler;
