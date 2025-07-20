import React from 'react';
import { render, renderHook } from '@testing-library/react';
import useObserver from '@/hooks/useObserver';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
});

window.IntersectionObserver = mockIntersectionObserver;

describe('useObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create and return a ref callback function', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };

    const { result } = renderHook(() => useObserver(mockCallback, mockOptions));
    expect(typeof result.current).toBe('function');
  });

  test('should create IntersectionObserver and observe the node when a DOM node is provided', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };
    const mockNode = document.createElement('div');

    const { result } = renderHook(() => useObserver(mockCallback, mockOptions));

    result.current(mockNode);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(mockCallback, mockOptions);
    expect(mockIntersectionObserver.mock.results[0].value.observe).toHaveBeenCalledWith(mockNode);
  });

  test('should disconnect observer when null node is provided', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };
    const mockNode = document.createElement('div');
    const mockDisconnect = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      disconnect: mockDisconnect,
      unobserve: jest.fn()
    });

    const { result, rerender } = renderHook(() => useObserver(mockCallback, mockOptions));

    result.current(mockNode);

    result.current(null);

    expect(mockDisconnect).toHaveBeenCalled();
  });

  test('should recreate ref callback when callback or options change', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const mockOptions1 = { rootMargin: '10px', threshold: 0.5 };
    const mockOptions2 = { rootMargin: '20px', threshold: 0.8 };

    const { result, rerender } = renderHook(
      ({ callback, options }) => useObserver(callback, options),
      {
        initialProps: { callback: mockCallback1, options: mockOptions1 }
      }
    );

    const firstRefCallback = result.current;

    rerender({ callback: mockCallback1, options: mockOptions1 });

    expect(result.current).toBe(firstRefCallback);

    rerender({ callback: mockCallback2, options: mockOptions1 });
    expect(result.current).not.toBe(firstRefCallback);

    const secondRefCallback = result.current;

    rerender({ callback: mockCallback2, options: mockOptions2 });

    expect(result.current).not.toBe(secondRefCallback);
  });

  test('should use useObserver in actual component', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };

    const TestComponent = () => {
      const ref = useObserver(mockCallback, mockOptions);
      return <div ref={ref} data-testid="observed-element">觀察元素</div>;
    };
    const { getByTestId } = render(<TestComponent />);
    const observedElement = getByTestId('observed-element');

    expect(mockIntersectionObserver).toHaveBeenCalledWith(mockCallback, mockOptions);
    expect(mockIntersectionObserver.mock.results[0].value.observe).toHaveBeenCalledWith(observedElement);
  });
});
