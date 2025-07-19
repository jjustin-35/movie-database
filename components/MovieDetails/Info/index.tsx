import Image from "next/image";
import { getImageUrl } from "@/helpers/getUrl";
import { AllMovieDetail } from "@/constants/type";
import InfoHead from "./infoHead";
import InfoContent from "./infoContent";
interface InfoProps {
  movieDetail: AllMovieDetail;
}

const Info = ({ movieDetail }: InfoProps) => {
  const { movie, credits, videos } = movieDetail || {};
  const posterUrl = getImageUrl(movie?.poster_path, "w500");

  return (
    <div className="p-6 -mt-30 relative z-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* poster */}
        <div className="flex-shrink-0">
          <Image
            src={posterUrl}
            alt={movie.title}
            className="w-48 h-72 object-cover rounded-lg shadow-lg"
            width={1000}
            height={1000}
          />
        </div>

        <div className="flex-1">
          <InfoHead movie={movie} videos={videos || []} />
          <InfoContent movie={movie} credits={credits} />
        </div>
      </div>
    </div>
  );
};

export default Info;
