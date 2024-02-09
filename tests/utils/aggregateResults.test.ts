import { aggregateResults } from '../../src/utils';
import { CrawlResult, AggregatedResult } from '../../src/types';
import { SearchEngines } from '../../src/constants';

describe('aggregateResults', () => {
  it('should aggregate results correctly', () => {
    const results: CrawlResult[][] = [
      [
        {
          searchEngine: SearchEngines.GOOGLE,
          keyword: 'test',
          pageNumber: 1,
          sponsoredLinks: ['link1', 'link2'],
        },
      ],
    ];

    const expected: { data: AggregatedResult[] } = {
      data: [
        {
          searchEngine: SearchEngines.GOOGLE,
          keyword: 'test',
          sponsoredLinks: [{ page: 1, links: ['link1', 'link2'] }],
        },
      ],
    };

    expect(aggregateResults(results)).toEqual(expected);
  });

  // Add more test cases as needed
});
