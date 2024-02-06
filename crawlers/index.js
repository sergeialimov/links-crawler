const { YahooCrawler } = require('./yahooCrawler');
const { GoogleCrawler } = require('./googleCrawler');
const { crawlBing } = require('./bingCrawler');

module.exports = {
  YahooCrawler,
  GoogleCrawler,
  crawlBing,
};
