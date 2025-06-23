import { render, screen } from '@testing-library/react';
import App from './App';

test('renders bottom navigation', () => {
  render(<App />);
  const homeButton = screen.getByText(/Home/i);
  expect(homeButton).toBeInTheDocument();
});
