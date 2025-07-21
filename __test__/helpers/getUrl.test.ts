import { getImageUrl, getYoutubeUrl, getApiUrl } from '@/helpers/getUrl';
import configs from '@/config';

jest.mock('@/config', () => ({
  API_BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
}));

describe('getImageUrl', () => {
  test('should generate correct image URL with default size', () => {
    const path = '/path/to/image.jpg';
    const result = getImageUrl(path);
    expect(result).toBe(`${configs.IMAGE_BASE_URL}/w500${path}`);
  });

  test('should generate correct image URL with specified size', () => {
    const path = '/path/to/image.jpg';
    const size = 'original';
    const result = getImageUrl(path, size);
    expect(result).toBe(`${configs.IMAGE_BASE_URL}/${size}${path}`);
  });

  test('should handle empty path', () => {
    const result = getImageUrl('');
    expect(result).toBe('');
  });

  test('should handle null or undefined path', () => {
    const result1 = getImageUrl(null);
    expect(result1).toBe('');
    
    const result2 = getImageUrl(undefined);
    expect(result2).toBe('');
  });
});

describe('getYoutubeUrl', () => {
  test('should generate correct YouTube URL', () => {
    const videoId = 'abc123';
    const result = getYoutubeUrl(videoId);
    expect(result).toBe(`https://www.youtube.com/watch?v=${videoId}`);
  });
});

describe('getApiUrl', () => {
  test('should generate basic API URL', () => {
    const apiPath = '/movie/popular';
    const result = getApiUrl(apiPath);
    
    expect(result).toContain(`${configs.API_BASE_URL}${apiPath}`);
    expect(result).toContain('api_key');
    expect(result).toContain('language=zh-TW');
  });

  test('should handle additional parameters', () => {
    const apiPath = '/search/movie';
    const params = {
      query: 'test movie',
      page: 2
    };
    const result = getApiUrl(apiPath, params);
    expect(result).toContain('api_key');
    expect(result).toContain('language=zh-TW');
    expect(result).toContain('query=test+movie');
    expect(result).toContain('page=2');
  });

  test('should use specified language', () => {
    const apiPath = '/movie/popular';
    const params = { page: 1 };
    const language = 'en-US';
    const result = getApiUrl(apiPath, params, language);
    
    expect(result).toContain(`language=${language}`);
  });

  test('should handle empty params object', () => {
    const apiPath = '/movie/popular';
    const result = getApiUrl(apiPath, {});
    
    expect(result).toBeNull();
  });
});
