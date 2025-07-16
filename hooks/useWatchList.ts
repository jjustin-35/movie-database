import { useEffect, useState } from "react";
import { Movie } from "../constants/type";

const useWatchList = () => {
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

  return {
    watchList,
    addToWatchList,
    removeFromWatchList,
  };
};

export default useWatchList;
