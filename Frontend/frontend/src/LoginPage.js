import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  

  const handleSubmit = async (event) => {
    const user_info = {
      username: username,
      password: password
    }
    event.preventDefault();


    try {
      const response = await fetch('http://127.0.0.1:8000/polaris/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user_info),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setMessage(data.message);
      console.log(data.message);

      if (response.status === 200) {
        document.cookie = `user_id=${data.user_id}`;
        document.cookie = `username=${data.username}`;
        console.log(document.cookie);

        setMessage(data.message);
        navigate('/mainuserpage.html');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message || 'An error occurred'); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <div className='forgot-link'>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        {message && <div className="message">{message}</div>} {}
      </div>
    </div>
  );
}

export default LoginPage;