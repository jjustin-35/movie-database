import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    placeholder: '搜尋電影...',
    query: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render search bar correctly', () => {
    render(<SearchBar {...mockProps} />);
    
    // Verify search input exists
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    expect(searchInput).toBeInTheDocument();
    
    // Verify search button exists
    const searchButton = screen.getByRole('button', { name: /搜尋/i });
    expect(searchButton).toBeInTheDocument();
  });

  test('should update input value after text entry', () => {
    render(<SearchBar {...mockProps} />);
    
    // Get search input
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    
    // Enter text
    fireEvent.change(searchInput, { target: { value: '測試電影' } });
    
    // Verify input value has been updated
    expect(searchInput).toHaveValue('測試電影');
  });

  test('should call onSubmit function when form is submitted', async () => {
    render(<SearchBar {...mockProps} />);
    
    // Get search input and form
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    const form = searchInput.closest('form');
    
    // Enter text
    fireEvent.change(searchInput, { target: { value: '測試電影' } });
    
    // Submit form
    fireEvent.submit(form);
    
    // Verify onSubmit was called
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith('測試電影');
    });
  });

  test('should call onSubmit function when Enter key is pressed', async () => {
    render(<SearchBar {...mockProps} />);
    
    // Get search input and form
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    const form = searchInput.closest('form');
    
    // Enter text
    fireEvent.change(searchInput, { target: { value: '測試電影' } });
    
    // Simulate form submission (Enter key triggers form submission)
    fireEvent.submit(form);
    
    // Verify onSubmit was called
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith('測試電影');
    });
  });

  test('should not call onSearch function when searching empty string', () => {
    render(<SearchBar {...mockProps} />);
    
    // Get search button
    const searchButton = screen.getByRole('button', { name: /搜尋/i });
    
    // Click search button (input is empty)
    fireEvent.click(searchButton);
    
    // Verify onSearch was not called
    expect(mockProps.onSearch).not.toHaveBeenCalled();
  });

  test('should display clear button when search text exists', () => {
    render(<SearchBar {...mockProps} />);
    
    // Clear button should not be displayed initially
    expect(screen.queryByTitle('清除搜尋')).not.toBeInTheDocument();
    
    // Get search input
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    
    // Enter text
    fireEvent.change(searchInput, { target: { value: '測試電影' } });
    
    // Verify clear button is displayed
    expect(screen.getByTitle('清除搜尋')).toBeInTheDocument();
  });

  test('should clear input and call onClear function when clear button is clicked', () => {
    render(<SearchBar {...mockProps} />);
    
    // Get search input
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    
    // Enter text
    fireEvent.change(searchInput, { target: { value: '測試電影' } });
    
    // Click clear button
    const clearButton = screen.getByTitle('清除搜尋');
    fireEvent.click(clearButton);
    
    // Verify input is cleared
    expect(searchInput).toHaveValue('');
    
    // Verify onClear was called
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  test('should keep input focused after search', async () => {
    render(<SearchBar {...mockProps} />);
    
    // Get search input and button
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    const searchButton = screen.getByRole('button', { name: /搜尋/i });
    
    // Enter text
    fireEvent.change(searchInput, { target: { value: '測試電影' } });
    
    // Click search button
    fireEvent.click(searchButton);
    
    // Verify input remains focused
    await waitFor(() => {
      expect(document.activeElement).toBe(searchInput);
    });
  });

  test('should handle initial search value correctly', () => {
    // Render with initial search value
    render(<SearchBar {...mockProps} initialSearchValue="初始搜尋" />);
    
    // Verify input's initial value
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    expect(searchInput).toHaveValue('初始搜尋');
    
    // Verify clear button is displayed
    expect(screen.getByTitle('清除搜尋')).toBeInTheDocument();
  });

  test('should not call onSearch function when Enter key is pressed with empty input', () => {
    render(<SearchBar {...mockProps} />);
    
    // Get search input
    const searchInput = screen.getByPlaceholderText('搜尋電影...');
    
    // Press Enter key (input is empty)
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    // Verify onSearch was not called
    expect(mockProps.onSearch).not.toHaveBeenCalled();
  });
});
