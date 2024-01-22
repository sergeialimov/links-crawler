// const { aggregateResults } = require('../utils/aggregator');
// const { crawlPage } = require('../crawlers');


// async function startCrawling(pages, keywords) {
//   const promises = [];
//   // const searchEngines = ['google', 'bing', 'yahoo'];
//   const searchEngines = ['google'];

//   for (let keyword of keywords) {
//     for (let searchEngine of searchEngines) {
//       for (let page = 1; page <= pages; page++) {
//         promises.push(crawlPage(keyword, searchEngine, page));
//       }
//     }
//   }

//   const results = await Promise.all(promises);
//   return aggregateResults(results);
// }

const { Worker } = require('worker_threads');
const path = require('path');

function runService(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, 'crawlTask.js'), { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

async function startCrawling(pages, keywords) {
    const promises = [];
    const searchEngines = ['google'];

    for (let keyword of keywords) {
        for (let searchEngine of searchEngines) {
            for (let page = 1; page <= pages; page++) {
                promises.push(runService({ keyword, searchEngine, page }));
            }
        }
    }

    const results = await Promise.all(promises);
    // Aggregate and process results
    return results; // Modify as needed
}


module.exports = { startCrawling };