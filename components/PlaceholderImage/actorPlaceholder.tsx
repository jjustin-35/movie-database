import { ScanFace } from "lucide-react";

const ActorPlaceholder = ({ className }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center bg-stone-800 backdrop-blur-md p-4 ${className}`}>
            <ScanFace className="w-full h-full aspect-square text-gray-400" />
        </div>
    );
};

export default ActorPlaceholder;