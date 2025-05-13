import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Wishlist from '../Wishlist';

global.fetch = jest.fn();

describe('Wishlist Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders Wishlist heading', () => {
    render(<Wishlist />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/My Wishlist/i);
  });

  test('fetches and displays wishlist items', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Item 1', price: '$100' },
        { id: 2, name: 'Item 2', price: '$200' },
      ],
    });

    render(<Wishlist />);

    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Wishlist />);

    await waitFor(() => expect(screen.getByText(/Failed to load wishlist/i)).toBeInTheDocument());
  });

  test('removes an item from wishlist when button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'Item 1', price: '$100' }],
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<Wishlist />);

    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());

    const removeButton = screen.getByRole('button', { name: /Remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => expect(screen.queryByText('Item 1')).not.toBeInTheDocument());
  });
});
