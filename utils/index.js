const { aggregateResults } = require('./aggregator');
const { log } = require('./logger');
const { parseHeadlessMode } = require('./headlessModeParser');

module.exports = {
  aggregateResults,
  log,
  parseHeadlessMode,
};
