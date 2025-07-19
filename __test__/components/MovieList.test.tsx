import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieList from '../../components/MovieList';
import { Movie } from '../../constants/type';

// 模擬 MovieCard 元件
jest.mock('../components/MovieCard', () => ({
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
        {props.isInWatchlist ? '從待看清單移除' : '加入待看清單'}
      </button>
    </div>
  )
}));

// 模擬 CardLoader 元件
jest.mock('../components/Loading/cardLoader', () => ({
  __esModule: true,
  default: () => <div data-testid="card-loader">載入中...</div>
}));

// 模擬 MovieDetails 元件
jest.mock('../components/MovieDetails', () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="movie-details">
      <span>{props.movie.title} 的詳情</span>
      <button data-testid="close-details" onClick={props.onClose}>關閉</button>
    </div>
  )
}));

// 模擬 next/dynamic
jest.mock('next/dynamic', () => jest.fn(() => jest.requireMock('../components/MovieDetails').default));

describe('MovieList', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: '電影 1',
      overview: '這是電影 1 的簡介',
      poster_path: '/path/to/poster1.jpg',
      backdrop_path: '/path/to/backdrop1.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12],
      adult: false,
      original_language: 'zh',
      original_title: '電影 1 原名',
      popularity: 123.45,
      video: false
    },
    {
      id: 2,
      title: '電影 2',
      overview: '這是電影 2 的簡介',
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

  const mockWatchList: Movie[] = [
    {
      id: 1,
      title: '電影 1',
      overview: '這是電影 1 的簡介',
      poster_path: '/path/to/poster1.jpg',
      backdrop_path: '/path/to/backdrop1.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12],
      adult: false,
      original_language: 'zh',
      original_title: '電影 1 原名',
      popularity: 123.45,
      video: false
    }
  ];

  const mockProps = {
    movieList: mockMovies,
    watchList: mockWatchList,
    isLoading: false,
    addToWatchList: jest.fn(),
    removeFromWatchList: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('應該正確渲染電影列表', () => {
    render(<MovieList {...mockProps} />);
    
    // 驗證所有電影卡片都被渲染
    expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
    
    // 驗證電影標題
    expect(screen.getByText('電影 1')).toBeInTheDocument();
    expect(screen.getByText('電影 2')).toBeInTheDocument();
  });

  test('當 isLoading 為 true 且沒有電影時，應顯示載入元件', () => {
    render(
      <MovieList 
        {...mockProps} 
        isLoading={true} 
        movieList={[]} 
      />
    );
    
    // 驗證載入元件被渲染
    expect(screen.getByTestId('card-loader')).toBeInTheDocument();
    
    // 驗證沒有電影卡片被渲染
    expect(screen.queryByTestId('movie-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('movie-card-2')).not.toBeInTheDocument();
  });

  test('當 isLoading 為 true 但有電影時，應顯示電影列表', () => {
    render(
      <MovieList 
        {...mockProps} 
        isLoading={true} 
      />
    );
    
    // 驗證電影卡片被渲染
    expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
    
    // 驗證載入元件沒有被渲染
    expect(screen.queryByTestId('card-loader')).not.toBeInTheDocument();
  });

  test('應該正確標記待看清單中的電影', () => {
    render(<MovieList {...mockProps} />);
    
    // 驗證電影 1 被標記為在待看清單中
    expect(screen.getByTestId('movie-card-1')).toHaveAttribute('data-is-in-watchlist', 'true');
    
    // 驗證電影 2 被標記為不在待看清單中
    expect(screen.getByTestId('movie-card-2')).toHaveAttribute('data-is-in-watchlist', 'false');
  });

  test('點擊電影卡片應顯示電影詳情', () => {
    render(<MovieList {...mockProps} />);
    
    // 初始時沒有顯示電影詳情
    expect(screen.queryByTestId('movie-details')).not.toBeInTheDocument();
    
    // 點擊電影卡片
    fireEvent.click(screen.getByTestId('movie-card-1'));
    
    // 驗證電影詳情被顯示
    expect(screen.getByTestId('movie-details')).toBeInTheDocument();
    expect(screen.getByText('電影 1 的詳情')).toBeInTheDocument();
  });

  test('點擊關閉按鈕應隱藏電影詳情', () => {
    render(<MovieList {...mockProps} />);
    
    // 點擊電影卡片顯示詳情
    fireEvent.click(screen.getByTestId('movie-card-1'));
    expect(screen.getByTestId('movie-details')).toBeInTheDocument();
    
    // 點擊關閉按鈕
    fireEvent.click(screen.getByTestId('close-details'));
    
    // 驗證電影詳情被隱藏
    expect(screen.queryByTestId('movie-details')).not.toBeInTheDocument();
  });

  test('點擊待看清單按鈕應調用相應的函數', () => {
    render(<MovieList {...mockProps} />);
    
    // 點擊電影 1 的待看清單按鈕（從待看清單移除）
    fireEvent.click(screen.getByTestId('watchlist-button-1'));
    expect(mockProps.removeFromWatchList).toHaveBeenCalledWith(1);
    expect(mockProps.addToWatchList).not.toHaveBeenCalled();
    
    // 點擊電影 2 的待看清單按鈕（加入待看清單）
    fireEvent.click(screen.getByTestId('watchlist-button-2'));
    expect(mockProps.addToWatchList).toHaveBeenCalledWith(mockMovies[1]);
  });
});
