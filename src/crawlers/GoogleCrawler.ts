import AbstractCrawler from './AbstractCrawler';
import {
  SearchEngines,
  GOOGLE_BASE_URL,
  GOOGLE_AD_SELECTOR,
  GOOGLE_MERCHANT_ID_SELECTOR,
  GOOGLE_MORE_RESULTS_BUTTON_SELECTOR,
  GOOGLE_MAX_SCROLLS,
  WAIT_TIMEOUT,
} from '../constants';
import { CrawlResult } from '../types';

class GoogleCrawler extends AbstractCrawler {
  private searchEngine: keyof typeof SearchEngines;

  private moreResultsButtonFound: boolean = false;

  private notFoundCounter: number = 0;

  constructor() {
    super();
    this.searchEngine = SearchEngines.GOOGLE;
  }

  private async scrollToTheBottom(): Promise<void> {
    this.moreResultsButtonFound = await this.browserAutomation.scrollToTheBottom(
      GOOGLE_MORE_RESULTS_BUTTON_SELECTOR,
      GOOGLE_MAX_SCROLLS,
      WAIT_TIMEOUT,
    );
  }

  protected async getSponsoredLinks(adSelector: string, merchantSelector: string):
  Promise<string[]> {
    return this.browserAutomation.evaluate<string[]>((adSel: string, merchantSel: string) => {
      const links: string[] = [];

      // Locate all elements with merchant IDs and extract links
      const elementsWithMerchantId = document.querySelectorAll(merchantSel);
      elementsWithMerchantId.forEach((element) => {
        const href = element.getAttribute('href');
        if (href && !links.includes(href)) {
          links.push(href);
        }
      });

      // Locate all ad elements and extract links
      const selectedElements = document.querySelectorAll(adSel);
      selectedElements.forEach((element) => {
        const href = element.getAttribute('href');
        if (href && !links.includes(href)) {
          links.push(href);
        }
      });

      return links;
    }, adSelector, merchantSelector);
  }

  private async clickMoreResultsButton(): Promise<void> {
    if (this.moreResultsButtonFound) {
      await this.browserAutomation.clickSelector(GOOGLE_MORE_RESULTS_BUTTON_SELECTOR);
    }
  }

  public async crawl(keyword: string, pageNumber: number): Promise<CrawlResult> {
    let sponsoredLinks: string[] = [];
    try {
      await this.launchBrowser();

      const url = `${GOOGLE_BASE_URL}?q=${encodeURIComponent(keyword)}&hl=en&gl=us`;
      await this.openPage(url);

      for (let i = 0; i < pageNumber; i += 1) {
        this.moreResultsButtonFound = false;

        await this.scrollToTheBottom();
        const links = await this.getSponsoredLinks(GOOGLE_AD_SELECTOR, GOOGLE_MERCHANT_ID_SELECTOR);
        sponsoredLinks = sponsoredLinks.concat(links);

        if (this.moreResultsButtonFound) {
          await this.clickMoreResultsButton();
          await this.waitForNetworkIdle();
        }
      }
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

export default GoogleCrawler;
