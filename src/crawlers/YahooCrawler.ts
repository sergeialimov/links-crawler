import AbstractCrawler from './AbstractCrawler';
import {
  SearchEngines,
  YAHOO_AD_SELECTORS,
  YAHOO_BASE_URL,
} from '../constants';

import { CrawlResult } from '../interfaces/types';

class YahooCrawler extends AbstractCrawler {
  private searchEngine: keyof typeof SearchEngines;

  constructor() {
    super();
    this.searchEngine = SearchEngines.YAHOO;
  }

  async getSponsoredLinks(selector: string): Promise<string[]> {
    if (!this.isPageSet()) {
      throw new Error('Page is not initialized');
    }
    return this.browserAutomation.evaluate((sel: string) => {
      const links: string[] = [];
      const adElements = document.querySelectorAll(sel);
      adElements.forEach((element) => {
        const href = element.getAttribute('href');
        if (href && !links.includes(href)) {
          links.push(href);
        }
      });
      return links;
    }, selector);
  }

  async crawl(keyword: string, pageNumber: number): Promise<CrawlResult> {
    let sponsoredLinks: string[] = [];
    try {
      await this.launchBrowser();

      const url = `${YAHOO_BASE_URL}?p=${encodeURIComponent(keyword)}&fp=${pageNumber}`;
      await this.openPage(url);

      sponsoredLinks = await this.getSponsoredLinks(YAHOO_AD_SELECTORS);
    } catch (error) {
      console.error(`Error occurred while crawling ${this.searchEngine}: ${error}`);
      throw error;
    } finally {
      await this.closeBrowser();
    }

    return {
      searchEngine: this.searchEngine,
      keyword,
      sponsoredLinks,
      pageNumber,
    };
  }
}

export default YahooCrawler;
