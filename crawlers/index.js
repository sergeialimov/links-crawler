const { crawlGoogle } = require('./googleCrawler');
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

module.exports = { crawlPage };
