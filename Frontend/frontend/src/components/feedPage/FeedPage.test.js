import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import FeedPage from './FeedPage';

describe('FeedPage', () => {
  it('displays loading message while fetching data', () => {
    const { getByText } = render(<FeedPage />, { wrapper: BrowserRouter });
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders feed with last observations', async () => {
    // Mock fetch requests
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => ({
        following: ['user1', 'user2'],
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => ({
        username: 'user1',
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => [
        {
          lastObservation: {
            targets: 'Moon',
            location: 'Earth',
            observation_time: '2024-06-01T12:00:00Z',
            sky_conditions: '1',
            equipment: ['1', '2'],
            personal_observations: 'Clear view',
            privacy: 0,
          },
        },
      ],
    }).mockResolvedValueOnce({
      ok: true,
      json: () => ({
        name: 'Clear',
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => ({
        id: 1,
        name: 'Telescope',
      }),
    });

    const { getByText } = render(<FeedPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(getByText('Targets: Moon')).toBeInTheDocument();
      expect(getByText('Location: Earth')).toBeInTheDocument();
      expect(getByText('Observation Time: 2024-06-01T12:00:00Z')).toBeInTheDocument();
      expect(getByText('Sky Conditions: Clear')).toBeInTheDocument();
      expect(getByText('Equipment: Telescope')).toBeInTheDocument();
      expect(getByText('Personal Observations: Clear view')).toBeInTheDocument();
      expect(getByText('Privacy: Public')).toBeInTheDocument();
    });
  });

  it('redirects to user profile on username click', async () => {
    // Mock fetch requests
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => ({
        following: ['user1'],
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => ({
        username: 'user1',
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => [
        {
          lastObservation: {
            targets: 'Moon',
            location: 'Earth',
            observation_time: '2024-06-01T12:00:00Z',
            sky_conditions: '1',
            equipment: ['1', '2'],
            personal_observations: 'Clear view',
            privacy: 0,
          },
        },
      ],
    }).mockResolvedValueOnce({
      ok: true,
      json: () => ({
        name: 'Clear',
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => ({
        id: 1,
        name: 'Telescope',
      }),
    });

    const { getByText, getByTestId } = render(<FeedPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      fireEvent.click(getByText('user1'));
      expect(getByTestId('user-profile-page')).toBeInTheDocument();
    });
  });
});
