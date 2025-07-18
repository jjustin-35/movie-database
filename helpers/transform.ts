import { AllMovieDetail, Movie } from "../constants/type";

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

export const transformMovieDetail = (data: AllMovieDetail): AllMovieDetail => {
  const { movie, credits, videos } = data;
  const baseMovie = transformMovie(movie);
  const newMovieDetail = {
    movie: {
      ...baseMovie,
    runtime: movie.runtime || 0,
    genres: Array.isArray(movie.genres) ? movie.genres : [],
    production_companies: Array.isArray(movie.production_companies)
      ? movie.production_companies
      : [],
    production_countries: Array.isArray(movie.production_countries)
      ? movie.production_countries
      : [],
    spoken_languages: Array.isArray(movie.spoken_languages)
      ? movie.spoken_languages
      : [],
    status: movie.status || "Unknown",
    tagline: movie.tagline || "",
    budget: movie.budget || 0,
    revenue: movie.revenue || 0,
    homepage: movie.homepage || "",
    imdb_id: movie.imdb_id || "",
    },
    credits: {
      cast: Array.isArray(credits.cast) ? credits.cast : [],
      crew: Array.isArray(credits.crew) ? credits.crew : [],
    },
    videos: Array.isArray(videos) ? videos : [],
  };

  return newMovieDetail;
};
