"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/constants/type";
import { useMovieList } from "@/hooks/useMovie";
import SearchBar from "@/components/SearchBar";
import MovieList from "@/components/MovieList";

export default function Home() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allMovieList, setAllMovieList] = useState<Movie[]>([]);
  const { data: movieList, isLoading } = useMovieList(page, query);

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
    <div className="container mx-auto px-4 lg:px-0">
      <SearchBar
        onSubmit={onSubmit}
        placeholder="Search for a movie"
        className="mb-4"
      />
      <MovieList
        movieList={allMovieList}
        isLoading={isLoading}
        onChangePage={setPage}
      />
    </div>
  );
}
