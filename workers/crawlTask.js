const { parentPort, workerData } = require('worker_threads');
const {
    crawlGoogle,
    crawlYahoo,
    // crawlBing
 } = require('../crawlers');
// const { crawlBing } = require('./bingCrawler');

async function crawlPage(keyword, searchEngine, pageNumber) {
    switch (searchEngine) {
        case 'google':
            return crawlGoogle(keyword, pageNumber);
        case 'yahoo':
            return crawlYahoo(keyword, pageNumber);
        default:
            throw new Error('Unsupported search engine');
    }
}

crawlPage(workerData.keyword, workerData.searchEngine, workerData.page)
    .then(result => {
        parentPort.postMessage(result);
    })
    .catch(error => {
        parentPort.postMessage({ error: error.message });
    });

module.exports = { crawlPage };
