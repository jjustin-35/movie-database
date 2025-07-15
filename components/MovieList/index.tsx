'use client';

import { useState } from "react";
import Link from "next/link";
import useObserver from "@/hooks/useObserver";
import { useMovieList } from "@/hooks/useMovie";
import MovieCard from "../MovieCard";
import LoadingSpinner from "../Loading/LoadingSpinner";

const MovieList = () => {
  const [page, setPage] = useState(1);
  const loadingRef = useObserver<HTMLDivElement>(
    () => {
      setPage((prev) => prev + 1);
    },
    {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    }
  );
  const { data: movieList, error, isLoading } = useMovieList(page);

  if (error || (movieList.length === 0 && !isLoading)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">沒有找到相關電影</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movieList.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>

      <div ref={loadingRef} className="flex justify-center py-8">
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default MovieList;
