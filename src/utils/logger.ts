import { WorkerData } from '../types';

function log(workerData: WorkerData, start: number, end: number, sponsoredLinks?: string[]): void {
  const links = sponsoredLinks?.length || 0;
  const time = Math.round(end - start);
  console.log(`Found ${links} links for ${workerData.keyword}, page: ${workerData.page} in ${time} ms for ${workerData.searchEngine}`);
}

export default log;
