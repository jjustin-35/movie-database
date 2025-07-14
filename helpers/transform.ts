import { Movie, MovieDetails } from "../constants/type";

export const transformMovie = (data: Movie): Movie => {
  const newMovie = {
    id: data.id || 0,
    title: data.title || "Unknown Title",
    overview: data.overview || "",
    poster_path: data.poster_path || null,
    backdrop_path: data.backdrop_path || null,
    release_date: data.release_date || "",
    vote_average: data.vote_average || 0,
    vote_count: data.vote_count || 0,
    genre_ids: Array.isArray(data.genre_ids) ? data.genre_ids : [],
    adult: data.adult || false,
    original_language: data.original_language || "en",
    original_title: data.original_title || "",
    popularity: data.popularity || 0,
    video: data.video || false,
  };
  return newMovie;
};

export const transformMovieDetail = (data: MovieDetails): MovieDetails => {
  const baseMovie = transformMovie(data);
  const newMovieDetail = {
    ...baseMovie,
    runtime: data.runtime || 0,
    genres: Array.isArray(data.genres) ? data.genres : [],
    production_companies: Array.isArray(data.production_companies)
      ? data.production_companies
      : [],
    production_countries: Array.isArray(data.production_countries)
      ? data.production_countries
      : [],
    spoken_languages: Array.isArray(data.spoken_languages)
      ? data.spoken_languages
      : [],
    status: data.status || "Unknown",
    tagline: data.tagline || "",
    budget: data.budget || 0,
    revenue: data.revenue || 0,
    homepage: data.homepage || "",
    imdb_id: data.imdb_id || "",
  };
  return newMovieDetail;
};
