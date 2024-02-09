import AbstractCrawler from './AbstractCrawler';
import {
  SearchEngines,
  RESULTS_PER_PAGE,
  BING_BASE_URL,
  BING_URL_SELECTOR,
  BING_COOKIE_BUTTON_SELECTOR,
} from '../constants';

import { CrawlResult } from '../interfaces/types';

class BingCrawler extends AbstractCrawler {
  private searchEngine: keyof typeof SearchEngines;

  constructor() {
    super();
    this.searchEngine = SearchEngines.BING;
  }

  async getSponsoredLinks(selector: string): Promise<string[]> {
    if (!this.isPageSet()) {
      throw new Error('Page is not initialized');
    }
    return this.browserAutomation.evaluate<string[]>((sel) => {
      const ads = Array.from(document.querySelectorAll(sel));
      const links: string[] = [];
      ads.forEach((ad) => {
        const htmlElement = ad as HTMLElement;
        if (htmlElement.innerText.trim() !== '' && !links.includes(htmlElement.innerText.trim())) {
          links.push(htmlElement.innerText.trim());
        }
      });
      return links;
    }, selector);
  }

  async crawl(keyword: string, pageNumber: number): Promise<CrawlResult> {
    await this.launchBrowser();
    let sponsoredLinks: string[] = [];

    try {
      const offset = (pageNumber - 1) * RESULTS_PER_PAGE;
      const url = `${BING_BASE_URL}?q=${encodeURIComponent(keyword)}&first=${offset}`;

      await this.openPage(url);

      // Handling the cookie consent pop-up
      const cookieButton = await this.browserAutomation
        .waitForSelector(BING_COOKIE_BUTTON_SELECTOR);
      if (cookieButton !== null) {
        await this.browserAutomation.click(BING_COOKIE_BUTTON_SELECTOR);
      }

      // Wait for the sponsored ads to load
      const el = await this.browserAutomation.waitForSelector(BING_URL_SELECTOR);

      if (el) {
        sponsoredLinks = await this.getSponsoredLinks(BING_URL_SELECTOR);
      }

      return {
        searchEngine: this.searchEngine,
        keyword,
        sponsoredLinks,
        pageNumber,
      };
    } catch (error) {
      console.error(`Error occurred while crawling ${this.searchEngine}: ${error}`);
      throw error;
    } finally {
      await this.closeBrowser();
    }
  }
}

export default BingCrawler;
