import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeBefore from '../HomeBefore';
import { MemoryRouter } from 'react-router-dom';

describe('HomeBefore Component', () => {
  test('renders the welcome heading', () => {
    render(
      <MemoryRouter>
        <HomeBefore />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Welcome to Moringa Daily/i);
  });

  test('displays introductory content', () => {
    render(
      <MemoryRouter>
        <HomeBefore />
      </MemoryRouter>
    );

    expect(screen.getByText(/Stay informed and connected/i)).toBeInTheDocument();
  });

  test('contains navigation buttons', () => {
    render(
      <MemoryRouter>
        <HomeBefore />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  test('handles navigation clicks correctly', () => {
    render(
      <MemoryRouter>
        <HomeBefore />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signUpButton);

    expect(window.location.pathname).toBe('/signup'); // Mock expected path

    const loginButton = screen.getByRole('button', { name: /Log In/i });
    fireEvent.click(loginButton);

    expect(window.location.pathname).toBe('/login');
  });
});
