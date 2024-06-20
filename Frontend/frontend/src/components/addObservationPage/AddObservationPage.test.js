import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddObservationPage from './AddObservationPage';

describe('AddObservationPage', () => {
  it('fetches equipment options and sky conditions options on mount', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => [{ name: 'Telescope' }, { name: 'Binoculars' }],
    }).mockResolvedValueOnce({
      ok: true,
      json: () => [{ name: 'Clear' }, { name: 'Cloudy' }],
    });

    const { getByLabelText } = render(<AddObservationPage />);

    await waitFor(() => expect(getByLabelText('Equipment:')).toHaveTextContent('Telescope'));
    await waitFor(() => expect(getByLabelText('Sky Conditions:')).toHaveTextContent('Clear'));
  });

  it('submits observation form with valid data', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });

    const { getByLabelText, getByText } = render(<AddObservationPage />);

    fireEvent.change(getByLabelText('Targets:'), { target: { value: 'Moon' } });
    fireEvent.change(getByLabelText('Observation Time:'), { target: { value: '2024-06-01T12:00:00' } });
    fireEvent.change(getByLabelText('Personal Observations:'), { target: { value: 'Clear view of the moon' } });
    fireEvent.click(getByLabelText('Privacy:'));

    fireEvent.click(getByText('Submit'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });
});
