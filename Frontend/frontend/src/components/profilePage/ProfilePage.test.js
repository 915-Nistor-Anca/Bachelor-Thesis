import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';

describe('ProfilePage', () => {
  it('renders without crashing', () => {
    render(<ProfilePage />, { wrapper: BrowserRouter });
  });

  it('displays user information in non-edit mode', () => {
    const { getByText } = render(<ProfilePage />, { wrapper: BrowserRouter });

    expect(getByText('Edit Profile')).toBeInTheDocument();
    expect(getByText('Statistics')).toBeInTheDocument();
  });

  it('allows switching to edit mode', async () => {
    const { getByText, getByPlaceholderText } = render(<ProfilePage />, { wrapper: BrowserRouter });

    fireEvent.click(getByText('Edit Profile'));

    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByText('Save Changes')).toBeInTheDocument();
  });

  it('updates user information in edit mode', async () => {
    const { getByText, getByPlaceholderText } = render(<ProfilePage />, { wrapper: BrowserRouter });

    fireEvent.click(getByText('Edit Profile'));

    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');

    fireEvent.change(usernameInput, { target: { value: 'newUsername' } });
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    fireEvent.click(getByText('Save Changes'));

    await waitFor(() => {
      expect(getByText('Edit Profile')).toBeInTheDocument();
    });
  });

  it('displays statistics when clicked', async () => {
    const { getByText } = render(<ProfilePage />, { wrapper: BrowserRouter });

    fireEvent.click(getByText('Statistics'));

    expect(getByText('Number of observations:')).toBeInTheDocument();
  });

  it('navigates to add observations page when "Add Observation" button is clicked', () => {
    const { getByText } = render(<ProfilePage />, { wrapper: BrowserRouter });

    fireEvent.click(getByText('Add Observation'));
  });

  it('navigates to all observations page when "See all observations" link is clicked', () => {
    const { getByText } = render(<ProfilePage />, { wrapper: BrowserRouter });

    fireEvent.click(getByText('See all observations'));
  });
});
