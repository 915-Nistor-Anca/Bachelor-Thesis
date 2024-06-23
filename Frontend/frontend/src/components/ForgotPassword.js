import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const getCsrfToken = () => {
    let token = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === 'csrftoken=') {
          token = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return token;
  };

  const csrfToken = getCsrfToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/polaris/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
      } else {
        const errorResult = await response.json();
        setMessage(`Failed: ${errorResult.message}`);
      }
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      setMessage('Error sending forgot password email.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email Address:</label>
          <input 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            required 
          />
        </div>
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
