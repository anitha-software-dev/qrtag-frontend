import { render, screen } from '@testing-library/react';
import App from './App';

test('renders QRTag Generator link', () => {
  render(<App />);
  const linkElement = screen.getByText(/QR Tag Generator/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders UUID Generator link', () => {
  render(<App />);
  const linkElement = screen.getByText(/UUID Generator/i);
  expect(linkElement).toBeInTheDocument();
});
