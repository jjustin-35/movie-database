import styles from "./style.module.css";

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
  return (
    <div style={{ width, height }}>
      {[...Array(3)].map((_, idx) => (
        <span
          key={idx}
          style={{
            width: width ? `${width - 8}px` : "22px",
            height: height ? `${height - 8}px` : "22px",
          }}
          className={`block absolute rounded-full m-1 border-4 border-y-transparent border-x-transparent border-t-white ${styles.spinnerDelay}`}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
