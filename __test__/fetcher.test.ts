import { fetcher, multiFetcher } from '../helpers/fetcher';

// 模擬全局 fetch 函數
global.fetch = jest.fn();

describe('fetcher', () => {
  beforeEach(() => {
    // 重置模擬函數
    jest.resetAllMocks();
  });

  test('應該正確獲取並解析 JSON 資料', async () => {
    const mockData = { title: '測試電影' };
    const mockResponse = {
      json: jest.fn().mockResolvedValue(mockData)
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetcher('https://example.com/api');
    
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/api');
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  test('應該處理 fetch 錯誤', async () => {
    const mockError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    await expect(fetcher('https://example.com/api')).rejects.toThrow('Network error');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/api');
  });

  test('應該處理 JSON 解析錯誤', async () => {
    const mockJsonError = new Error('JSON parse error');
    const mockResponse = {
      json: jest.fn().mockRejectedValue(mockJsonError)
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(fetcher('https://example.com/api')).rejects.toThrow('JSON parse error');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/api');
    expect(mockResponse.json).toHaveBeenCalled();
  });
});

describe('multiFetcher', () => {
  beforeEach(() => {
    // 重置模擬函數
    jest.resetAllMocks();
  });

  test('應該正確獲取多個 URL 的資料', async () => {
    const mockData1 = { id: 1, title: '電影 1' };
    const mockData2 = { id: 2, title: '電影 2' };
    
    const mockResponse1 = { json: jest.fn().mockResolvedValue(mockData1) };
    const mockResponse2 = { json: jest.fn().mockResolvedValue(mockData2) };
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const urls = [
      'https://example.com/api/movie/1',
      'https://example.com/api/movie/2'
    ];
    
    const results = await multiFetcher(urls);
    
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, urls[0]);
    expect(global.fetch).toHaveBeenNthCalledWith(2, urls[1]);
    
    expect(results).toEqual([mockData1, mockData2]);
  });

  test('應該處理空 URL 陣列', async () => {
    const results = await multiFetcher([]);
    expect(results).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('應該處理部分 URL 失敗的情況', async () => {
    const mockData = { id: 1, title: '電影 1' };
    const mockError = new Error('Network error');
    
    const mockResponse = { json: jest.fn().mockResolvedValue(mockData) };
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse)
      .mockRejectedValueOnce(mockError);

    const urls = [
      'https://example.com/api/movie/1',
      'https://example.com/api/movie/2'
    ];
    
    await expect(multiFetcher(urls)).rejects.toThrow('Network error');
    
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, urls[0]);
    expect(global.fetch).toHaveBeenNthCalledWith(2, urls[1]);
  });
});
