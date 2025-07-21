"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Movie, OrderType } from "@/constants/type";
import { orderList } from "@/helpers/orderList";

interface WatchListContextType {
  watchList: Movie[];
  isLoading: boolean;
  addToWatchList: (movie: Movie) => void;
  removeFromWatchList: (movieId: number) => void;
  orderWatchList: (type: OrderType) => void;
}

const WatchListContext = createContext<WatchListContextType>({
  watchList: [],
  isLoading: false,
  addToWatchList: () => {},
  removeFromWatchList: () => {},
  orderWatchList: () => {},
});

export const WatchListProvider = ({ children }: { children: React.ReactNode }) => {
  const [watchList, setWatchList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.popularity);

  useEffect(() => {
    const storedWatchList = localStorage.getItem("watchList");
    if (storedWatchList) {
      setWatchList(JSON.parse(storedWatchList));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const newList = orderList({order: 'desc', type: orderType, list: watchList});
    setWatchList(newList);
  }, [orderType]);

  const updateWatchList = (newWatchList: Movie[]) => {
    setWatchList(newWatchList);
    localStorage.setItem("watchList", JSON.stringify(newWatchList));
  };

  const addToWatchList = (movie: Movie) => {
    const newWatchList = [...watchList, movie];
    updateWatchList(newWatchList);
  };

  const removeFromWatchList = (movieId: number) => {
    const newWatchList = watchList.filter((movie) => movie.id !== movieId);
    updateWatchList(newWatchList);
  };

  const orderWatchList = (type: OrderType = OrderType.voteAverage) => {
    setOrderType(type);
  };

  return (
    <WatchListContext.Provider
      value={{ watchList, isLoading, addToWatchList, removeFromWatchList, orderWatchList }}
    >
      {children}
    </WatchListContext.Provider>
  );
};

export const useWatchList = () => {
  const context = useContext(WatchListContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
