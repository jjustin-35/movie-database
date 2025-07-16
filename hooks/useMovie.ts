import useSWR from "swr";
import { useMemo } from "react";
import { Movie, MovieDetails } from "@/constants/type";
import apiPaths from "../constants/apiPath";
import { useToast } from "@/context/toastContext";
import fetcher from "../helpers/fetcher";
import { transformMovie, transformMovieDetail } from "../helpers/transform";
import { getApiUrl } from "@/helpers/getUrl";

interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
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

  return { data: transformData, error, isLoading };
};

export const useMovieDetail = (id: number) => {
  const { openToast } = useToast();
  const { data, error, isLoading } = useSWR<MovieDetails>(
    getApiUrl(`${apiPaths.MOVIE}/${id}`),
    fetcher
  );
  const transformData = transformMovieDetail(data);

  if (error) {
    const message = error.message || "Error fetching movie detail";
    openToast({
      message,
      type: "error",
    });
    return { data: null, error, isLoading };
  }

  return { data: transformData, error, isLoading };
};
