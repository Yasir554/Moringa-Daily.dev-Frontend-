import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPanel from '../AdminPanel';

global.fetch = jest.fn();

describe('AdminPanel Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders AdminPanel with dashboard heading', () => {
    render(<AdminPanel />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Admin Panel/i);
  });

  test('displays user management section', () => {
    render(<AdminPanel />);
    expect(screen.getByText(/Manage Users/i)).toBeInTheDocument();
  });

  test('checks presence of system logs section', () => {
    render(<AdminPanel />);
    expect(screen.getByText(/System Logs/i)).toBeInTheDocument();
  });

  test('handles navigation between admin sections', () => {
    render(<AdminPanel />);
    const analyticsTab = screen.getByText(/Analytics/i);
    fireEvent.click(analyticsTab);
    expect(screen.getByText(/Admin Analytics Overview/i)).toBeInTheDocument();
  });

  test('fetches and displays list of users', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, username: 'adminUser', role: 'admin' }],
    });

    render(<AdminPanel />);
    
    await waitFor(() => expect(screen.getByText('adminUser')).toBeInTheDocument());
    expect(screen.getByText(/Role: admin/i)).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<AdminPanel />);

    await waitFor(() => expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument());
  });

  test('allows admin to deactivate a user', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, username: 'testUser', role: 'user', active: true }],
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<AdminPanel />);

    await waitFor(() => expect(screen.getByText('testUser')).toBeInTheDocument());

    const deactivateButton = screen.getByRole('button', { name: /Deactivate/i });
    fireEvent.click(deactivateButton);

    await waitFor(() => expect(screen.getByText(/Deactivated/i)).toBeInTheDocument());
  });

  test('verifies admin logout button functionality', () => {
    render(<AdminPanel />);
    const logoutButton = screen.getByRole('button', { name: /Logout/i });

    fireEvent.click(logoutButton);
    expect(screen.getByText(/Logging out.../i)).toBeInTheDocument();
  });
});
