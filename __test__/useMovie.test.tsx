import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useMovieList, useMovieDetail } from '../hooks/useMovie';
import { fetcher, multiFetcher } from '../helpers/fetcher';
import { ToastProvider } from '../context/toastContext';
import { transformMovie, transformMovieDetail } from '../helpers/transform';

// 模擬 SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}));

// 模擬 fetcher 和 multiFetcher
jest.mock('../helpers/fetcher', () => ({
  fetcher: jest.fn(),
  multiFetcher: jest.fn()
}));

// 模擬 transform 函數
jest.mock('../helpers/transform', () => ({
  transformMovie: jest.fn((movie) => ({ ...movie, transformed: true })),
  transformMovieDetail: jest.fn((data) => ({
    movie: { ...data.movie, transformed: true },
    credits: data.credits,
    videos: data.videos
  }))
}));

// 模擬 useToast
jest.mock('../context/toastContext', () => ({
  useToast: jest.fn(() => ({
    openToast: jest.fn()
  })),
  ToastProvider: ({ children }) => <>{children}</>
}));

// 模擬 SWR 的 useSWR 函數
const mockUseSWR = jest.requireMock('swr').default;

describe('useMovieList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('應該使用正確的 URL 獲取熱門電影', () => {
    // 模擬 useSWR 的返回值
    mockUseSWR.mockReturnValue({
      data: { results: [{ id: 1, title: '電影1' }], total_pages: 2 },
      error: undefined,
      isLoading: false
    });

    // 渲染 hook
    const { result } = renderHook(() => useMovieList(1));

    // 驗證 useSWR 被調用時使用了正確的 URL
    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.stringContaining('/movie/popular'),
      fetcher
    );

    // 驗證返回的數據
    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  test('應該使用正確的 URL 獲取搜尋結果', () => {
    // 模擬 useSWR 的返回值
    mockUseSWR.mockReturnValue({
      data: { results: [{ id: 1, title: '搜尋結果' }], total_pages: 1 },
      error: undefined,
      isLoading: false
    });

    // 渲染 hook
    const { result } = renderHook(() => useMovieList(1, '測試搜尋'));

    // 驗證 useSWR 被調用時使用了正確的 URL
    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.stringContaining('/search/movie'),
      fetcher
    );
    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.stringContaining('query='),
      fetcher
    );

    // 驗證返回的數據
    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  test('應該處理錯誤情況', () => {
    // 模擬 useSWR 的返回值
    const mockError = new Error('API 錯誤');
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false
    });

    // 模擬 useToast
    const mockOpenToast = jest.fn();
    jest.requireMock('@/context/toastContext').useToast.mockReturnValue({
      openToast: mockOpenToast
    });

    // 渲染 hook
    const { result } = renderHook(() => useMovieList(1));

    // 驗證返回的數據
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);

    // 驗證 openToast 被調用
    expect(mockOpenToast).toHaveBeenCalledWith({
      message: 'API 錯誤',
      type: 'error'
    });
  });
});

describe('useMovieDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('應該使用正確的 URL 獲取電影詳情', () => {
    // 模擬 useSWR 的返回值
    mockUseSWR.mockReturnValue({
      data: [
        { id: 123, title: '電影詳情' },
        { cast: [], crew: [] },
        { results: [] }
      ],
      error: undefined,
      isLoading: false
    });

    // 渲染 hook
    const { result } = renderHook(() => useMovieDetail(123));

    // 驗證 useSWR 被調用時使用了正確的 URL 和 fetcher
    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('/movie/123'),
        expect.stringContaining('/movie/123/credits'),
        expect.stringContaining('/movie/123/videos')
      ]),
      multiFetcher
    );

    // 驗證返回的數據
    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);

    // 驗證 transformMovieDetail 被調用
    expect(transformMovieDetail).toHaveBeenCalledWith({
      movie: { id: 123, title: '電影詳情' },
      credits: { cast: [], crew: [] },
      videos: []
    });
  });

  test('應該處理錯誤情況', () => {
    // 模擬 useSWR 的返回值
    const mockError = new Error('API 錯誤');
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false
    });

    // 模擬 useToast
    const mockOpenToast = jest.fn();
    jest.requireMock('@/context/toastContext').useToast.mockReturnValue({
      openToast: mockOpenToast
    });

    // 渲染 hook
    const { result } = renderHook(() => useMovieDetail(123));

    // 驗證返回的數據
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);

    // 驗證 openToast 被調用
    expect(mockOpenToast).toHaveBeenCalledWith({
      message: 'API 錯誤',
      type: 'error'
    });
  });
});
