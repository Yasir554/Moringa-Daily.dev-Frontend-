import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from '../Comment';

global.fetch = jest.fn();

describe('Comment Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders comment section heading', () => {
    render(<Comment />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Comments/i);
  });

  test('fetches and displays comments', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, user: 'Alice', text: 'Great post!' },
        { id: 2, user: 'Bob', text: 'Thanks for sharing!' },
      ],
    });

    render(<Comment />);
    
    await waitFor(() => expect(screen.getByText('Great post!')).toBeInTheDocument());
    expect(screen.getByText('Thanks for sharing!')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Comment />);

    await waitFor(() => expect(screen.getByText(/Failed to load comments/i)).toBeInTheDocument());
  });

  test('submits a new comment successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, user: 'Alice', text: 'Great post!' },
      ],
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<Comment />);

    const inputField = screen.getByPlaceholderText(/Write a comment/i);
    fireEvent.change(inputField, { target: { value: 'Nice article!' } });

    const submitButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText('Nice article!')).toBeInTheDocument());
  });
});
