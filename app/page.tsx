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
  const [orderType, setOrderType] = useState<OrderType>(OrderType.popularity);
  const [allMovieList, setAllMovieList] = useState<Movie[]>([]);
  const { data: movieList, isLoading, hasMore } = useMovieList(page, query);

  useEffect(() => {
    if (movieList && !isLoading) {
      const newMovieList = [...allMovieList, ...movieList];
      const orderedMovieList = orderList({
        order: "desc",
        type: orderType,
        list: newMovieList,
      });
      setAllMovieList(orderedMovieList);
    }
  }, [movieList, isLoading]);

  useEffect(() => {
    if (allMovieList.length > 0) {
      const orderedMovieList = orderList({
        order: "desc",
        type: orderType,
        list: allMovieList,
      });
      setAllMovieList(orderedMovieList);
    }
  }, [orderType]);

  const orderMovieList = (type: OrderType) => {
    setOrderType(type);
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
        onChangePage={setPage}
        hasMore={hasMore}
      />
    </div>
  );
}
