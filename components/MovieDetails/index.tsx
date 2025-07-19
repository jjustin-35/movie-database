"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";
import { Movie } from "@/constants/type";
import { useMovieDetail } from "@/hooks/useMovie";
import { getImageUrl } from "@/helpers/getUrl";
import LoadingSpinner from "../Loading/spinner";
import PlaceholderImage from "../PlaceholderImage";
import Info from "./Info";

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails = ({ movie, onClose }: MovieDetailsProps) => {
  const { data: movieDetail, isLoading } = useMovieDetail(movie.id);
  const backdropUrl = getImageUrl(movie?.backdrop_path, "w1280");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-20">
      <div className="bg-white/10 backdrop-blur-md rounded-xl max-w-4xl w-full h-full max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors z-10 cursor-pointer"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size={{ width: 60, height: 60 }} />
          </div>
        ) : (
          <>
            {/* backdrop */}
            <div className="relative h-64 md:h-80">
              {backdropUrl ? (
                <Image
                  src={backdropUrl}
                  alt={`${movie.title} backdrop`}
                  className="w-full h-full object-cover"
                  width={1000}
                  height={1000}
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
              ) : (
                <PlaceholderImage className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            </div>
            <Info movieDetail={movieDetail} />
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
