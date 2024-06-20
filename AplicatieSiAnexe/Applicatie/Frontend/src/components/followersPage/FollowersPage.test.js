import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import FollowersPage from './FollowersPage';

describe('FollowersPage', () => {
  it('renders without crashing', () => {
    render(<FollowersPage />, { wrapper: BrowserRouter });
  });

  it('displays followers data correctly', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ followers: [1, 2], following: [3] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ username: 'user1', email: 'user1@example.com', id: 1, following: true })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ username: 'user2', email: 'user2@example.com', id: 2, following: false })
      });

    const { getByText } = render(<FollowersPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(getByText('user1')).toBeInTheDocument();
      expect(getByText('user1@example.com')).toBeInTheDocument();
      expect(getByText('user2')).toBeInTheDocument();
      expect(getByText('user2@example.com')).toBeInTheDocument();
    });
  });

  it('calls handleButtonClick when follow/unfollow button is clicked', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ followers: [1], following: [2] }) 
      })
      .mockResolvedValueOnce({
        ok: true
      });

    const handleButtonClickMock = jest.fn();

    const { getByText } = render(<FollowersPage handleButtonClick={handleButtonClickMock} />, { wrapper: BrowserRouter });

    await waitFor(() => {
      fireEvent.click(getByText('Follow'));
    });

    expect(handleButtonClickMock).toHaveBeenCalledTimes(1);
  });
});
