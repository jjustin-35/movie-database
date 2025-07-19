import { Clapperboard } from "lucide-react";

const PlaceholderImage = ({ className }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center bg-stone-800 backdrop-blur-md p-12 ${className}`}>
            <Clapperboard className="w-full h-full aspect-square text-gray-400" />
        </div>
    );
};

export default PlaceholderImage;
