import React from 'react';
import { render, renderHook } from '@testing-library/react';
import useObserver from '../../hooks/useObserver';

// 模擬 IntersectionObserver
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

  test('應該建立並返回一個 ref callback 函數', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };

    // 渲染 hook
    const { result } = renderHook(() => useObserver(mockCallback, mockOptions));

    // 驗證返回值是一個函數
    expect(typeof result.current).toBe('function');
  });

  test('當提供 DOM 節點時，應該建立 IntersectionObserver 並觀察該節點', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };
    const mockNode = document.createElement('div');

    // 渲染 hook
    const { result } = renderHook(() => useObserver(mockCallback, mockOptions));

    // 調用返回的 ref callback 函數
    result.current(mockNode);

    // 驗證 IntersectionObserver 被建立
    expect(mockIntersectionObserver).toHaveBeenCalledWith(mockCallback, mockOptions);

    // 驗證 observe 方法被調用
    expect(mockIntersectionObserver.mock.results[0].value.observe).toHaveBeenCalledWith(mockNode);
  });

  test('當提供 null 節點時，應該斷開 observer 連接', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };
    const mockNode = document.createElement('div');
    const mockDisconnect = jest.fn();

    // 模擬 observer.current
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      disconnect: mockDisconnect,
      unobserve: jest.fn()
    });

    // 渲染 hook
    const { result, rerender } = renderHook(() => useObserver(mockCallback, mockOptions));

    // 首先觀察一個節點
    result.current(mockNode);

    // 然後提供 null 節點
    result.current(null);

    // 驗證 disconnect 方法被調用
    expect(mockDisconnect).toHaveBeenCalled();
  });

  test('應該在 callback 或 options 變更時重新建立 ref callback', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const mockOptions1 = { rootMargin: '10px', threshold: 0.5 };
    const mockOptions2 = { rootMargin: '20px', threshold: 0.8 };

    // 渲染 hook 並重新渲染
    const { result, rerender } = renderHook(
      ({ callback, options }) => useObserver(callback, options),
      {
        initialProps: { callback: mockCallback1, options: mockOptions1 }
      }
    );

    // 保存第一個 ref callback
    const firstRefCallback = result.current;

    // 重新渲染 hook，但使用相同的 props
    rerender({ callback: mockCallback1, options: mockOptions1 });

    // 驗證 ref callback 沒有變更
    expect(result.current).toBe(firstRefCallback);

    // 重新渲染 hook，但使用不同的 callback
    rerender({ callback: mockCallback2, options: mockOptions1 });

    // 驗證 ref callback 已變更
    expect(result.current).not.toBe(firstRefCallback);

    // 保存新的 ref callback
    const secondRefCallback = result.current;

    // 重新渲染 hook，但使用不同的 options
    rerender({ callback: mockCallback2, options: mockOptions2 });

    // 驗證 ref callback 已再次變更
    expect(result.current).not.toBe(secondRefCallback);
  });

  test('在實際元件中使用', () => {
    const mockCallback = jest.fn();
    const mockOptions = { rootMargin: '10px', threshold: 0.5 };

    // 建立一個使用 useObserver 的測試元件
    const TestComponent = () => {
      const ref = useObserver(mockCallback, mockOptions);
      return <div ref={ref} data-testid="observed-element">觀察元素</div>;
    };

    // 渲染測試元件
    const { getByTestId } = render(<TestComponent />);
    const observedElement = getByTestId('observed-element');

    // 驗證 IntersectionObserver 被建立
    expect(mockIntersectionObserver).toHaveBeenCalledWith(mockCallback, mockOptions);

    // 驗證 observe 方法被調用
    expect(mockIntersectionObserver.mock.results[0].value.observe).toHaveBeenCalledWith(observedElement);
  });
});
