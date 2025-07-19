import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../context/toastContext';

// 模擬計時器
jest.useFakeTimers();

// 測試用元件
const TestComponent = () => {
  const { toast, openToast } = useToast();
  
  return (
    <div>
      {toast && (
        <div data-testid="toast" className={`toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <button 
        data-testid="show-success"
        onClick={() => openToast({ message: '成功訊息', type: 'success' })}
      >
        顯示成功訊息
      </button>
      <button 
        data-testid="show-error"
        onClick={() => openToast({ message: '錯誤訊息', type: 'error' })}
      >
        顯示錯誤訊息
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('初始狀態應為無訊息', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  test('應該能夠顯示成功訊息', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // 顯示成功訊息
    act(() => {
      screen.getByTestId('show-success').click();
    });

    // 確認訊息已顯示
    const toast = screen.getByTestId('toast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('toast-success');
    expect(toast).toHaveTextContent('成功訊息');
  });

  test('應該能夠顯示錯誤訊息', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // 顯示錯誤訊息
    act(() => {
      screen.getByTestId('show-error').click();
    });

    // 確認訊息已顯示
    const toast = screen.getByTestId('toast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('toast-error');
    expect(toast).toHaveTextContent('錯誤訊息');
  });

  test('訊息應在 3 秒後自動消失', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // 顯示訊息
    act(() => {
      screen.getByTestId('show-success').click();
    });

    // 確認訊息已顯示
    expect(screen.getByTestId('toast')).toBeInTheDocument();

    // 快轉時間 3 秒
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // 確認訊息已消失
    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  test('顯示新訊息應取代舊訊息', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // 顯示成功訊息
    act(() => {
      screen.getByTestId('show-success').click();
    });

    // 確認成功訊息已顯示
    expect(screen.getByTestId('toast')).toHaveTextContent('成功訊息');
    expect(screen.getByTestId('toast')).toHaveClass('toast-success');

    // 顯示錯誤訊息
    act(() => {
      screen.getByTestId('show-error').click();
    });

    // 確認錯誤訊息已取代成功訊息
    expect(screen.getByTestId('toast')).toHaveTextContent('錯誤訊息');
    expect(screen.getByTestId('toast')).toHaveClass('toast-error');
  });

  test('useToast 在 Provider 外使用時應拋出錯誤', () => {
    // 模擬 console.error 以避免測試輸出中出現錯誤訊息
    const originalError = console.error;
    console.error = jest.fn();
    
    // 預期 useToast 在 Provider 外使用時會拋出錯誤
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');
    
    // 恢復 console.error
    console.error = originalError;
  });
});
