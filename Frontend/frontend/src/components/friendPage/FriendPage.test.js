import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import FriendPage from './FriendPage';

describe('FriendPage', () => {
  it('renders without crashing', () => {
    render(<FriendPage />, { wrapper: BrowserRouter });
  });

  it('displays user data correctly', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ username: 'testuser', email: 'testuser@example.com', id: 1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ([{ id: 1, privacy: 0, targets: 'Test target', location: 'Test location', observation_time: 'Test time', sky_conditions: 1, equipment: [1], personal_observations: 'Test observations' }])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ 1: 'Clear' }) 
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ 1: 'Telescope' }) 
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ followers: ['follower1', 'follower2'] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ following: ['following1', 'following2'] })
      });

    const { getByText } = render(<FriendPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(getByText('testuser')).toBeInTheDocument();
      expect(getByText('testuser@example.com')).toBeInTheDocument();
      expect(getByText('Targets: Test target')).toBeInTheDocument();
      expect(getByText('Location: Test location')).toBeInTheDocument();
      expect(getByText('Observation Time: Test time')).toBeInTheDocument();
      expect(getByText('Sky Conditions: Clear')).toBeInTheDocument();
      expect(getByText('Equipment: Telescope')).toBeInTheDocument();
      expect(getByText('Personal Observations: Test observations')).toBeInTheDocument();
      expect(getByText('Statistics')).toBeInTheDocument();
      expect(getByText('Statistics').nextSibling.textContent).toContain('Number of observations: 1');
      expect(getByText('Statistics').nextSibling.textContent).toContain('Followers: 2');
      expect(getByText('Statistics').nextSibling.textContent).toContain('Following: 2');
    });
  });

});
