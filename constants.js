// Common
const SEARCH_ENGINES = {
  BING: 'bing',
  GOOGLE: 'google',
  YAHOO: 'yahoo',
};
const RESULTS_PER_PAGE = 10;

// Bing
const BING_BASE_URL = 'https://www.bing.com/search?q=';
const BING_URL_SELECTOR = '.b_adurl cite';
const BING_NETWORK_IDLE_EVENT = 'networkidle2';
const BING_COOKIE_BUTTON_SELECTOR = '#bnp_btn_accept';

// Yahoo
const YAHOO_AD_SELECTORS = 'a[data-matarget="ad-ql"], a[data-matarget="ad"]';
const YAHOO_BASE_URL = 'https://search.yahoo.com/search?p=';

module.exports = {
  // Common
  RESULTS_PER_PAGE,
  SEARCH_ENGINES,

  // Bing
  BING_BASE_URL,
  BING_URL_SELECTOR,
  BING_NETWORK_IDLE_EVENT,
  BING_COOKIE_BUTTON_SELECTOR,

  // Yahoo
  YAHOO_AD_SELECTORS,
  YAHOO_BASE_URL,
};
