import { CrawlResult, AggregatedResult } from '../interfaces/types';

function aggregateResults(results: CrawlResult[][]): { data: AggregatedResult[] } {
  // Flatten the nested arrays of results into a single array
  const flatResults = results.flat();

  // Use reduce to aggregate the results
  const data = flatResults.reduce<AggregatedResult[]>((accumulator, result) => {
    const {
      searchEngine, keyword, pageNumber: pageNum, sponsoredLinks,
    } = result;

    // Find the existing entry with the same uniqueKey, if any
    const existingEntry = accumulator
      .find((entry) => entry.searchEngine === searchEngine && entry.keyword === keyword);

    if (existingEntry) {
      // Add the sponsoredLinks information to the existing entry
      existingEntry.sponsoredLinks.push({
        page: pageNum,
        links: sponsoredLinks,
      });
    } else {
      // Create a new entry if no existing entry is found
      accumulator.push({
        searchEngine,
        keyword,
        sponsoredLinks: [{
          page: pageNum,
          links: sponsoredLinks,
        }],
      });
    }

    return accumulator;
  }, []);

  return { data };
}

export default aggregateResults;
