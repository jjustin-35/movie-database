"use client";

import { Movie } from "@/constants/type";
import useObserver from "@/hooks/useObserver";
import { useWatchList } from "@/context/watchListContext";
import LoadingSpinner from "../Loading/spinner";
import MovieList from "../MovieList";

const observerOptions = {
  root: null,
  rootMargin: "100px",
  threshold: 0.3,
};

const Movies = ({
  movieList,
  isLoading,
  onChangePage,
}: {
  movieList: Movie[];
  isLoading: boolean;
  onChangePage: (page: number | ((prev: number) => number)) => void;
}) => {
  const { watchList, addToWatchList, removeFromWatchList } = useWatchList();

  const onLoadMore = (entries: IntersectionObserverEntry[]) => {
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
      <MovieList
        movieList={movieList}
        watchList={watchList}
        isLoading={isLoading}
        addToWatchList={addToWatchList}
        removeFromWatchList={removeFromWatchList}
      />

      <div ref={loadingRef} className="flex justify-center py-8">
        {isLoading && <LoadingSpinner size={{ width: 40, height: 40 }} />}
      </div>
    </div>
  );
};

export default Movies;
