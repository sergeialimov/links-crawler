import { parentPort, workerData } from 'worker_threads';
import { GoogleCrawler, YahooCrawler, BingCrawler } from '../crawlers';
import { SearchEngines } from '../constants';

async function crawlPage(keyword: string, searchEngine: string, pageNumber: number) {
  switch (searchEngine) {
    case SearchEngines.GOOGLE: {
      const googleCrawler = new GoogleCrawler();
      return googleCrawler.crawl(keyword, pageNumber);
    }
    case SearchEngines.YAHOO: {
      const yahooCrawler = new YahooCrawler();
      return yahooCrawler.crawl(keyword, pageNumber);
    }
    case SearchEngines.BING: {
      const bingCrawler = new BingCrawler();
      return bingCrawler.crawl(keyword, pageNumber);
    }
    default:
      throw new Error(`Unsupported search engine ${searchEngine}`);
  }
}

async function executeCrawl() {
  try {
    const result = await crawlPage(
      workerData.keyword,
      workerData.searchEngine,
      workerData.page,
    );
    if (parentPort) {
      parentPort.postMessage(result);
    }
  } catch (error) {
    if (error instanceof Error && parentPort) {
      parentPort.postMessage({ error: error.message });
    } else if (parentPort) {
      parentPort.postMessage({ error: 'An unknown error occurred' });
    }
  }
}

executeCrawl();

export default crawlPage;
