import React from 'react';
import { renderHook } from '@testing-library/react';
import { useMovieList, useMovieDetail } from '../../hooks/useMovie';
import { fetcher, multiFetcher } from '../../helpers/fetcher';
import { transformMovieDetail } from '../../helpers/transform';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../helpers/fetcher', () => ({
  fetcher: jest.fn(),
  multiFetcher: jest.fn()
}));

jest.mock('../helpers/transform', () => ({
  transformMovie: jest.fn((movie) => ({ ...movie, transformed: true })),
  transformMovieDetail: jest.fn((data) => ({
    movie: { ...data.movie, transformed: true },
    credits: data.credits,
    videos: data.videos
  }))
}));

jest.mock('../context/toastContext', () => ({
  useToast: jest.fn(() => ({
    openToast: jest.fn()
  })),
  ToastProvider: ({ children }) => <>{children}</>
}));

const mockUseSWR = jest.requireMock('swr').default;

describe('useMovieList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('應該使用正確的 URL 獲取熱門電影', () => {
    mockUseSWR.mockReturnValue({
      data: { results: [{ id: 1, title: '電影1' }], total_pages: 2 },
      error: undefined,
      isLoading: false
    });

    const { result } = renderHook(() => useMovieList(1));

    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.stringContaining('/movie/popular'),
      fetcher
    );

    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  test('應該使用正確的 URL 獲取搜尋結果', () => {
    mockUseSWR.mockReturnValue({
      data: { results: [{ id: 1, title: '搜尋結果' }], total_pages: 1 },
      error: undefined,
      isLoading: false
    });

    const { result } = renderHook(() => useMovieList(1, '測試搜尋'));

    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.stringContaining('/search/movie'),
      fetcher
    );
    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.stringContaining('query='),
      fetcher
    );

    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  test('應該處理錯誤情況', () => {
    const mockError = new Error('API 錯誤');
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false
    });

    const mockOpenToast = jest.fn();
    jest.requireMock('@/context/toastContext').useToast.mockReturnValue({
      openToast: mockOpenToast
    });
    const { result } = renderHook(() => useMovieList(1));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
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
    mockUseSWR.mockReturnValue({
      data: [
        { id: 123, title: '電影詳情' },
        { cast: [], crew: [] },
        { results: [] }
      ],
      error: undefined,
      isLoading: false
    });

    const { result } = renderHook(() => useMovieDetail(123));

    expect(mockUseSWR).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('/movie/123'),
        expect.stringContaining('/movie/123/credits'),
        expect.stringContaining('/movie/123/videos')
      ]),
      multiFetcher
    );

    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(transformMovieDetail).toHaveBeenCalledWith({
      movie: { id: 123, title: '電影詳情' },
      credits: { cast: [], crew: [] },
      videos: []
    });
  });

  test('應該處理錯誤情況', () => {
    const mockError = new Error('API 錯誤');
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false
    });

    const mockOpenToast = jest.fn();
    jest.requireMock('@/context/toastContext').useToast.mockReturnValue({
      openToast: mockOpenToast
    });
    const { result } = renderHook(() => useMovieDetail(123));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
    expect(mockOpenToast).toHaveBeenCalledWith({
      message: 'API 錯誤',
      type: 'error'
    });
  });
});
