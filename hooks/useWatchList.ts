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

  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }, [watchList]);

  const addToWatchList = (movie: Movie) => {
    setWatchList((prev) => [...prev, movie]);
  };

  const removeFromWatchList = (movieId: number) => {
    setWatchList((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  return {
    watchList,
    addToWatchList,
    removeFromWatchList,
  };
};

export default useWatchList;
