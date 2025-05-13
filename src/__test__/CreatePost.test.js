import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatePost from '../CreatePost';

global.fetch = jest.fn();

describe('CreatePost Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders Create Post heading', () => {
    render(<CreatePost />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Create a New Post/i);
  });

  test('contains input fields for title and content', () => {
    render(<CreatePost />);
    expect(screen.getByPlaceholderText(/Enter post title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write your post here/i)).toBeInTheDocument();
  });

  test('handles post submission correctly', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<CreatePost />);

    fireEvent.change(screen.getByPlaceholderText(/Enter post title/i), { target: { value: 'My First Post' } });
    fireEvent.change(screen.getByPlaceholderText(/Write your post here/i), { target: { value: 'This is my content' } });

    const submitButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(/Post submitted successfully/i)).toBeInTheDocument());
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<CreatePost />);

    fireEvent.change(screen.getByPlaceholderText(/Enter post title/i), { target: { value: 'Test Post' } });
    fireEvent.change(screen.getByPlaceholderText(/Write your post here/i), { target: { value: 'Content goes here' } });

    const submitButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(/Failed to create post/i)).toBeInTheDocument());
  });
});
