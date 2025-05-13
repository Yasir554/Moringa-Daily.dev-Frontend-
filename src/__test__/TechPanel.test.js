import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechPanel from '../TechPanel';

global.fetch = jest.fn();

describe('TechPanel Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders TechPanel heading', () => {
    render(<TechPanel />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Technology Dashboard/i);
  });

  test('fetches and displays tech-related statistics', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'AI Growth', value: '20% Increase' },
        { id: 2, title: 'Cloud Adoption', value: '35% Market Share' },
      ],
    });

    render(<TechPanel />);

    await waitFor(() => expect(screen.getByText('AI Growth')).toBeInTheDocument());
    expect(screen.getByText('Cloud Adoption')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<TechPanel />);

    await waitFor(() => expect(screen.getByText(/Failed to load technology data/i)).toBeInTheDocument());
  });

  test('navigates to a detailed stats page when clicked', () => {
    const mockOnNavigate = jest.fn();

    render(<TechPanel onNavigate={mockOnNavigate} />);

    const statTitle = screen.getByText('AI Growth');
    fireEvent.click(statTitle);

    expect(mockOnNavigate).toHaveBeenCalledWith('/stats/1');
  });
});
