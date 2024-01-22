const { Worker } = require('worker_threads');
const path = require('path');

const { aggregateResults } = require('../utils/aggregator');

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'crawlTask.js'), { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function startCrawling(pages, keywords) {
  const searchEngines = [
    // 'google',
    'yahoo',
    // 'bing'
  ];

  // Create an array of tasks using array methods instead of loops
  const tasks = keywords.flatMap((keyword) => searchEngines.flatMap((searchEngine) => Array
    .from({ length: pages }, (_, i) => runService({ keyword, searchEngine, page: i + 1 }))));

  // Wait for all the tasks to complete
  const results = await Promise.all(tasks);

  return aggregateResults(results);
}

module.exports = { startCrawling };
