import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from '../Signup';

global.fetch = jest.fn();

describe('Signup Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders signup form', () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('handles user input correctly', () => {
    render(<Signup />);
    
    const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
    fireEvent.change(usernameInput, { target: { value: 'newUser' } });

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    fireEvent.change(passwordInput, { target: { value: 'securepassword' } });

    expect(usernameInput.value).toBe('newUser');
    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('securepassword');
  });

  test('submits signup request successfully', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Signup successful' }) });

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'newUser' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'securepassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => expect(screen.getByText(/Signup successful/i)).toBeInTheDocument());
  });

  test('handles signup failure properly', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'newUser' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'short' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => expect(screen.getByText(/Signup failed/i)).toBeInTheDocument());
  });
});
