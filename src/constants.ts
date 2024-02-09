// Common
export enum SearchEngines {
  BING = 'BING',
  GOOGLE = 'GOOGLE',
  YAHOO = 'YAHOO',
}
export const RESULTS_PER_PAGE = 10;
export const NETWORK_IDLE_EVENT = 'networkidle2';
export const MAX_PAGES = 10;

export const HEADLESS_MODE_VALUES = {
  TRUE: true,
  FALSE: false,
  // NEW: 'new', // not relevant in v22
} as const;

export const WAIT_TIMEOUT = 1000;
export const DEFAULT_TIMEOUT = 10000;
export const DEFAULT_IDLE_TIMEOUT = 500;

// Bing
export const BING_BASE_URL = 'https://www.bing.com/search';
export const BING_URL_SELECTOR = '.b_adurl cite';
export const BING_COOKIE_BUTTON_SELECTOR = '#bnp_btn_accept';

// Yahoo
export const YAHOO_AD_SELECTORS = 'a[data-matarget="ad-ql"], a[data-matarget="ad"]';
export const YAHOO_BASE_URL = 'https://search.yahoo.com/search';

// Google
export const GOOGLE_BASE_URL = 'https://www.google.com/search';
export const GOOGLE_AD_SELECTOR = '[data-text-ad]';
export const GOOGLE_MERCHANT_ID_SELECTOR = '[data-merchant-id]';
export const GOOGLE_MORE_RESULTS_BUTTON_SELECTOR = 'a[role="button"][aria-label="More results"]';
export const GOOGLE_MAX_SCROLLS = 10;

// Rate limiter
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_REQUESTS_PER_WINDOW = 100;
