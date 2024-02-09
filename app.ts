import express, { Express } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/sponsoredLinksRoutes';

// Initialize dotenv to use environment variables
dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(bodyParser.json());

// Routes
apiRoutes(app);

// Starting the server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
