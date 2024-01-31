const { Worker } = require('worker_threads');
const path = require('path');

const { aggregateResults, log } = require('../utils');

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

  // Create an array of tasks using array methods instead of loops
  const tasks = keywords.flatMap((keyword) => searchEngines.flatMap((searchEngine) => Array
    .from({ length: pages }, (_, i) => runService({ keyword, searchEngine, page: i + 1 }))));

  const results = await Promise.all(tasks);

  return aggregateResults(results);
}

module.exports = { startCrawling };
