import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserNavbar from '../UserNavbar';
import { MemoryRouter } from 'react-router-dom';

describe('UserNavbar Component', () => {
  test('renders the navbar with correct title', () => {
    render(
      <MemoryRouter>
        <UserNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
  });

  test('contains navigation links', () => {
    render(
      <MemoryRouter>
        <UserNavbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
  });

  test('handles navigation clicks correctly', () => {
    render(
      <MemoryRouter>
        <UserNavbar />
      </MemoryRouter>
    );

    const profileLink = screen.getByRole('link', { name: /Profile/i });
    fireEvent.click(profileLink);

    expect(window.location.pathname).toBe('/user/profile'); // Mock expected path
  });

  test('renders logout button and handles click event', () => {
    render(
      <MemoryRouter>
        <UserNavbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(screen.getByText(/Logging out.../i)).toBeInTheDocument(); // Assuming logout shows a message
  });
});
