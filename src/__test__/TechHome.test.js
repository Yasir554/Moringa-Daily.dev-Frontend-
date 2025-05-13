import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechHome from '../TechHome';

global.fetch = jest.fn();

describe('TechHome Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders TechHome heading', () => {
    render(<TechHome />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Technology News/i);
  });

  test('fetches and displays tech-related posts', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'AI Revolution', content: 'Exploring AI advancements' },
        { id: 2, title: 'Quantum Computing', content: 'The future of quantum tech' },
      ],
    });

    render(<TechHome />);

    await waitFor(() => expect(screen.getByText('AI Revolution')).toBeInTheDocument());
    expect(screen.getByText('Quantum Computing')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<TechHome />);

    await waitFor(() => expect(screen.getByText(/Failed to load technology news/i)).toBeInTheDocument());
  });

  test('navigates to a post details page when clicked', () => {
    const mockOnNavigate = jest.fn();

    render(<TechHome onNavigate={mockOnNavigate} />);

    const postTitle = screen.getByText('AI Revolution');
    fireEvent.click(postTitle);

    expect(mockOnNavigate).toHaveBeenCalledWith('/post/1');
  });
});
