import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';

global.fetch = jest.fn();

describe('Login Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('handles user input correctly', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    fireEvent.change(passwordInput, { target: { value: 'securepassword' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('securepassword');
  });

  test('submits login request successfully', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'fake-jwt-token' }) });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'securepassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => expect(screen.getByText(/Login successful/i)).toBeInTheDocument());
  });

  test('handles login failure properly', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
  });
});
