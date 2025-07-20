import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '@/components/MovieCard';
import { getImageUrl } from '@/helpers/getUrl';
import { formatDate } from '@/helpers/formatDate';
import { Movie } from '@/constants/type';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    const { fill, priority, ...restProps } = props;
    const nextImageProps = {
      ...restProps,
      ...(fill && { fill: `${fill}` }),
      ...(priority && { loading: 'eager' })
    }
    return <img {...nextImageProps} alt={props.alt} />;
  }
}));

// Mock helper functions
jest.mock('@/helpers/getUrl', () => ({
  getImageUrl: jest.fn()
}));

jest.mock('@/helpers/formatDate', () => ({
  formatDate: jest.fn()
}));

describe('MovieCard', () => {
  const mockMovie: Movie = {
    id: 123,
    title: 'movie-title',
    overview: 'movie-overview',
    poster_path: '/path/to/poster.jpg',
    backdrop_path: '/path/to/backdrop.jpg',
    release_date: '2025-07-20',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [28, 12, 878],
    adult: false,
    original_language: 'zh',
    original_title: 'movie-original-title',
    popularity: 123.45,
    video: false
  };

  const mockProps = {
    movie: mockMovie,
    isInWatchlist: false,
    idx: 0,
    onClick: jest.fn(),
    addToWatchList: jest.fn(),
    removeFromWatchList: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getImageUrl as jest.Mock).mockReturnValue('https://example.com/image.jpg');
    (formatDate as jest.Mock).mockReturnValue('2025年7月20日');
  });

  test('should render movie card correctly', () => {
    render(<MovieCard {...mockProps} />);

    expect(screen.getByText('movie-title')).toBeInTheDocument();
    expect(screen.getByText('movie-overview')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('2025年7月20日')).toBeInTheDocument();
    
    expect(getImageUrl).toHaveBeenCalledWith('/path/to/poster.jpg');
    expect(formatDate).toHaveBeenCalledWith('2025-07-20');
  });

  test('should display image when image path exists', () => {
    render(<MovieCard {...mockProps} />);
    
    const image = screen.getByAltText('movie-title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    
    expect(screen.queryByTestId('placeholder-image')).not.toBeInTheDocument();
  });

  test('should display placeholder when no image path exists', () => {
    (getImageUrl as jest.Mock).mockReturnValue('');
    
    render(<MovieCard {...mockProps} />);
    
    expect(screen.getByTestId('placeholder-image')).toBeInTheDocument();
    expect(screen.queryByAltText('movie-title')).not.toBeInTheDocument();
  });

  test('should call addToWatchList when heart button is clicked and movie is not in watchlist', () => {
    render(<MovieCard {...mockProps} />);
    
    const heartButton = screen.getByTitle('加入待看清單');
    fireEvent.click(heartButton);
    
    expect(mockProps.addToWatchList).toHaveBeenCalledWith(mockMovie);
    expect(mockProps.removeFromWatchList).not.toHaveBeenCalled();
    expect(mockProps.onClick).not.toHaveBeenCalled();
  });

  test('should call removeFromWatchList when heart button is clicked and movie is in watchlist', () => {
    render(<MovieCard {...mockProps} isInWatchlist={true} />);
    
    const heartButton = screen.getByTitle('從待看清單移除');
    fireEvent.click(heartButton);
    
    expect(mockProps.removeFromWatchList).toHaveBeenCalledWith(mockMovie.id);
    expect(mockProps.addToWatchList).not.toHaveBeenCalled();
    expect(mockProps.onClick).not.toHaveBeenCalled();
  });
});
