import useSWR from "swr";
import { useMemo } from "react";
import { Movie, MovieDetails, Credits, Video } from "@/constants/type";
import apiPaths from "../constants/apiPath";
import { useToast } from "@/context/toastContext";
import { fetcher, multiFetcher } from "../helpers/fetcher";
import { transformMovie, transformMovieDetail } from "../helpers/transform";
import { getApiUrl } from "@/helpers/getUrl";

interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface VideoResponse {
  results: Video[];
}

export const useMovieList = (page = 1, query: string | null = null) => {
  const { openToast } = useToast();
  const url = (() => {
    if (query) {
      return getApiUrl(apiPaths.MOVIE_SEARCH, {
        query: encodeURIComponent(query),
        page,
      });
    }
    return getApiUrl(apiPaths.MOVIE_POPULAR, { page });
  })();

  const { data, error, isLoading } = useSWR<MovieListResponse>(url, fetcher);

  const hasMore = data?.total_pages > page;
  const transformData = useMemo(() => {
    if (error || !data) {
      return [];
    }
    return data.results?.map((item) => transformMovie(item)) || [];
  }, [data, error]);

  if (error) {
    const message = (() => {
      if (error.message) return error.message;
      if (query) return "Error searching movie";
      return "Error fetching movie list";
    })();

    openToast({
      message,
      type: "error",
    });
  }

  return { data: transformData, error, isLoading, hasMore };
};

export const useMovieDetail = (id: number) => {
  const { openToast } = useToast();
  const urls = [
    getApiUrl(`${apiPaths.MOVIE}/${id}`),
    getApiUrl(`${apiPaths.MOVIE}/${id}/credits`),
    getApiUrl(`${apiPaths.MOVIE}/${id}/videos`),
  ];
  const { data, error, isLoading } = useSWR(urls, multiFetcher);

  if (!data || error) {
    if (error) {
      const message = error.message || "Error fetching movie detail";
      openToast({
        message,
        type: "error",
      });
    }
    return { data: null, error, isLoading };
  }

  const [movieDetail, movieCredits, movieVideos] =
    (data as [MovieDetails, Credits, VideoResponse]) || [];
  const transformData = transformMovieDetail({
    movie: movieDetail,
    credits: movieCredits,
    videos: movieVideos?.results,
  });

  return { data: transformData, error, isLoading };
};
