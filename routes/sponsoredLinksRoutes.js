const { startCrawling } = require('../workers/crawlManager');

function apiRoutes(app) {
  app.get('/api/v1/sponsored-links', async (req, res) => {
    try {
      const { pages, keywords } = req.query;

      if (!pages || !keywords) {
        return res.status(400).send('You must provide both pages and keywords parameters');
      }

      const keywordsArray = keywords.split(',');

      console.log('Crawling has been started');

      const start = performance.now();
      const results = await startCrawling(pages, keywordsArray);
      const end = performance.now();

      console.log(`Crawling has been finished and took ${Math.round(end - start)} ms`);

      return res.json(results);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
}

module.exports = apiRoutes;
