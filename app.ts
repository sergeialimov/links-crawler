import express, { Express } from 'express';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/sponsoredLinksRoutes';

// Initialize dotenv to use environment variables
dotenv.config();

const app: Express = express();
const host = process.env.HOST || 'localhost';
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json());

// Routes
apiRoutes(app);

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
