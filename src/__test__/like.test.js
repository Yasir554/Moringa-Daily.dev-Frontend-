import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Like from '../Like';

global.fetch = jest.fn();

describe('Like Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders like button and count', () => {
    render(<Like initialLikes={10} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Like/i })).toBeInTheDocument();
  });

  test('increments like count on button click', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<Like initialLikes={10} />);

    const likeButton = screen.getByRole('button', { name: /Like/i });
    fireEvent.click(likeButton);

    await waitFor(() => expect(screen.getByText('11')).toBeInTheDocument());
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Like initialLikes={10} />);

    const likeButton = screen.getByRole('button', { name: /Like/i });
    fireEvent.click(likeButton);

    await waitFor(() => expect(screen.getByText(/Failed to like post/i)).toBeInTheDocument());
  });
});
