import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const CardLoader = () => {
    return (
        <div>
            <SkeletonTheme baseColor="var(--color-stone-900)" highlightColor="var(--color-stone-800)">
            <Skeleton
                borderRadius={10}
                containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 h-110 overflow-hidden"
                className="w-full h-110"
                inline={true}
                count={5}
            />
            </SkeletonTheme>
        </div>
    );
};

export default CardLoader;
