import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../About';

describe('About Page Component', () => {
  test('renders About page heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/About Us/i);
  });

  test('contains the mission statement', () => {
    render(<About />);
    expect(screen.getByText(/Our mission is to provide the best experience/i)).toBeInTheDocument();
  });

  test('checks for the presence of contact section', () => {
    render(<About />);
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });

  test('verifies interactive elements like buttons or links', () => {
    render(<About />);
    const learnMoreButton = screen.getByRole('button', { name: /Learn More/i });
    expect(learnMoreButton).toBeInTheDocument();
  });
});
