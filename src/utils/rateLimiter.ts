import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_WINDOW_MS, MAX_REQUESTS_PER_WINDOW } from '../constants';

const createRateLimiter = () => rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: MAX_REQUESTS_PER_WINDOW,
});

export default createRateLimiter;
