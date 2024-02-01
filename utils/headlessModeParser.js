const { HEADLESS_MODE_VALUES } = require('../constants');

function parseHeadlessMode(value) {
  const lowerCaseValue = value.toLowerCase();
  return HEADLESS_MODE_VALUES[lowerCaseValue] || HEADLESS_MODE_VALUES.FALSE;
}

module.exports = { parseHeadlessMode };
