"use client";

import WatchList from "@/components/MovieList/listComponent";
import { useWatchList } from "@/context/watchListContext";

const WatchListPage = () => {
  const { watchList, addToWatchList, removeFromWatchList } = useWatchList(); 

  return (
    <div className="container mx-auto px-4 lg:px-0">
      <WatchList
        movieList={watchList}
        watchList={watchList}
        addToWatchList={addToWatchList}
        removeFromWatchList={removeFromWatchList}
      />
    </div>
  );
};

export default WatchListPage;
