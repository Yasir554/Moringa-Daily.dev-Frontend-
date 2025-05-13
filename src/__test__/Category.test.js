import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Category from '../Category';

global.fetch = jest.fn();

describe('Category Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders category heading', () => {
    render(<Category />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Categories/i);
  });

  test('fetches and displays categories', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Health' },
        { id: 3, name: 'Education' },
      ],
    });

    render(<Category />);
    
    await waitFor(() => expect(screen.getByText('Technology')).toBeInTheDocument());
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Category />);

    await waitFor(() => expect(screen.getByText(/Failed to load categories/i)).toBeInTheDocument());
  });

  test('triggers event when category is clicked', () => {
    const mockOnCategorySelect = jest.fn();

    render(<Category onCategorySelect={mockOnCategorySelect} />);

    const categoryItem = screen.getByText('Technology');
    fireEvent.click(categoryItem);

    expect(mockOnCategorySelect).toHaveBeenCalledWith('Technology');
  });
});
