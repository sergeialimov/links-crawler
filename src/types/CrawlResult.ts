import { SearchEngines } from '../constants';

export interface CrawlResult {
  searchEngine: keyof typeof SearchEngines;
  keyword: string;
  pageNumber: number;
  sponsoredLinks: string[];
}
