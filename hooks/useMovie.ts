import useSWR from "swr";
import configs from "../config";
import apiPaths from "../constants/apiPath";
import fetcher from "../helpers/fetcher";
import { Movie, MovieDetails } from "@/constants/type";
import { transformMovie, transformMovieDetail } from "../helpers/transform";

const produceApiUrl = (
  apiPath: string,
  params?: Record<string, string | number>
) => {
  const originUrl = new URL(`${configs.API_BASE_URL}${apiPath}`);
  originUrl.searchParams.append("api_key", configs.API_KEY);
  if (params) {
    if (Object.keys(params).length === 0) return null;
    Object.entries(params).forEach(([key, value]) => {
      originUrl.searchParams.append(key, value.toString());
    });
  }
  return originUrl.toString();
};

export const useMovieList = (page = 1) => {
  const { data, error, isLoading } = useSWR<Movie[]>(
    produceApiUrl(apiPaths.MOVIE_POPULAR, { page }),
    fetcher
  );
  const transformData = data?.map((item) => transformMovie(item));

  if (error) {
    console.error("Error fetching movie list:", error);
    return { data: [], error, isLoading };
  }

  return { data: transformData, error, isLoading };
};

export const useMovieDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<MovieDetails>(
    produceApiUrl(`${apiPaths.MOVIE}/${id}`),
    fetcher
  );
  const transformData = transformMovieDetail(data);

  if (error) {
    console.error("Error fetching movie detail:", error);
    return { data: null, error, isLoading };
  }

  return { data: transformData, error, isLoading };
};

export const useSearchMovie = (query: string, page = 1) => {
  const { data, error, isLoading } = useSWR<Movie[]>(
    produceApiUrl(apiPaths.MOVIE_SEARCH, { query: encodeURIComponent(query), page }),
    fetcher
  );
  const transformData = data?.map((item) => transformMovie(item));

  if (error) {
    console.error("Error searching movie:", error);
    return { data: [], error, isLoading };
  }

  return { data: transformData, error, isLoading };
};