import { log } from '../../src/utils';
import { WorkerData } from '../../src/types';

describe('log', () => {
  const workerData: WorkerData = {
    keyword: 'test',
    page: 1,
    searchEngine: 'Google',
  };

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log correctly with sponsored links', () => {
    const start = 1000;
    const end = 2000;
    const sponsoredLinks = ['link1', 'link2'];
    log(workerData, start, end, sponsoredLinks);
    expect(console.log).toHaveBeenCalledWith(
      `Found ${sponsoredLinks.length} links for ${workerData.keyword}, page: ${workerData.page} in ${end - start} ms for ${workerData.searchEngine}`,
    );
  });

  it('should log correctly without sponsored links', () => {
    const start = 1000;
    const end = 2000;
    log(workerData, start, end);
    expect(console.log).toHaveBeenCalledWith(
      `Found 0 links for ${workerData.keyword}, page: ${workerData.page} in ${end - start} ms for ${workerData.searchEngine}`,
    );
  });
});
