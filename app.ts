import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import apiRoutes from './src/routes/sponsoredLinksRoutes';
import { createRateLimiter } from './src/utils';

// Initialize dotenv to use environment variables
dotenv.config();

// Initialize the Express application and set the host and port from environment variables
const app: Express = express();
const host = process.env.HOST || 'localhost';
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json());

// Set Content Security Policy to prevent cross-site scripting (XSS) and related attacks
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
  },
}));

// Apply rate limiting middleware
const limiter = createRateLimiter();
app.use(limiter);

// Routes
apiRoutes(app);

// Error handling middleware for unexpected issues
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Server error.');
});

// Starting the server
const server = app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});

// Graceful shutdown with async/await
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully');

  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error('Error during server shutdown', err);
        reject(err);
        return;
      }
      console.log('Server closed');
      resolve(null);
    });
  }).catch((err) => {
    console.error('Failed to close server gracefully', err);
    process.exit(1);
  });

  process.exit(0);
});
