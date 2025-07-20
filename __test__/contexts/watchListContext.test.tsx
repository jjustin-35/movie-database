import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { WatchListProvider, useWatchList } from '../../context/watchListContext';
import { Movie } from '../../constants/type';

// Mock localStorage  
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test component
const mockMovie: Movie = {
  id: 123,
  title: 'test movie',
  overview: 'This is a test movie',
  poster_path: '/path/to/poster.jpg',
  backdrop_path: '/path/to/backdrop.jpg',
  release_date: '2025-07-20',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12, 878],
  adult: false,
  original_language: 'zh',
  original_title: 'test original movie',
  popularity: 123.45,
  video: false
};
const TestComponent = () => {
  const { watchList, addToWatchList, removeFromWatchList } = useWatchList();
  
  return (
    <div> 
      <div data-testid="watchlist-count">{watchList.length}</div>
      <ul>
        {watchList.map(movie => (
          <li key={movie.id} data-testid={`movie-${movie.id}`}>
            {movie.title}
            <button 
              data-testid={`remove-${movie.id}`}
              onClick={() => removeFromWatchList(movie.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button 
        data-testid="add-movie"
        onClick={() => addToWatchList(mockMovie)}
      >
        Add Movie
      </button>
    </div>
  );
};

describe('WatchListContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  test('should provide empty initial watchlist', async () => {
    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('0');
  });

  test('should load existing watchlist from localStorage', async () => {
    const mockMovie: Movie = {
      id: 456,
      title: 'test existing movie',
      overview: 'This is an existing movie',
      poster_path: '/path/to/poster.jpg',
      backdrop_path: '/path/to/backdrop.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12, 878],
      adult: false,
      original_language: 'zh',
      original_title: 'test existing movie original title',
      popularity: 123.45,
      video: false
    };

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([mockMovie]));

    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('1');
    expect(screen.getByTestId(`movie-${mockMovie.id}`)).toBeInTheDocument();
  });

  test('should be able to add movie to watchlist', async () => {
    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('0');

    // add new movie
    act(() => {
      screen.getByTestId('add-movie').click();
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('1');
    expect(screen.getByTestId('movie-123')).toBeInTheDocument();
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'watchList',
      expect.any(String)
    );
    
    // verify saved content
    const savedContent = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
    expect(savedContent).toHaveLength(1);
    expect(savedContent[0].id).toBe(123);
    expect(savedContent[0].title).toBe('test movie');
  });

  test('should be able to remove movie from watchlist', async () => {
    const mockMovie: Movie = {
      id: 456,
      title: 'test existing movie',
      overview: 'This is an existing movie',
      poster_path: '/path/to/poster.jpg',
      backdrop_path: '/path/to/backdrop.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12, 878],
      adult: false,
      original_language: 'zh',
      original_title: 'test existing movie original title',
      popularity: 123.45,
      video: false
    };

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([mockMovie]));

    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('1');
    expect(screen.getByTestId(`movie-${mockMovie.id}`)).toBeInTheDocument();

    act(() => {
      screen.getByTestId(`remove-${mockMovie.id}`).click();
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('0');
    expect(screen.queryByTestId(`movie-${mockMovie.id}`)).not.toBeInTheDocument();
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'watchList',
      expect.any(String)
    );
    
    const savedContent = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
    expect(savedContent).toHaveLength(0);
  });
});
