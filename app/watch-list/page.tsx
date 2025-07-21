"use client";

import { useEffect, useState } from "react";
import { Movie, OrderType } from "@/constants/type";
import { useWatchList } from "@/context/watchListContext";
import { orderList } from "@/helpers/orderList";
import WatchList from "@/components/MovieList";
import OrderButton from "@/components/OrderButton";

const WatchListPage = () => {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.popularity);
  const [allWatchList, setAllWatchList] = useState<Movie[]>([]);
  const { watchList, isLoading, addToWatchList, removeFromWatchList } = useWatchList(); 

  useEffect(() => {
    const newList = orderList({order: 'desc', type: orderType, list: watchList});
    setAllWatchList(newList);
  }, [watchList]);

  const onOrderChange = (type: OrderType) => {
    setOrderType(type);
    const newList = orderList({order: 'desc', type, list: allWatchList});
    setAllWatchList(newList);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <h2 className="text-2xl lg:text-4xl font-bold text-white my-8">
        待看電影
      </h2>
      <OrderButton orderType={orderType} onOrderChange={onOrderChange} />
      <WatchList
        movieList={allWatchList}
        watchList={allWatchList}
        isLoading={isLoading}
        addToWatchList={addToWatchList}
        removeFromWatchList={removeFromWatchList}
      />
    </div>
  );
};

export default WatchListPage;
