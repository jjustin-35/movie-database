import { Credits, MovieDetails } from "@/constants/type";
import { getImageUrl } from "@/helpers/getUrl";
import Image from "next/image";
import ActorPlaceholder from "../../PlaceholderImage/actorPlaceholder";

const InfoContent = ({ movie, credits }: { movie: MovieDetails, credits: Credits }) => {
  const director = credits?.crew.find((person) => person.job === "Director");
  const mainCast = credits?.cast.slice(0, 8);

  return (
    <>
      {/* overview */}
      <h3 className="text-xl font-bold text-white mb-2">劇情簡介</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">{movie.overview}</p>

      {/* director */}
      {director && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">導演</h3>
          <p className="text-gray-300">{director.name}</p>
        </div>
      )}

      {/* main cast */}
      {mainCast.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">主要演員</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainCast.map((actor) => {
              const imageUrl = getImageUrl(actor.profile_path);
              return (
              <div key={actor.id} className="text-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={actor.name}
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
                    width={80}
                    height={80}
                  />
                ) : (
                  <ActorPlaceholder className="w-20 h-20 object-cover rounded-full mx-auto mb-2" />
                )}
                <p className="text-white text-sm font-medium">{actor.name}</p>
                <p className="text-gray-400 text-xs">{actor.character}</p>
              </div>
            )})}
          </div>
        </div>
      )}
    </>
  );
};

export default InfoContent;
