import React from 'react';
import { renderHook } from '@testing-library/react';
import { useMovieList, useMovieDetail } from '../../hooks/useMovie';
import { fetcher, multiFetcher } from '../../helpers/fetcher';
import { transformMovieDetail } from '../../helpers/transform';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/helpers/fetcher', () => ({
  fetcher: jest.fn(),
  multiFetcher: jest.fn()
}));

jest.mock('@/helpers/transform', () => ({
  transformMovie: jest.fn((movie) => ({ ...movie, transformed: true })),
  transformMovieDetail: jest.fn((data) => ({
    movie: { ...data.movie, transformed: true },
    credits: data.credits,
    videos: data.videos
  }))
}));

jest.mock('@/context/toastContext', () => ({
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

  test('should use correct URL to fetch popular movies', () => {
    mockUseSWR.mockReturnValue({
      data: { results: [{ id: 1, title: 'movie1' }], total_pages: 2 },
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

  test('should use correct URL to fetch search results', () => {
    mockUseSWR.mockReturnValue({
      data: { results: [{ id: 1, title: 'search result' }], total_pages: 1 },
      error: undefined,
      isLoading: false
    });

    const { result } = renderHook(() => useMovieList(1, 'test search'));

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

  test('should handle error situation', () => {
    const mockError = new Error('API error');
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
      message: 'API error',
      type: 'error'
    });
  });
});

describe('useMovieDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should use correct URL to fetch movie detail', () => {
    mockUseSWR.mockReturnValue({
      data: [
        { id: 123, title: 'movie detail' },
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
      movie: { id: 123, title: 'movie detail' },
      credits: { cast: [], crew: [] },
      videos: []
    });
  });

  test('should handle error situation', () => {
    const mockError = new Error('API error');
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
      message: 'API error',
      type: 'error'
    });
  });
});
