import React from "react";
import { renderHook } from "@testing-library/react";
import { getMovieList, getMovieSearch, getMovieDetail } from "@/apis/movies";
import { useMovieList, useMovieDetail } from "@/hooks/useMovie";

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/apis/movies", () => ({
  getMovieList: jest.fn(),
  getMovieSearch: jest.fn(),
  getMovieDetail: jest.fn(),
}));

jest.mock("@/helpers/transform", () => ({
  transformMovie: jest.fn((movie) => ({ ...movie, transformed: true })),
  transformMovieDetail: jest.fn((data) => ({
    movie: { ...data.movie, transformed: true },
    credits: data.credits,
    videos: data.videos,
  })),
}));

jest.mock("@/context/toastContext", () => ({
  useToast: jest.fn(() => ({
    openToast: jest.fn(),
  })),
  ToastProvider: ({ children }) => <>{children}</>,
}));

const mockUseSWR = jest.requireMock("swr").default;

describe("useMovieList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should use correct params to fetch popular movies", () => {
    mockUseSWR.mockReturnValue({
      data: {
        movieList: [{ id: 1, title: "movie1" }],
        totalPages: 2,
        totalResults: 10,
      },
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useMovieList(1));

    expect(mockUseSWR).toHaveBeenCalledWith([1, null], getMovieList);

    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  test("should use correct params to fetch search results", () => {
    mockUseSWR.mockReturnValue({
      data: {
        movieList: [{ id: 1, title: "search result" }],
        totalPages: 1,
        totalResults: 1,
      },
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useMovieList(1, "test search"));

    expect(mockUseSWR).toHaveBeenCalledWith([1, "test search"], getMovieSearch);

    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  test("should handle error situation", () => {
    const mockError = new Error("API error");
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
    });

    const mockOpenToast = jest.fn();
    jest.requireMock("@/context/toastContext").useToast.mockReturnValue({
      openToast: mockOpenToast,
    });
    const { result } = renderHook(() => useMovieList(1));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
    expect(mockOpenToast).toHaveBeenCalledWith({
      message: "API error",
      type: "error",
    });
  });
});

describe("useMovieDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should use correct params to fetch movie detail", () => {
    mockUseSWR.mockReturnValue({
      data: [
        { id: 123, title: "movie detail" },
        { cast: [], crew: [] },
        { results: [] },
      ],
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useMovieDetail(123));

    expect(mockUseSWR).toHaveBeenCalledWith([123], getMovieDetail);

    expect(result.current.data).toEqual([
      { id: 123, title: "movie detail" },
      { cast: [], crew: [] },
      { results: [] },
    ]);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  test("should handle error situation", () => {
    const mockError = new Error("API error");
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
    });

    const mockOpenToast = jest.fn();
    jest.requireMock("@/context/toastContext").useToast.mockReturnValue({
      openToast: mockOpenToast,
    });
    const { result } = renderHook(() => useMovieDetail(123));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
    expect(mockOpenToast).toHaveBeenCalledWith({
      message: "API error",
      type: "error",
    });
  });
});
