import { formatDate } from '../helpers/formatDate';

describe('formatDate', () => {
  // Save the original toLocaleDateString method
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;

  // Mock toLocaleDateString method before each test
  beforeEach(() => {
    Date.prototype.toLocaleDateString = jest.fn((locale, options) => {
      if (locale === 'zh-TW') {
        const date = new Date(this);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
      }
      return originalToLocaleDateString.call(this, locale, options);
    });
  });

  // Restore the original toLocaleDateString method after each test
  afterEach(() => {
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  test('should correctly format valid date string', () => {
    const result = formatDate('2025-07-20');
    expect(result).toBe('2025年7月20日');
  });

  test('should correctly format Date object', () => {
    const dateObj = new Date('2025-07-20');
    const result = formatDate(dateObj);
    expect(result).toBe('2025年7月20日');
  });

  test('should handle empty date string', () => {
    const result = formatDate('');
    expect(result).toBe('');
  });

  test('should handle invalid date string', () => {
    const result = formatDate('invalid-date');
    // Invalid date will produce "Invalid Date", but formatDate function will use toLocaleDateString
    // Actual result will vary depending on browser and environment, here we mainly test that the function doesn't throw an error
    expect(typeof result).toBe('string');
  });

  test('should handle undefined and null values', () => {
    const result1 = formatDate(undefined as any);
    expect(result1).toBe('');
    
    const result2 = formatDate(null as any);
    expect(result2).toBe('');
  });
});
