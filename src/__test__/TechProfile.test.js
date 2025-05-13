import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechProfile from '../TechProfile';

global.fetch = jest.fn();

describe('TechProfile Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders TechProfile heading', () => {
    render(<TechProfile />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Tech Profile/i);
  });

  test('fetches and displays tech profile details', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, username: 'techUser', skills: ['React', 'Node.js', 'AWS'] }),
    });

    render(<TechProfile />);

    await waitFor(() => expect(screen.getByText('techUser')).toBeInTheDocument());
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<TechProfile />);

    await waitFor(() => expect(screen.getByText(/Failed to load profile/i)).toBeInTheDocument());
  });

  test('updates profile information when save button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, username: 'techUser', skills: ['React', 'Node.js'] }),
    });

    fetch.mockResolvedValueOnce({ ok: true });

    render(<TechProfile />);

    await waitFor(() => expect(screen.getByText('React')).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editButton);

    const skillsInput = screen.getByPlaceholderText(/Add a skill/i);
    fireEvent.change(skillsInput, { target: { value: 'Docker' } });

    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);

    await waitFor(() => expect(screen.getByText('Docker')).toBeInTheDocument());
  });
});
