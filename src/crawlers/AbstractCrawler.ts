import BrowserAutomation from '../libs/BrowserAutomation';
import { CrawlResult } from '../types';

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

  public async launchBrowser(): Promise<void> {
    await this.browserAutomation.launchBrowser();
  }

  public async openPage(url: string): Promise<void> {
    await this.browserAutomation.openPage(url);
  }

  public async closeBrowser(): Promise<void> {
    await this.browserAutomation.closeBrowser();
  }

  public async waitForNetworkIdle(options?: { idleTime?: number; timeout?: number }):
  Promise<void> {
    await this.browserAutomation.waitForNetworkIdle(options);
  }

  public async waitForSelector(
    selector: string,
    timeout?: number,
  ): Promise<void> {
    await this.browserAutomation.waitForSelector(selector, timeout);
  }

  protected abstract getSponsoredLinks(selector: string, secondSelector?: string):
  Promise<string[]>;

  abstract crawl(keyword: string, pageNumber: number): Promise<CrawlResult>;
}

export default AbstractCrawler;
