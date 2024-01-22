const { parentPort, workerData } = require('worker_threads');
const { crawlGoogle } = require('../crawlers/googleCrawler');
// const { crawlBing } = require('./bingCrawler');
// const { crawlYahoo } = require('./yahooCrawler');

async function crawlPage(keyword, searchEngine, pages) {
    switch (searchEngine) {
        case 'google':
            return crawlGoogle(keyword, pages);
        // Other search engines can be added here as well.
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
