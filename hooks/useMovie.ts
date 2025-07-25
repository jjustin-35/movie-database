import useSWR from "swr";
import { useToast } from "@/context/toastContext";
import { getMovieList, getMovieSearch, getMovieDetail } from "@/apis/movies";

export const useMovieList = (page = 1, query: string | null = null) => {
  const { openToast } = useToast();
  const fetcher = query ? getMovieSearch : getMovieList;

  const { data, error, isLoading } = useSWR([page, query], fetcher);

  const movieList = data?.movieList;
  const hasMore = data?.totalPages > page;

  if (error) {
    const message = (() => {
      if (error.message) return error.message;
      if (query) return "Error searching movie";
      return "Error fetching movie list";
    })();

    openToast({
      message,
      type: "error",
    });
    return { data: [], error, isLoading, hasMore: false };
  }

  return { data: movieList, error, isLoading, hasMore };
};

export const useMovieDetail = (id: number) => {
  const { openToast } = useToast();
  const { data, error, isLoading } = useSWR([id], getMovieDetail);

  if (!data || error) {
    if (error) {
      const message = error.message || "Error fetching movie detail";
      openToast({
        message,
        type: "error",
      });
    }
    return { data: null, error, isLoading };
  }

  return { data, error, isLoading };
};
