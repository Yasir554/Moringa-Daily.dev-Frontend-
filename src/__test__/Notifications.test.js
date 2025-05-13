import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notification from '../Notification';

global.fetch = jest.fn();

describe('Notification Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders notification section heading', () => {
    render(<Notification />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Notifications/i);
  });

  test('fetches and displays notifications', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, message: 'New message received', read: false },
        { id: 2, message: 'Your post has been liked', read: true },
      ],
    });

    render(<Notification />);

    await waitFor(() => expect(screen.getByText('New message received')).toBeInTheDocument());
    expect(screen.getByText('Your post has been liked')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Notification />);

    await waitFor(() => expect(screen.getByText(/Failed to load notifications/i)).toBeInTheDocument());
  });

  test('dismisses a notification when button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, message: 'New message received', read: false },
      ],
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<Notification />);

    await waitFor(() => expect(screen.getByText('New message received')).toBeInTheDocument());

    const dismissButton = screen.getByRole('button', { name: /Dismiss/i });
    fireEvent.click(dismissButton);

    await waitFor(() => expect(screen.queryByText('New message received')).not.toBeInTheDocument());
  });
});
