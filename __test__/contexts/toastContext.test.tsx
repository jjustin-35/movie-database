import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/context/toastContext';
import Toast from '@/components/Toast';

// Mock timer
jest.useFakeTimers();

const TestToast = () => {
  const { openToast } = useToast();
  return (
    <>
      <Toast />
      <button onClick={() => openToast({ message: 'success message', type: 'success' })}>Open Toast</button>
      <button onClick={() => openToast({ message: 'error message', type: 'error' })}>Open Error Toast</button>
    </>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state should be no message', () => {
    render(
      <ToastProvider>
        <TestToast />
      </ToastProvider>
    );

    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  test('should be able to display success message', () => {
    render(
      <ToastProvider>
        <TestToast />
      </ToastProvider>
    );

    const openToast = screen.getByText('Open Toast');

    act(() => {
      openToast.click();
    });

    const toast = screen.getByTestId('toast-success');
    expect(toast).toHaveTextContent('success message');
  });

  test('should be able to display error message', () => {
    render(
      <ToastProvider>
        <TestToast />
      </ToastProvider>
    );

    const openToast = screen.getByText('Open Error Toast');

    act(() => {
      openToast.click();
    });

    const toast = screen.getByTestId('toast-error');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('error message');
  });

  test('message should automatically disappear after 3 seconds', () => {
    render(
      <ToastProvider>
        <TestToast />
      </ToastProvider>
    );

    const openToast = screen.getByText('Open Toast');

    act(() => {
      openToast.click();
    });

    expect(screen.getByTestId('toast')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Verify message has disappeared
    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  test('displaying new message should replace old message', () => {
    render(
      <ToastProvider>
        <TestToast />
      </ToastProvider>
    );

    const openToast = screen.getByText('Open Toast');

    act(() => {
      openToast.click();
    });

    expect(screen.getByTestId('toast-success')).toHaveTextContent('success message');

    const openErrorToast = screen.getByText('Open Error Toast');
    act(() => {
      openErrorToast.click();
    });

    expect(screen.getByTestId('toast-error')).toHaveTextContent('error message');
  });
});
