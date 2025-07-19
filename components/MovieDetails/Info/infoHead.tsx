import {
  Heart,
  HeartOff,
  Play,
  ExternalLink,
  Star,
  Calendar,
  Clock,
} from "lucide-react";
import { MovieDetails, Video } from "@/constants/type";
import { useWatchList } from "@/context/watchListContext";
import { formatDate } from "@/helpers/formatDate";
import { getYoutubeUrl } from "@/helpers/getUrl";

const InfoHead = ({ movie, videos }: { movie: MovieDetails, videos: Video[] }) => {
  const { addToWatchList, removeFromWatchList, watchList } = useWatchList();
  const isInWatchlist = watchList.some((item) => item.id === movie.id);
  const trailerKey = videos?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  )?.key;
  const trailerUrl = getYoutubeUrl(trailerKey);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchList(movie.id);
    } else {
      addToWatchList(movie);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-6">{movie.title}</h1>

      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex items-center gap-2 text-gray-300">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
          <span className="text-sm">({movie.vote_count} 評分)</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="w-5 h-5" />
          <span>{formatDate(movie.release_date)}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-5 h-5" />
          <span>{formatRuntime(movie.runtime)}</span>
        </div>
      </div>

      {/* genres */}
      <div className="flex flex-wrap gap-2 mb-4">
        {movie.genres.map((genre) => (
          <span
            key={genre.id}
            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
          >
            {genre.name}
          </span>
        ))}
      </div>

      <div className="flex gap-4 mb-6">
        {trailerKey && (
          <a
            href={trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" />
            <span className="hidden sm:inline-flex gap-1 items-center">
              觀看預告片
              <ExternalLink className="w-4 h-4" />
            </span>
          </a>
        )}

        <button
          onClick={handleWatchlistToggle}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            isInWatchlist
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isInWatchlist ? (
            <>
              <HeartOff className="w-5 h-5" />
              <span className="hidden sm:block">從待看清單移除</span>
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              <span className="hidden sm:block">加入待看清單</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default InfoHead;
