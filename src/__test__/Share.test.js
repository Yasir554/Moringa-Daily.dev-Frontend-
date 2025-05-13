import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Share from '../Share';

global.fetch = jest.fn();

describe('Share Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders share section heading', () => {
    render(<Share />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Shared Content/i);
  });

  test('fetches and displays shared items', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'Article 1', type: 'post', url: 'https://example.com/article1' },
        { id: 2, title: 'Image 1', type: 'image', url: 'https://example.com/image1.jpg' },
      ],
    });

    render(<Share />);

    await waitFor(() => expect(screen.getByText('Article 1')).toBeInTheDocument());
    expect(screen.getByText('Image 1')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Share />);

    await waitFor(() => expect(screen.getByText(/Failed to load shared content/i)).toBeInTheDocument());
  });

  test('triggers share action when button is clicked', () => {
    const mockOnShare = jest.fn();

    render(<Share onShare={mockOnShare} />);

    const shareButton = screen.getByRole('button', { name: /Share/i });
    fireEvent.click(shareButton);

    expect(mockOnShare).toHaveBeenCalled();
  });
});
