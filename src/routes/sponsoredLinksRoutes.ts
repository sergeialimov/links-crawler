import {
  Application, Request, Response, NextFunction,
} from 'express';
import startCrawling from '../workers/crawlManager';

import { MAX_PAGES } from '../constants';

const apiRoutes = (app: Application): void => {
  app.get('/api/v1/sponsored-links', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pages = parseInt(req.query.pages as string, 10);
      const keywords = req.query.keywords as string;

      if (Number.isNaN(pages) || pages <= 0 || pages > MAX_PAGES || !keywords) {
        return res.status(400).send(`You must provide both pages as a number (1 to ${MAX_PAGES}) and non-empty keywords parameters`);
      }

      const keywordsArray = keywords.split(',');

      console.log('Crawling has been started');

      const start = performance.now();
      const results = await startCrawling(pages, keywordsArray);
      const end = performance.now();

      console.log(`Crawling has been finished and took ${Math.round(end - start)} ms`);

      return res.json(results);
    } catch (error) {
      return next(error); // Pass the error to the error handling middleware and return
    }
  });

  // Error handling middleware
  // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
};

export default apiRoutes;
