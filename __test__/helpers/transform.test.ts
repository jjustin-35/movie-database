import { transformMovie, transformMovieDetail } from '../../helpers/transform';
import { Movie } from '../../constants/type';

describe('transformMovie', () => {
  test('should correctly transform complete movie data', () => {
    const mockMovie: Movie = {
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
    };

    const result = transformMovie(mockMovie);

    expect(result).toEqual(mockMovie);
  });

  test('should handle partial missing data', () => {
    const mockPartialMovie = {
      id: 123,
      title: '測試電影'
    };

    const result = transformMovie(mockPartialMovie as any);

    expect(result).toEqual({
      id: 123,
      title: '測試電影',
      overview: '',
      poster_path: null,
      backdrop_path: null,
      release_date: '',
      vote_average: 0,
      vote_count: 0,
      genre_ids: [],
      adult: false,
      original_language: 'en',
      original_title: '',
      popularity: 0,
      video: false
    });
  });

  test('should handle empty object input', () => {
    const result = transformMovie({} as any);

    expect(result).toEqual({
      id: 0,
      title: 'Unknown Title',
      overview: '',
      poster_path: null,
      backdrop_path: null,
      release_date: '',
      vote_average: 0,
      vote_count: 0,
      genre_ids: [],
      adult: false,
      original_language: 'en',
      original_title: '',
      popularity: 0,
      video: false
    });
  });
});

describe('transformMovieDetail', () => {
  test('should correctly transform movie detail data', () => {
    const mockMovie = {
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
      video: false,
      runtime: 120,
      genres: [{ id: 28, name: '動作' }],
      production_companies: [{ id: 1, name: '測試工作室', logo_path: '/logo.png', origin_country: 'TW' }],
      production_countries: [{ iso_3166_1: 'TW', name: '台灣' }],
      spoken_languages: [{ iso_639_1: 'zh', name: '中文' }],
      status: '已上映',
      tagline: '這是標語',
      budget: 1000000,
      revenue: 5000000,
      homepage: 'https://example.com',
      imdb_id: 'tt1234567'
    };

    const mockCredits = {
      cast: [{ id: 1, name: '演員1', character: '角色1', profile_path: '/actor1.jpg' }],
      crew: [{ id: 2, name: '導演', job: 'Director', profile_path: '/director.jpg' }]
    };

    const mockVideos = [
      { id: 'vid1', key: 'abc123', name: '預告片', site: 'YouTube', type: 'Trailer', official: true, published_at: '2025-07-20' }
    ];

    const result = transformMovieDetail({
      movie: mockMovie as any,
      credits: mockCredits,
      videos: mockVideos
    });

    expect(result.movie).toMatchObject({
      id: 123,
      title: '測試電影',
      runtime: 120,
      genres: [{ id: 28, name: '動作' }]
    });
    expect(result.credits.cast).toHaveLength(1);
    expect(result.credits.crew).toHaveLength(1);
    expect(result.videos).toHaveLength(1);
  });

  test('should handle missing movie detail data', () => {
    const mockMovie = {
      id: 123,
      title: '測試電影'
    };

    const result = transformMovieDetail({
      movie: mockMovie as any,
      credits: {} as any,
      videos: undefined as any
    });

    expect(result.movie).toMatchObject({
      id: 123,
      title: '測試電影',
      runtime: 0,
      genres: []
    });
    expect(result.credits.cast).toEqual([]);
    expect(result.credits.crew).toEqual([]);
    expect(result.videos).toEqual([]);
  });
});
