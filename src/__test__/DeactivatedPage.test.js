import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeactivatePage from '../DeactivatePage';

global.fetch = jest.fn();

describe('DeactivatePage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders Deactivate Page heading', () => {
    render(<DeactivatePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Deactivate Users/i);
  });

  test('fetches and displays user list', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, email: 'user1@example.com', active: true },
        { id: 2, email: 'user2@example.com', active: true },
      ],
    });

    render(<DeactivatePage />);

    await waitFor(() => expect(screen.getByText('user1@example.com')).toBeInTheDocument());
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<DeactivatePage />);

    await waitFor(() => expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument());
  });

  test('deactivates a user when button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, email: 'user1@example.com', active: true },
      ],
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<DeactivatePage />);

    await waitFor(() => expect(screen.getByText('user1@example.com')).toBeInTheDocument());

    const deactivateButton = screen.getByRole('button', { name: /Deactivate/i });
    fireEvent.click(deactivateButton);

    await waitFor(() => expect(screen.getByText(/Deactivated/i)).toBeInTheDocument());
  });
});
