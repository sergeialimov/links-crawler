const SEARCH_ENGINES = {
  BING: 'bing',
  GOOGLE: 'google',
  YAHOO: 'yahoo',
};
const RESULTS_PER_PAGE = 10;
const BING_BASE_URL = 'https://www.bing.com/search?q=';
const BING_URL_SELECTOR = '.b_adurl cite';
const BING_NETWORK_IDLE_EVENT = 'networkidle2';
const BING_COOKIE_BUTTON_SELECTOR = '#bnp_btn_accept';

module.exports = {
  RESULTS_PER_PAGE,
  SEARCH_ENGINES,
  BING_BASE_URL,
  BING_URL_SELECTOR,
  BING_NETWORK_IDLE_EVENT,
  BING_COOKIE_BUTTON_SELECTOR,
};
