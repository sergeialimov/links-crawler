function log(workerData, start, end, sponsoredLinks) {
  console.log(`Found ${sponsoredLinks?.length || 0} links for ${workerData.keyword}, page: ${workerData.page} in ${Math.round(end - start)} ms for ${workerData.searchEngine}`);
}

module.exports = { log };
