"use client";

import { Movie } from "@/constants/type";
import useObserver from "@/hooks/useObserver";
import MovieCard from "../MovieCard";
import LoadingSpinner from "../Loading/LoadingSpinner";

const observerOptions = {
  root: null,
  rootMargin: "100px",
  threshold: 0.3,
};

const MovieList = ({
  movieList,
  isLoading,
  onChangePage,
}: {
  movieList: Movie[];
  isLoading: boolean;
  onChangePage: (page: number | ((prev: number) => number)) => void;
}) => {
  const onLoadMore = (entries: IntersectionObserverEntry[]) => {
    console.log(entries, isLoading);
    if (entries[0].isIntersecting && !isLoading) {
      onChangePage((prev) => prev + 1);
    }
  };

  const loadingRef = useObserver(onLoadMore, observerOptions);

  if (!movieList?.length && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">沒有找到相關電影</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movieList.map((movie, idx) => (
          <MovieCard movie={movie} key={`${movie.id}-${idx}`} />
        ))}
      </div>

      <div ref={loadingRef} className="flex justify-center py-8">
        {isLoading && <LoadingSpinner size={{ width: 40, height: 40 }} />}
      </div>
    </div>
  );
};

export default MovieList;
