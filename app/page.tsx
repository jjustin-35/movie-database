"use client";

import { useState, useEffect } from "react";
import { Movie, OrderType } from "@/constants/type";
import { useMovieList } from "@/hooks/useMovie";
import { orderList } from "@/helpers/orderList";
import SearchBar from "@/components/SearchBar";
import Movies from "@/components/Movies";
import OrderButton from "@/components/OrderButton";

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

  const orderMovieList = (type: OrderType) => {
    const newMovieList = orderList({order: 'desc', type, list: allMovieList});
    setAllMovieList(newMovieList);
  };

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
      <OrderButton onOrderChange={orderMovieList} />
      <Movies
        movieList={allMovieList}
        isLoading={isLoading}
        hasMore={hasMore}
        onChangePage={setPage}
      />
    </div>
  );
}
