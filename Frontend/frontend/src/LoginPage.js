import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <div className='forgot-link'>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button>Login</button>
        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
