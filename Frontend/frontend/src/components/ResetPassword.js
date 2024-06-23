import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/polaris/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successfully.');
      } else {
        setMessage(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            required 
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
