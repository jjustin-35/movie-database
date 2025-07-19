"use client";

import WatchList from "@/components/MovieList";
import { useWatchList } from "@/context/watchListContext";

const WatchListPage = () => {
  const { watchList, isLoading, addToWatchList, removeFromWatchList } = useWatchList(); 

  return (
    <div className="container mx-auto px-4 lg:px-0">
      <h1 className="text-4xl font-bold text-white my-8">
        待看電影
      </h1>
      <WatchList
        movieList={watchList}
        watchList={watchList}
        isLoading={isLoading}
        addToWatchList={addToWatchList}
        removeFromWatchList={removeFromWatchList}
      />
    </div>
  );
};

export default WatchListPage;
