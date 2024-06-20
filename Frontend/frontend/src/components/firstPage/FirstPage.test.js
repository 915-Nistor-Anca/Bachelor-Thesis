import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import FirstPage from './FirstPage';

describe('FirstPage', () => {
  it('renders without crashing', () => {
    render(<FirstPage />, { wrapper: BrowserRouter });
  });

  it('displays login and continue buttons', () => {
    const { getByText } = render(<FirstPage />, { wrapper: BrowserRouter });
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Continue Without Account')).toBeInTheDocument();
  });

  it('navigates to login page when login button is clicked', async () => {
    const { getByText } = render(<FirstPage />, { wrapper: BrowserRouter });
    fireEvent.click(getByText('Login'));
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('executes continueWithoutAccount function when continue button is clicked', async () => {
    const continueWithoutAccountMock = jest.fn();
    const { getByText } = render(<FirstPage continueWithoutAccount={continueWithoutAccountMock} />, { wrapper: BrowserRouter });
    fireEvent.click(getByText('Continue Without Account'));
    await waitFor(() => {
      expect(continueWithoutAccountMock).toHaveBeenCalledTimes(1);
    });
  });
});
