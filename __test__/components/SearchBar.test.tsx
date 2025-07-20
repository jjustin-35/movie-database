import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  const mockProps = {
    onSubmit: jest.fn((query: string) => { console.log(query); }),
    placeholder: '搜尋電影...',
    query: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render search bar correctly', () => {
    render(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    expect(searchInput).toBeInTheDocument();
  });

  test('should update input value after text entry', () => {
    render(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    fireEvent.change(searchInput, { target: { value: 'test movie' } });
    
    expect(searchInput).toHaveValue('test movie');
  });

  test('should call onSubmit function when form is submitted', async () => {
    render(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    const form = searchInput.closest('form');
    
    fireEvent.change(searchInput, { target: { value: 'test movie' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith('test movie');
    });
  });

  test('should not call onSubmit function when searching empty string', async () => {
    render(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    
    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });
  });

  test('should display clear button when search text exists', () => {
    render(<SearchBar {...mockProps} />);
    
    expect(screen.queryByTitle('清除搜尋')).not.toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    fireEvent.change(searchInput, { target: { value: 'test movie' } });
    
    expect(screen.getByTitle('清除搜尋')).toBeInTheDocument();
  });

  test('should clear input and not call onSubmit when clear button is clicked and input is not submitted', () => {
    render(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    
    fireEvent.change(searchInput, { target: { value: 'test movie' } });
    
    const clearButton = screen.getByTitle('清除搜尋');
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  test('should clear input and submit empty string when clear button is clicked and input is submitted', async () => {
    const { rerender } = render(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    const form = searchInput.closest('form');
    const query = 'test movie';

    fireEvent.change(searchInput, { target: { value: query } });
    fireEvent.submit(form);

    rerender(<SearchBar {...mockProps} query={query} />);
    
    const clearButton = screen.getByTitle('清除搜尋');
    fireEvent.click(clearButton);
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });

    expect(mockProps.onSubmit).toHaveBeenCalledWith('');
  });
});
