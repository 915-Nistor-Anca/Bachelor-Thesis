import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './LoginPage';

jest.mock('axios');

describe('LoginPage', () => {
  it('renders without crashing', () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
  });

  it('submits login form with valid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />, { wrapper: BrowserRouter });

    axios.post.mockResolvedValueOnce({ data: { message: 'Login successful', user_id: 1 } });

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/polaris/users/login/', {
        username: 'testuser',
        password: 'testpassword'
      });
      expect(document.cookie).toContain('user_id=1');
      expect(window.location.pathname).toEqual('/mainuserpage');
    });
  });

  it('displays error message on invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />, { wrapper: BrowserRouter });

    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/polaris/users/login/', {
        username: 'testuser',
        password: 'wrongpassword'
      });
      expect(document.cookie).not.toContain('user_id');
      expect(getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
