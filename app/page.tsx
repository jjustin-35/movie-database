"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/constants/type";
import { useMovieList } from "@/hooks/useMovie";
import SearchBar from "@/components/SearchBar";
import Movies from "@/components/Movies";

export default function Home() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allMovieList, setAllMovieList] = useState<Movie[]>([]);
  const { data: movieList, isLoading, hasMore } = useMovieList(page, query);

  useEffect(() => {
    if (movieList && !isLoading) {
      setAllMovieList((prev) => [...prev, ...movieList]);
    }
  }, [movieList, isLoading]);

  const onSubmit = (query: string) => {
    setQuery(query);
    setPage(1);
    setAllMovieList([]);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <SearchBar
        query={query}
        onSubmit={onSubmit}
        placeholder="搜尋電影..."
      />
      <Movies
        movieList={allMovieList}
        isLoading={isLoading}
        hasMore={hasMore}
        onChangePage={setPage}
      />
    </div>
  );
}
