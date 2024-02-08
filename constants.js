// Common
const SEARCH_ENGINES = {
  BING: 'bing',
  GOOGLE: 'google',
  YAHOO: 'yahoo',
};
const RESULTS_PER_PAGE = 10;
const NETWORK_IDLE_EVENT = 'networkidle2';

const HEADLESS_MODE_VALUES = {
  TRUE: true,
  FALSE: false,
  NEW: 'new',
};

const WAIT_TIMEOUT = 1000;
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_IDLE_TIMEOUT = 500;

// Bing
const BING_BASE_URL = 'https://www.bing.com/search';
const BING_URL_SELECTOR = '.b_adurl cite';
const BING_COOKIE_BUTTON_SELECTOR = '#bnp_btn_accept';

// Yahoo
const YAHOO_AD_SELECTORS = 'a[data-matarget="ad-ql"], a[data-matarget="ad"]';
const YAHOO_BASE_URL = 'https://search.yahoo.com/search';

// Google
const GOOGLE_BASE_URL = 'https://www.google.com/search';
const GOOGLE_AD_SELECTOR = '[data-text-ad]';
const GOOGLE_MERCHANT_ID_SELECTOR = '[data-merchant-id]';
const GOOGLE_MORE_RESULTS_BUTTON_SELECTOR = 'a[role="button"][aria-label="More results"]';
const GOOGLE_MAX_SCROLLS = 10;

module.exports = {
  // Common
  SEARCH_ENGINES,
  RESULTS_PER_PAGE,
  NETWORK_IDLE_EVENT,
  HEADLESS_MODE_VALUES,
  DEFAULT_TIMEOUT,
  DEFAULT_IDLE_TIMEOUT,
  WAIT_TIMEOUT,

  // Bing
  BING_BASE_URL,
  BING_URL_SELECTOR,
  BING_COOKIE_BUTTON_SELECTOR,

  // Yahoo
  YAHOO_BASE_URL,
  YAHOO_AD_SELECTORS,

  // Google
  GOOGLE_BASE_URL,
  GOOGLE_AD_SELECTOR,
  GOOGLE_MERCHANT_ID_SELECTOR,
  GOOGLE_MORE_RESULTS_BUTTON_SELECTOR,
  GOOGLE_MAX_SCROLLS,
};
