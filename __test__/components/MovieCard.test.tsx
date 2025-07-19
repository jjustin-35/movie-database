import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '../../components/MovieCard';
import { getImageUrl } from '../../helpers/getUrl';
import { formatDate } from '../../helpers/formatDate';
import { Movie } from '../../constants/type';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  }
}));

// Mock helper functions
jest.mock('../helpers/getUrl', () => ({
  getImageUrl: jest.fn()
}));

jest.mock('../helpers/formatDate', () => ({
  formatDate: jest.fn()
}));

// Mock PlaceholderImage component
jest.mock('../components/PlaceholderImage', () => ({
  __esModule: true,
  default: (props) => <div data-testid="placeholder-image" {...props} />
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

    // Verify movie title
    expect(screen.getByText('movie-title')).toBeInTheDocument();
    
    // Verify movie overview
    expect(screen.getByText('movie-overview')).toBeInTheDocument();
    
    // Verify rating
    expect(screen.getByText('8.5')).toBeInTheDocument();
    
    // Verify date
    expect(screen.getByText('2025年7月20日')).toBeInTheDocument();
    
    // Verify helper functions were called
    expect(getImageUrl).toHaveBeenCalledWith('/path/to/poster.jpg');
    expect(formatDate).toHaveBeenCalledWith('2025-07-20');
  });

  test('should display image when image path exists', () => {
    render(<MovieCard {...mockProps} />);
    
    // Verify image element exists
    const image = screen.getByAltText('movie-title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    
    // Verify placeholder image does not exist
    expect(screen.queryByTestId('placeholder-image')).not.toBeInTheDocument();
  });

  test('should display placeholder when no image path exists', () => {
    (getImageUrl as jest.Mock).mockReturnValue('');
    
    render(<MovieCard {...mockProps} />);
    
    // Verify placeholder image exists
    expect(screen.getByTestId('placeholder-image')).toBeInTheDocument();
    
    // Verify image does not exist
    expect(screen.queryByAltText('movie-title')).not.toBeInTheDocument();
  });

  test('should call onClick function when card is clicked', () => {
    render(<MovieCard {...mockProps} />);
    
    // Click the card
    fireEvent.click(screen.getByText('movie-title').closest('div').closest('div'));
    
    // Verify onClick was called
    expect(mockProps.onClick).toHaveBeenCalledWith(mockMovie);
  });

  test('should call addToWatchList when heart button is clicked and movie is not in watchlist', () => {
    render(<MovieCard {...mockProps} />);
    
    // Click heart button
    const heartButton = screen.getByTitle('add-to-watchlist');
    fireEvent.click(heartButton);
    
    // Verify addToWatchList was called
    expect(mockProps.addToWatchList).toHaveBeenCalledWith(mockMovie);
    expect(mockProps.removeFromWatchList).not.toHaveBeenCalled();
  });

  test('should call removeFromWatchList when heart button is clicked and movie is in watchlist', () => {
    render(<MovieCard {...mockProps} isInWatchlist={true} />);
    
    // Click heart button
    const heartButton = screen.getByTitle('remove-from-watchlist');
    fireEvent.click(heartButton);
    
    // Verify removeFromWatchList was called
    expect(mockProps.removeFromWatchList).toHaveBeenCalledWith(mockMovie.id);
    expect(mockProps.addToWatchList).not.toHaveBeenCalled();
  });

  test('should not trigger card onClick event when heart button is clicked', () => {
    render(<MovieCard {...mockProps} />);
    
    // Click heart button
    const heartButton = screen.getByTitle('add-to-watchlist');
    fireEvent.click(heartButton);
    
    // Verify onClick was not called
    expect(mockProps.onClick).not.toHaveBeenCalled();
  });

  test('should display red heart when movie is in watchlist', () => {
    render(<MovieCard {...mockProps} isInWatchlist={true} />);
    
    // Verify red heart exists
    const filledHeart = screen.getByTitle('remove-from-watchlist').querySelector('.fill-current');
    expect(filledHeart).toBeInTheDocument();
  });

  test('should display empty heart when movie is not in watchlist', () => {
    render(<MovieCard {...mockProps} isInWatchlist={false} />);
    
    // Verify empty heart exists
    const emptyHeart = screen.getByTitle('add-to-watchlist').querySelector('.text-white');
    expect(emptyHeart).toBeInTheDocument();
  });
});
