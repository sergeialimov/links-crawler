import { aggregateResults } from '../../src/utils';
import { CrawlResult, AggregatedResult } from '../../src/types';
import { SearchEngines } from '../../src/constants';

describe('aggregateResults', () => {
  it('should aggregate results correctly for multiple pages and keywords', () => {
    const results: CrawlResult[][] = [
      [
        {
          searchEngine: SearchEngines.GOOGLE,
          keyword: 'test1',
          pageNumber: 1,
          sponsoredLinks: ['link1', 'link2'],
        },
        {
          searchEngine: SearchEngines.GOOGLE,
          keyword: 'test1',
          pageNumber: 2,
          sponsoredLinks: ['link3', 'link4'],
        },
      ],
      [
        {
          searchEngine: SearchEngines.BING,
          keyword: 'test2',
          pageNumber: 1,
          sponsoredLinks: ['link5', 'link6'],
        },
        {
          searchEngine: SearchEngines.BING,
          keyword: 'test2',
          pageNumber: 2,
          sponsoredLinks: ['link7', 'link8'],
        },
      ],
    ];

    const expected: { data: AggregatedResult[] } = {
      data: [
        {
          searchEngine: SearchEngines.GOOGLE,
          keyword: 'test1',
          sponsoredLinks: [
            { page: 1, links: ['link1', 'link2'] },
            { page: 2, links: ['link3', 'link4'] },
          ],
        },
        {
          searchEngine: SearchEngines.BING,
          keyword: 'test2',
          sponsoredLinks: [
            { page: 1, links: ['link5', 'link6'] },
            { page: 2, links: ['link7', 'link8'] },
          ],
        },
      ],
    };

    expect(aggregateResults(results)).toEqual(expected);
  });

  it('should handle empty input', () => {
    const results: CrawlResult[][] = [];
    const expected: { data: AggregatedResult[] } = {
      data: [],
    };
    expect(aggregateResults(results)).toEqual(expected);
  });
});
