"use server";

import apiPaths from "@/constants/apiPath";
import { Credits, Movie, MovieDetails, Video } from "@/constants/type";
import { getApiUrl } from "@/helpers/getUrl";
import { transformMovie, transformMovieDetail } from "@/helpers/transform";
interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface VideoResponse {
  results: Video[];
}

export const getMovieList = async ([page]: [number]) => {
  try {
    const url = getApiUrl(apiPaths.MOVIE_POPULAR, { page });
    const response = await fetch(url);
    const data: MovieListResponse = await response.json();

    if (!data.results) {
      throw new Error("No movie list");
    }

    const movieList = data.results?.map((item) => transformMovie(item));
    return {
      movieList,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMovieSearch = async ([page, query]: [number, string]) => {
  try {
    const url = getApiUrl(apiPaths.MOVIE_SEARCH, { page, query });
    const response = await fetch(url);
    const data: MovieListResponse = await response.json();

    if (!data.results) {
      throw new Error("No movie list");
    }

    const movieList = data.results?.map((item) => transformMovie(item));
    return {
      movieList,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMovieDetail = async ([id]: [number]) => {
  try {
    const urls = [
      getApiUrl(`${apiPaths.MOVIE}/${id}`),
      getApiUrl(`${apiPaths.MOVIE}/${id}/credits`),
      getApiUrl(`${apiPaths.MOVIE}/${id}/videos`),
    ];
    const promises = urls.map(async (url) => {
      const response = await fetch(url);
      return response.json();
    });
    const data = await Promise.all(promises);

    if (!data) {
      throw new Error("Error fetching movie detail");
    }

    const [movieDetail, movieCredits, movieVideos] =
      (data as [MovieDetails, Credits, VideoResponse]) || [];
    const transformData = transformMovieDetail({
      movie: movieDetail,
      credits: movieCredits,
      videos: movieVideos?.results,
    });

    return transformData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
