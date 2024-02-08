import { Worker } from 'worker_threads';
import path from 'path';
import { performance } from 'perf_hooks';

import { aggregateResults, log } from '../utils';
import { SearchEngines } from '../constants';

interface CrawlTaskData {
  keyword: string;
  searchEngine: string;
  page: number;
}

function runService(workerData: CrawlTaskData): Promise<any> {
  const start = performance.now();
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, '../dist/workers/crawlTask.js'), { workerData });

    worker.on('message', (result) => {
      const end = performance.now();
      log(workerData, start, end, result.sponsoredLinks);
      resolve(result);
    });

    worker.on('error', reject);

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`${workerData.searchEngine} worker stopped with exit code ${code}`));
      }
    });
  });
}

async function startCrawling(pages: number, keywords: string[]): Promise<any> {
  const searchEngines = process.env.SEARCH_ENGINES ? process.env.SEARCH_ENGINES.split(',') : [];

  const tasks: Promise<any>[] = [];

  // For Google, generates one task per keyword. For others, one task per page per keyword
  keywords.forEach((keyword) => {
    searchEngines.forEach((searchEngine) => {
      if (searchEngine === SearchEngines.GOOGLE) {
        tasks.push(runService({ keyword, searchEngine, page: pages }));
      } else {
        for (let i = 1; i <= pages; i += 1) {
          tasks.push(runService({ keyword, searchEngine, page: i }));
        }
      }
    });
  });

  const results = await Promise.all(tasks);

  return aggregateResults(results);
}

export default startCrawling;
