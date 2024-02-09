import { Application, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import startCrawling from '../workers/crawlManager';
import { MAX_PAGES } from '../constants';

const apiRoutes = (app: Application): void => {
  app.get('/api/v1/sponsored-links', [
    check('pages').isInt({ min: 1, max: MAX_PAGES }),
    check('keywords').isString().notEmpty(),
  ], asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const pages = parseInt(req.query.pages as string, 10);
    const keywords = req.query.keywords as string;
    const keywordsArray = keywords.split(',');

    console.log('Crawling has been started');
    const start = performance.now();
    const results = await startCrawling(pages, keywordsArray);
    const end = performance.now();
    console.log(`Crawling has been finished and took ${Math.round(end - start)} ms`);

    res.json(results);
  }));

  app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
};

export default apiRoutes;
