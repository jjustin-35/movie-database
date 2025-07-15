import { Loader } from './styled';

type LoaderRingProps = {
  size?: {
    width?: number;
    height?: number;
  };
  color?: string;
};

const LoaderRing = ({ size = {}, color }: LoaderRingProps) => {
  const { width, height } = size;
  return (
    <Loader width={width} height={height} color={color}>
      {[...Array(3)].map((_, idx) => (
        <span key={idx} />
      ))}
    </Loader>
  );
};

export default LoaderRing;
