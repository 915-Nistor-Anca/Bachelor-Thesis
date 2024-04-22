import React, { useState } from 'react';
import './RegisterPage.css';
import { Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const user = {
            username: username,
            email: email,
            password: password
        };
        
        fetch('http://127.0.0.1:8000/polaris/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to register');
                });
            }
            setRegistrationSuccess(true);
        })
        .catch(error => {
            setError(error.message); 
        });
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Register</h2>
                {registrationSuccess ? (
                    <React.Fragment>
                    <p>Registration successful!</p>
                    <p>
                        <Link to="/login">Go to login page!</Link>
                    </p>
                </React.Fragment>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <input
                            type="email"
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
                        <button type="submit">
                            Register
                        </button>
                    </form>
                )}
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Register;
