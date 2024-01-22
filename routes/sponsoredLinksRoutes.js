const { startCrawling } = require('../workers/crawlManager');

function apiRoutes(app) {
  app.get('/api/v1/sponsored-links', async (req, res) => {
    try {
      const { pages, keywords } = req.query;
      const keywordsArray = keywords.split(',');
      const results = await startCrawling(pages, keywordsArray);
      res.json(results);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
}

module.exports = apiRoutes;
