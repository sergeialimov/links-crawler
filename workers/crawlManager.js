const { Worker } = require('worker_threads');
const path = require('path');

const { aggregateResults, log } = require('../utils');
const { SEARCH_ENGINES } = require('../constants');

function runService(workerData) {
  const start = performance.now();
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'crawlTask.js'), { workerData });

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

async function startCrawling(pages, keywords) {
  const searchEngines = process.env.SEARCH_ENGINES.split(',');

  // For Google, generates one task per keyword. For others, one task per page per keyword.
  const tasks = keywords.flatMap((keyword) => searchEngines.flatMap((searchEngine) => {
    if (searchEngine === SEARCH_ENGINES.GOOGLE) {
      return runService({ keyword, searchEngine, page: pages });
    }
    return Array
      .from({ length: pages }, (_, i) => runService({ keyword, searchEngine, page: i + 1 }));
  }));

  const results = await Promise.all(tasks);

  return aggregateResults(results);
}

module.exports = { startCrawling };
