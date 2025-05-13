import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../UserProfile';

global.fetch = jest.fn();

describe('UserProfile Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders UserProfile heading', () => {
    render(<UserProfile />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/User Profile/i);
  });

  test('fetches and displays user profile details', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, username: 'testUser', email: 'user@example.com' }),
    });

    render(<UserProfile />);

    await waitFor(() => expect(screen.getByText('testUser')).toBeInTheDocument());
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<UserProfile />);

    await waitFor(() => expect(screen.getByText(/Failed to load profile/i)).toBeInTheDocument());
  });

  test('updates profile information when save button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, username: 'testUser', email: 'user@example.com' }),
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<UserProfile />);

    await waitFor(() => expect(screen.getByText('testUser')).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editButton);

    const usernameInput = screen.getByPlaceholderText(/Enter new username/i);
    fireEvent.change(usernameInput, { target: { value: 'UpdatedUser' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => expect(screen.getByText('UpdatedUser')).toBeInTheDocument());
  });
});
