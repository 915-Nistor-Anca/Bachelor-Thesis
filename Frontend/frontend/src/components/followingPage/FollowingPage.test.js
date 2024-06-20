import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import FollowingPage from './FollowingPage';

describe('FollowingPage', () => {
  it('renders without crashing', () => {
    render(<FollowingPage />, { wrapper: BrowserRouter });
  });

  it('displays following data correctly', async () => {
    // Mock fetch requests and return dummy data
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ following: [1, 2] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ username: 'user1', email: 'user1@example.com', id: 1, following: true })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ username: 'user2', email: 'user2@example.com', id: 2, following: false })
      });

    const { getByText } = render(<FollowingPage />, { wrapper: BrowserRouter });

    // Wait for fetch requests to complete
    await waitFor(() => {
      expect(getByText('user1')).toBeInTheDocument();
      expect(getByText('user1@example.com')).toBeInTheDocument();
      expect(getByText('user2')).toBeInTheDocument();
      expect(getByText('user2@example.com')).toBeInTheDocument();
    });
  });

  it('calls handleButtonClick when follow/unfollow button is clicked', async () => {
    // Mock fetch requests and return dummy data
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ following: [1], followers: [] }) // Simulate user already following another user
      })
      .mockResolvedValueOnce({
        ok: true
      });

    const handleButtonClickMock = jest.fn();

    const { getByText } = render(<FollowingPage handleButtonClick={handleButtonClickMock} />, { wrapper: BrowserRouter });

    // Wait for fetch requests to complete
    await waitFor(() => {
      fireEvent.click(getByText('Follow'));
    });

    expect(handleButtonClickMock).toHaveBeenCalledTimes(1);
  });
});
