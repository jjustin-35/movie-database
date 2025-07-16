"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Movie } from "@/constants/type";

interface WatchListContextType {
  watchList: Movie[];
  addToWatchList: (movie: Movie) => void;
  removeFromWatchList: (movieId: number) => void;
}

const WatchListContext = createContext<WatchListContextType>({
  watchList: [],
  addToWatchList: () => {},
  removeFromWatchList: () => {},
});

export const WatchListProvider = ({ children }: { children: React.ReactNode }) => {
  const [watchList, setWatchList] = useState<Movie[]>([]);

  useEffect(() => {
    const storedWatchList = localStorage.getItem("watchList");
    if (storedWatchList) {
      setWatchList(JSON.parse(storedWatchList));
    }
  }, []);

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

  return (
    <WatchListContext.Provider
      value={{ watchList, addToWatchList, removeFromWatchList }}
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
