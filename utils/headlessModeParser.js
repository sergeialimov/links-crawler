const { HEADLESS_MODE_VALUES } = require('../constants');

function parseHeadlessMode(value) {
  const upperCaseValue = value.toUpperCase();
  return HEADLESS_MODE_VALUES[upperCaseValue] || HEADLESS_MODE_VALUES.FALSE;
}

module.exports = { parseHeadlessMode };
