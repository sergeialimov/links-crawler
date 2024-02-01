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

module.exports = {
  // Common
  RESULTS_PER_PAGE,
  SEARCH_ENGINES,
  NETWORK_IDLE_EVENT,
  HEADLESS_MODE_VALUES,

  // Bing
  BING_BASE_URL,
  BING_URL_SELECTOR,
  BING_COOKIE_BUTTON_SELECTOR,

  // Yahoo
  YAHOO_AD_SELECTORS,
  YAHOO_BASE_URL,

  // Google
  GOOGLE_BASE_URL,
  GOOGLE_AD_SELECTOR,
};
