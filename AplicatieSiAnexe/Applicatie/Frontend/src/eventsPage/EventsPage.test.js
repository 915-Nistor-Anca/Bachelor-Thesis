import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import EventsPage from './EventsPage';

describe('EventsPage', () => {
  it('renders without crashing', () => {
    render(<EventsPage />, { wrapper: BrowserRouter });
  });

  it('displays events', async () => {
    const mockEvents = [
      { id: 1, title: 'Event 1', start_time: '2024-06-10T08:00:00Z', description: 'Description 1' },
      { id: 2, title: 'Event 2', start_time: '2024-06-11T10:00:00Z', description: 'Description 2' },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const { getByText } = render(<EventsPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(getByText('Event 1')).toBeInTheDocument();
      expect(getByText('Event 2')).toBeInTheDocument();
    });
  });

  it('navigates to event details page when event title is clicked', async () => {
    const mockEvents = [
      { id: 1, title: 'Event 1', start_time: '2024-06-10T08:00:00Z', description: 'Description 1' },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const { getByText } = render(<EventsPage />, { wrapper: BrowserRouter });

    fireEvent.click(getByText('Event 1'));

  });
});
