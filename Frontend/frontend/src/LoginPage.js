import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  function getCSRFToken() {
    const csrfCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='));
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    return null;
  }
  

  const handleSubmit = async (event) => {
    const user_info = {
      email: email,
      password: password
    }
    event.preventDefault();


    try {
      const csrfToken = getCSRFToken();
      const response = await fetch('http://127.0.0.1:8000/polaris/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(user_info),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setMessage(data.message);

      navigate('/mainuserpage.html');
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
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
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
