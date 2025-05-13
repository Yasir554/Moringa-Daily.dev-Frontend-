import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminProfile from '../AdminProfile';

global.fetch = jest.fn();

describe('AdminProfile Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders AdminProfile with heading', () => {
    render(<AdminProfile />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Admin Profile/i);
  });

  test('displays admin details', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, username: 'adminUser', email: 'admin@example.com' }),
    });

    render(<AdminProfile />);
    
    await waitFor(() => expect(screen.getByText('adminUser')).toBeInTheDocument());
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<AdminProfile />);

    await waitFor(() => expect(screen.getByText(/Failed to fetch profile/i)).toBeInTheDocument());
  });

  test('updates profile when edit button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, username: 'adminUser', email: 'admin@example.com' }),
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<AdminProfile />);

    await waitFor(() => expect(screen.getByText('adminUser')).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editButton);

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'UpdatedAdmin' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => expect(screen.getByText('UpdatedAdmin')).toBeInTheDocument());
  });
});
