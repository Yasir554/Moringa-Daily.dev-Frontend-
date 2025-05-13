import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminHome from '../AdminHome';

describe('AdminHome Component', () => {
  test('renders AdminHome heading', () => {
    render(<AdminHome />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Admin Dashboard/i);
  });

  test('displays user management section', () => {
    render(<AdminHome />);
    expect(screen.getByText(/Manage Users/i)).toBeInTheDocument();
  });

  test('checks presence of analytics section', () => {
    render(<AdminHome />);
    expect(screen.getByText(/Analytics Overview/i)).toBeInTheDocument();
  });

  test('verifies if logout button exists', () => {
    render(<AdminHome />);
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('handles logout button click', () => {
    render(<AdminHome />);
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    expect(screen.getByText(/Logging out.../i)).toBeInTheDocument(); // Assuming logout displays a message
  });
});
