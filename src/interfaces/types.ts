import { SearchEngines } from '../constants';

export interface CrawlResult {
  searchEngine: keyof typeof SearchEngines;
  keyword: string;
  pageNumber: number;
  sponsoredLinks: string[];
}

export interface WorkerData {
  keyword: string;
  page: number;
  searchEngine: string;
}

export interface CrawlTaskData {
  keyword: string;
  searchEngine: string;
  page: number;
}

export interface AggregatedResult {
  searchEngine: string;
  keyword: string;
  sponsoredLinks: { page: number; links: string[] }[];
}
