"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Movie } from "@/constants/type";
import MovieCard from "../MovieCard";

const MovieDetails = dynamic(() => import("../MovieDetails"), {
  ssr: false,
});

const ListComponent = ({
  movieList,
  watchList,
  addToWatchList,
  removeFromWatchList,
}: {
  movieList: Movie[];
  watchList: Movie[];
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {movieList.map((movie, idx) => {
        const isInWatchlist = watchList.some((item) => item.id === movie.id);
        return (
          <MovieCard
            movie={movie}
            key={`${movie.id}-${idx}`}
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

export default ListComponent;
