"use client";

import { useWatchList } from "@/context/watchListContext";
import WatchList from "@/components/MovieList";
import OrderButton from "@/components/OrderButton";

const WatchListPage = () => {
  const { watchList, isLoading, addToWatchList, removeFromWatchList, orderWatchList } = useWatchList(); 

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <h2 className="text-2xl lg:text-4xl font-bold text-white my-8">
        待看電影
      </h2>
      <OrderButton onOrderChange={orderWatchList} />
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
