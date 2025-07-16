import useSWR from "swr";
import { useMemo } from "react";
import apiPaths from "../constants/apiPath";
import fetcher from "../helpers/fetcher";
import { Movie, MovieDetails } from "@/constants/type";
import { transformMovie, transformMovieDetail } from "../helpers/transform";
import { getApiUrl } from "@/helpers/getUrl";

interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const useMovieList = (page = 1, query: string | null = null) => {
  console.log(page, query);
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

  const transformData = useMemo(() => {
    if (error || !data) {
      return [];
    }
    return data.results?.map((item) => transformMovie(item)) || [];
  }, [data, error]);

  if (error) {
    console.error("Error fetching movie list:", error);
  }

  return { data: transformData, error, isLoading };
};

export const useMovieDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<MovieDetails>(
    getApiUrl(`${apiPaths.MOVIE}/${id}`),
    fetcher
  );
  const transformData = transformMovieDetail(data);

  if (error) {
    console.error("Error fetching movie detail:", error);
    return { data: null, error, isLoading };
  }

  return { data: transformData, error, isLoading };
};
