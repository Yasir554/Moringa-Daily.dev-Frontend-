import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminTechNavbar from '../AdminTechNavbar';
import { MemoryRouter } from 'react-router-dom';

describe('AdminTechNavbar Component', () => {
  test('renders the navbar with correct title', () => {
    render(
      <MemoryRouter>
        <AdminTechNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin Tech Dashboard/i)).toBeInTheDocument();
  });

  test('contains navigation links', () => {
    render(
      <MemoryRouter>
        <AdminTechNavbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Analytics/i })).toBeInTheDocument();
  });

  test('handles navigation clicks correctly', () => {
    render(
      <MemoryRouter>
        <AdminTechNavbar />
      </MemoryRouter>
    );

    const usersLink = screen.getByRole('link', { name: /Users/i });
    fireEvent.click(usersLink);

    expect(window.location.pathname).toBe('/admin/users'); // Mocking the expected path
  });

  test('renders logout button and handles click event', () => {
    render(
      <MemoryRouter>
        <AdminTechNavbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(screen.getByText(/Logging out.../i)).toBeInTheDocument(); // Assuming logout shows a message
  });
});
