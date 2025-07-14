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
    Object.entries(params).forEach(([key, value]) => {
      originUrl.searchParams.append(key, value.toString());
    });
  }
  return originUrl.toString();
};

export const useMovieList = (page = 1) => {
  const { data, error } = useSWR<Movie[]>(
    produceApiUrl(apiPaths.MOVIE_POPULAR, { page }),
    fetcher
  );
  const transformData = data?.map((item) => transformMovie(item));

  if (error) {
    console.error("Error fetching movie list:", error);
    return { data: [], error };
  }

  return { data: transformData, error };
};

export const useMovieDetail = (id: number) => {
  const { data, error } = useSWR<MovieDetails>(
    produceApiUrl(`${apiPaths.MOVIE}/${id}`),
    fetcher
  );
  const transformData = transformMovieDetail(data);

  if (error) {
    console.error("Error fetching movie detail:", error);
    return { data: null, error };
  }

  return { data: transformData, error };
};

export const useSearchMovie = (query: string, page = 1) => {
  const { data, error } = useSWR<Movie[]>(
    produceApiUrl(apiPaths.MOVIE_SEARCH, { query: encodeURIComponent(query), page }),
    fetcher
  );
  const transformData = data?.map((item) => transformMovie(item));

  if (error) {
    console.error("Error searching movie:", error);
    return { data: [], error };
  }

  return { data: transformData, error };
};
