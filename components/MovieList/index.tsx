"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Movie } from "@/constants/type";
import CardLoader from "../Loading/cardLoader";
import MovieCard from "../MovieCard";

const MovieDetails = dynamic(() => import("../MovieDetails"), {
  ssr: false,
});

const MovieList = ({
  movieList,
  watchList,
  isLoading,
  addToWatchList,
  removeFromWatchList,
}: {
  movieList: Movie[];
  watchList: Movie[];
  isLoading: boolean;
  addToWatchList: (movie: Movie) => void;
  removeFromWatchList: (movieId: number) => void;
}) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const onClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const onCloseMovieDetails = () => {
    setSelectedMovie(null);
  };

  if (isLoading && !movieList.length) return <CardLoader />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 my-8">
      {movieList.map((movie, idx) => {
        const isInWatchlist = watchList.some((item) => item.id === movie.id);
        return (
          <MovieCard
            movie={movie}
            key={`${movie.id}-${idx}`}
            idx={idx}
            isInWatchlist={isInWatchlist}
            addToWatchList={addToWatchList}
            removeFromWatchList={removeFromWatchList}
            onClick={onClick}
          />
        );
      })}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={onCloseMovieDetails}
        />
      )}
    </div>
  );
};

export default MovieList;
