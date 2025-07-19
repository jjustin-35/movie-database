"use client";

import Image from "next/image";
import { Heart, HeartOff, Star, Calendar } from "lucide-react";
import { Movie } from "@/constants/type";
import { getImageUrl } from "@/helpers/getUrl";
import { formatDate } from "@/helpers/formatDate";

const MovieCard = ({
  movie,
  isInWatchlist,
  idx,
  onClick,
  addToWatchList,
  removeFromWatchList,
}: {
  movie: Movie;
  isInWatchlist: boolean;
  idx: number;
  addToWatchList: (movie: Movie) => void;
  removeFromWatchList: (movieId: number) => void;
  onClick?: (movie: Movie) => void;
}) => {
  const imageUrl = getImageUrl(movie.poster_path);
  const releaseDate = formatDate(movie.release_date);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchList(movie.id);
    } else {
      addToWatchList(movie);
    }
  };
  return (
    <div
      className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(movie)}
    >
      <div className="relative w-full h-72">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          className="object-cover"
          loading={idx < 5 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <button
          onClick={handleWatchlistToggle}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          title={isInWatchlist ? "從待看清單移除" : "加入待看清單"}
        >
          {isInWatchlist ? (
            <HeartOff className="w-5 h-5 text-red-400" />
          ) : (
            <Heart className="w-5 h-5 text-white" />
          )}
        </button>

        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{releaseDate}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;
