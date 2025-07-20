import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieList from '@/components/MovieList';
import { Movie } from '@/constants/type';

// Mock MovieCard component
jest.mock('@/components/MovieCard', () => ({
  __esModule: true,
  default: (props) => (
    <div 
      data-testid={`movie-card-${props.movie.id}`}
      data-is-in-watchlist={props.isInWatchlist}
      onClick={() => props.onClick(props.movie)}
    >
      <span>{props.movie.title}</span>
      <button 
        data-testid={`watchlist-button-${props.movie.id}`}
        onClick={(e) => {
          e.stopPropagation();
          if (props.isInWatchlist) {
            props.removeFromWatchList(props.movie.id);
          } else {
            props.addToWatchList(props.movie);
          }
        }}
      >
        {props.isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      </button>
    </div>
  )
}));

// Mock CardLoader component
jest.mock('@/components/Loading/cardLoader', () => ({
  __esModule: true,
  default: () => <div data-testid="card-loader">Loading...</div>
}));

// Mock MovieDetails component
jest.mock('@/components/MovieDetails', () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="movie-details">
      <span>{props.movie.title} details</span>
      <button data-testid="close-details" onClick={props.onClose}>Close</button>
    </div>
  )
}));

jest.mock('next/dynamic', () => jest.fn(() => jest.requireMock('@/components/MovieDetails').default));

describe('MovieList', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Movie 1',
      overview: 'This is the overview of Movie 1',
      poster_path: '/path/to/poster1.jpg',
      backdrop_path: '/path/to/backdrop1.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12],
      adult: false,
      original_language: 'zh',
      original_title: 'Original Movie 1',
      popularity: 123.45,
      video: false
    },
    {
      id: 2,
      title: 'Movie 2',
      overview: 'This is the overview of Movie 2',
      poster_path: '/path/to/poster2.jpg',
      backdrop_path: '/path/to/backdrop2.jpg',
      release_date: '2025-07-21',
      vote_average: 7.5,
      vote_count: 800,
      genre_ids: [35, 18],
      adult: false,
      original_language: 'en',
      original_title: 'Movie 2',
      popularity: 100.45,
      video: false
    }
  ];

  const mockProps = {
    movieList: mockMovies,
    watchList: [],
    isLoading: false,
    addToWatchList: jest.fn(),
    removeFromWatchList: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render movie list correctly', () => {
    render(<MovieList {...mockProps} />);
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
  });

  test('when isLoading is true and no movies, should display loading component', () => {
    render(
      <MovieList 
        {...mockProps} 
        isLoading={true} 
        movieList={[]} 
      />
    );
    
    expect(screen.getByTestId('card-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('movie-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('movie-card-2')).not.toBeInTheDocument();
  });

  test('when isLoading is true but has movies, should display movie list', () => {
    render(
      <MovieList 
        {...mockProps} 
        isLoading={true} 
      />
    );
    
    expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('card-loader')).not.toBeInTheDocument();
  });

  test('should show movie details when click movie card', () => {
    render(<MovieList {...mockProps} />);
    
    const movieCard = screen.getByTestId('movie-card-1');
    fireEvent.click(movieCard);
    
    const movieDetails = screen.getByTestId('movie-details');
    expect(movieDetails).toBeInTheDocument();
    expect(movieDetails).toHaveTextContent('Movie 1 details');
  });

  test('should close movie details when click close button', () => {
    render(<MovieList {...mockProps} />);
    
    const movieCard = screen.getByTestId('movie-card-1');
    fireEvent.click(movieCard);
    
    const movieDetails = screen.getByTestId('movie-details');
    expect(movieDetails).toBeInTheDocument();
    
    const closeButton = screen.getByTestId('close-details');
    fireEvent.click(closeButton);
    
    expect(movieDetails).not.toBeInTheDocument();
  });
});
