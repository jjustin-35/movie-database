import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { WatchListProvider, useWatchList } from '../context/watchListContext';
import { Movie } from '../constants/type';

// 模擬 localStorage
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

// 測試用元件
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
              移除
            </button>
          </li>
        ))}
      </ul>
      <button 
        data-testid="add-movie"
        onClick={() => addToWatchList({
          id: 123,
          title: '測試電影',
          overview: '這是一部測試電影',
          poster_path: '/path/to/poster.jpg',
          backdrop_path: '/path/to/backdrop.jpg',
          release_date: '2025-07-20',
          vote_average: 8.5,
          vote_count: 1000,
          genre_ids: [28, 12, 878],
          adult: false,
          original_language: 'zh',
          original_title: '測試電影原名',
          popularity: 123.45,
          video: false
        })}
      >
        新增電影
      </button>
    </div>
  );
};

describe('WatchListContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  test('應該提供空的初始待看清單', async () => {
    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    // 等待 useEffect 載入完成
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('0');
  });

  test('應該從 localStorage 載入現有的待看清單', async () => {
    const mockMovie: Movie = {
      id: 456,
      title: '已存在的電影',
      overview: '這是一部已存在的電影',
      poster_path: '/path/to/poster.jpg',
      backdrop_path: '/path/to/backdrop.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12, 878],
      adult: false,
      original_language: 'zh',
      original_title: '已存在的電影原名',
      popularity: 123.45,
      video: false
    };

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([mockMovie]));

    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    // 等待 useEffect 載入完成
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('1');
    expect(screen.getByTestId(`movie-${mockMovie.id}`)).toBeInTheDocument();
  });

  test('應該能夠新增電影到待看清單', async () => {
    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    // 等待 useEffect 載入完成
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('0');

    // 新增電影
    act(() => {
      screen.getByTestId('add-movie').click();
    });

    // 確認電影已新增
    expect(screen.getByTestId('watchlist-count').textContent).toBe('1');
    expect(screen.getByTestId('movie-123')).toBeInTheDocument();
    
    // 確認 localStorage 已更新
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'watchList',
      expect.any(String)
    );
    
    // 驗證儲存的內容
    const savedContent = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
    expect(savedContent).toHaveLength(1);
    expect(savedContent[0].id).toBe(123);
    expect(savedContent[0].title).toBe('測試電影');
  });

  test('應該能夠從待看清單移除電影', async () => {
    const mockMovie: Movie = {
      id: 456,
      title: '已存在的電影',
      overview: '這是一部已存在的電影',
      poster_path: '/path/to/poster.jpg',
      backdrop_path: '/path/to/backdrop.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12, 878],
      adult: false,
      original_language: 'zh',
      original_title: '已存在的電影原名',
      popularity: 123.45,
      video: false
    };

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([mockMovie]));

    render(
      <WatchListProvider>
        <TestComponent />
      </WatchListProvider>
    );

    // 等待 useEffect 載入完成
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('watchList');
    });

    expect(screen.getByTestId('watchlist-count').textContent).toBe('1');
    expect(screen.getByTestId(`movie-${mockMovie.id}`)).toBeInTheDocument();

    // 移除電影
    act(() => {
      screen.getByTestId(`remove-${mockMovie.id}`).click();
    });

    // 確認電影已移除
    expect(screen.getByTestId('watchlist-count').textContent).toBe('0');
    expect(screen.queryByTestId(`movie-${mockMovie.id}`)).not.toBeInTheDocument();
    
    // 確認 localStorage 已更新
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'watchList',
      expect.any(String)
    );
    
    // 驗證儲存的內容
    const savedContent = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
    expect(savedContent).toHaveLength(0);
  });

  test('useWatchList 在 Provider 外使用時應拋出錯誤', () => {
    // 模擬 console.error 以避免測試輸出中出現錯誤訊息
    const originalError = console.error;
    console.error = jest.fn();
    
    // 預期 useWatchList 在 Provider 外使用時會拋出錯誤
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useWatchlist must be used within a WatchlistProvider');
    
    // 恢復 console.error
    console.error = originalError;
  });
});
