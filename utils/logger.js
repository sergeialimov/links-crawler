function log(workerData, start, end, sponsoredLinks) {
  const links = sponsoredLinks?.length || 0;
  const time = Math.round(end - start);
  console.log(`Found ${links} links for ${workerData.keyword}, page: ${workerData.page} in ${time} ms for ${workerData.searchEngine}`);
}

module.exports = { log };
