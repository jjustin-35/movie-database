import "./style.module.css";

interface LoaderRingProps {
  size?: {
    width?: number;
    height?: number;
  };
}

const LoadingSpinner = ({
  size = { width: 30, height: 30 },
}: LoaderRingProps) => {
  const { width, height } = size;
  const widthStyle = width ? `w-[${width - 8}px]` : "w-22";
  const heightStyle = height ? `h-[${height - 8}px]` : "h-22";
  return (
    <div style={{ width, height }}>
      {[...Array(3)].map((_, idx) => (
        <span
          key={idx}
          className={`block absolute ${widthStyle} ${heightStyle} rounded-full m-1 border-4 border-y-transparent border-x-transparent border-t-white animate-spin loading-spinner-delay`}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
