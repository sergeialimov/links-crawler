export interface AggregatedResult {
  searchEngine: string;
  keyword: string;
  sponsoredLinks: { page: number; links: string[] }[];
}
