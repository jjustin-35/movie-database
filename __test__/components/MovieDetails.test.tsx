import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieDetails from '@/components/MovieDetails';
import { Movie, AllMovieDetail } from '@/constants/type';
import { useMovieDetail } from '@/hooks/useMovie';

jest.mock('@/hooks/useMovie', () => ({
  useMovieDetail: jest.fn()
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img data-testid={props['data-testid'] || 'image'} {...props} />;
  }
}));

jest.mock('@/helpers/getUrl', () => ({
  getImageUrl: jest.fn().mockImplementation((path, size) => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
  }),
  getYoutubeUrl: jest.fn().mockImplementation((key) => {
    return `https://www.youtube.com/watch?v=${key}`;
  })
}));

describe('MovieDetails', () => {
  const mockMovie: Movie = {
    id: 123,
    title: 'Test Movie',
    overview: 'This is a test movie',
    poster_path: '/path/to/poster.jpg',
    backdrop_path: '/path/to/backdrop.jpg',
    release_date: '2025-07-20',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [28, 12, 878],
    adult: false,
    original_language: 'en',
    original_title: 'Original Test Movie',
    popularity: 123.45,
    video: false
  };

  const mockMovieDetail: AllMovieDetail = {
    movie: {
      ...mockMovie,
      runtime: 120,
      imdb_id: 'tt1234567',
      genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
      tagline: 'Test tagline',
      status: 'Released',
      production_companies: [{ id: 1, name: 'Test Studio', logo_path: null, origin_country: 'US' }],
      production_countries: [{ iso_3166_1: 'US', name: 'United States of America' }],
      spoken_languages: [{ iso_639_1: 'en', name: 'English', english_name: 'English' }],
      budget: 100000000,
      revenue: 500000000,
      homepage: 'https://testmovie.com'
    },
    credits: {
      cast: [
        { id: 1, name: 'Actor 1', character: 'Character 1', profile_path: '/actor1.jpg' },
        { id: 2, name: 'Actor 2', character: 'Character 2', profile_path: '/actor2.jpg' }
      ],
      crew: [
        { id: 3, name: 'Director', job: 'Director' }
      ]
    },
    videos: [
      { id: 'vid1', key: 'abc123', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true, published_at: '2025-01-01' }
    ]
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'auto';
  });

  test('should render loading spinner when data is loading', () => {
    (useMovieDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(<MovieDetails movie={mockMovie} onClose={mockOnClose} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('should render movie details when data is loaded', async () => {
    (useMovieDetail as jest.Mock).mockReturnValue({
      data: mockMovieDetail,
      isLoading: false
    });

    render(<MovieDetails movie={mockMovie} onClose={mockOnClose} />);
    
    expect(screen.getByAltText('Test Movie backdrop')).toBeInTheDocument();
    expect(screen.getByAltText('Test Movie poster')).toBeInTheDocument();
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('2h 0m')).toBeInTheDocument();
    
    expect(screen.getByText('Actor 1')).toBeInTheDocument();
    expect(screen.getByText('Character 1')).toBeInTheDocument();
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('should call onClose when close button is clicked', () => {
    (useMovieDetail as jest.Mock).mockReturnValue({
      data: mockMovieDetail,
      isLoading: false
    });

    render(<MovieDetails movie={mockMovie} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByTestId('close-button'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when clicking outside the modal', () => {
    (useMovieDetail as jest.Mock).mockReturnValue({
      data: mockMovieDetail,
      isLoading: false
    });

    render(<MovieDetails movie={mockMovie} onClose={mockOnClose} />);
    
    const modalBackdrop = screen.getByTestId('movie-details-modal');
    fireEvent.click(modalBackdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should not call onClose when clicking inside the modal', () => {
    (useMovieDetail as jest.Mock).mockReturnValue({
      data: mockMovieDetail,
      isLoading: false
    });

    render(<MovieDetails movie={mockMovie} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByAltText('Test Movie poster'));
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('should restore body overflow when unmounted', () => {
    (useMovieDetail as jest.Mock).mockReturnValue({
      data: mockMovieDetail,
      isLoading: false
    });

    const { unmount } = render(<MovieDetails movie={mockMovie} onClose={mockOnClose} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('auto');
  });
});
