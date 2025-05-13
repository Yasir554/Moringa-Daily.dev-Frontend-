import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeactivateUsers from '../DeactivateUsers';

global.fetch = jest.fn();

describe('DeactivateUsers Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the component and fetches users', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, email: 'user1@example.com', role: 'admin', active: true },
        { id: 2, email: 'user2@example.com', role: 'user', active: true },
      ],
    });

    render(<DeactivateUsers />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<DeactivateUsers />);

    await waitFor(() => expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument());
  });

  test('deactivates a user when button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, email: 'user1@example.com', role: 'admin', active: true },
      ],
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<DeactivateUsers />);

    await waitFor(() => expect(screen.getByText('user1@example.com')).toBeInTheDocument());

    const deactivateButton = screen.getByText('Deactivate');
    fireEvent.click(deactivateButton);

    await waitFor(() => expect(deactivateButton).not.toBeInTheDocument());
    expect(screen.getByText(/Deactivated/i)).toBeInTheDocument();
  });
});
