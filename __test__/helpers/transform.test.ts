import { transformMovie, transformMovieDetail } from '../../helpers/transform';
import { Movie } from '../../constants/type';

describe('transformMovie', () => {
  test('should correctly transform complete movie data', () => {
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
      original_language: 'zh',
      original_title: 'Test Movie original name',
      popularity: 123.45,
      video: false
    };

    const result = transformMovie(mockMovie);

    expect(result).toEqual(mockMovie);
  });

  test('should handle partial missing data', () => {
    const mockPartialMovie = {
      id: 123,
      title: 'Test Movie'
    };

    const result = transformMovie(mockPartialMovie as any);

    expect(result).toEqual({
      id: 123,
      title: 'Test Movie',
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
      title: 'Test Movie',
      overview: 'This is a test movie',
      poster_path: '/path/to/poster.jpg',
      backdrop_path: '/path/to/backdrop.jpg',
      release_date: '2025-07-20',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [28, 12, 878],
      adult: false,
      original_language: 'zh',
      original_title: 'Test Movie original name',
      popularity: 123.45,
      video: false,
      runtime: 120,
      genres: [{ id: 28, name: 'Action' }],
      production_companies: [{ id: 1, name: 'Test Studio', logo_path: '/logo.png', origin_country: 'TW' }],
      production_countries: [{ iso_3166_1: 'TW', name: 'Taiwan' }],
      spoken_languages: [{ iso_639_1: 'zh', name: 'Chinese' }],
      status: 'Released',
      tagline: 'This is a tagline',
      budget: 1000000,
      revenue: 5000000,
      homepage: 'https://example.com',
      imdb_id: 'tt1234567'
    };

    const mockCredits = {
      cast: [{ id: 1, name: 'Actor1', character: 'Character1', profile_path: '/actor1.jpg' }],
      crew: [{ id: 2, name: 'Director', job: 'Director', profile_path: '/director.jpg' }]
    };

    const mockVideos = [
      { id: 'vid1', key: 'abc123', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true, published_at: '2025-07-20' }
    ];

    const result = transformMovieDetail({
      movie: mockMovie as any,
      credits: mockCredits,
      videos: mockVideos
    });

    expect(result.movie).toMatchObject({
      id: 123,
      title: 'Test Movie',
      runtime: 120,
      genres: [{ id: 28, name: 'Action' }]
    });
    expect(result.credits.cast).toHaveLength(1);
    expect(result.credits.crew).toHaveLength(1);
    expect(result.videos).toHaveLength(1);
  });

  test('should handle missing movie detail data', () => {
    const mockMovie = {
      id: 123,
      title: 'Test Movie'
    };

    const result = transformMovieDetail({
      movie: mockMovie as any,
      credits: {} as any,
      videos: undefined as any
    });

    expect(result.movie).toMatchObject({
      id: 123,
      title: 'Test Movie',
      runtime: 0,
      genres: []
    });
    expect(result.credits.cast).toEqual([]);
    expect(result.credits.crew).toEqual([]);
    expect(result.videos).toEqual([]);
  });
});
