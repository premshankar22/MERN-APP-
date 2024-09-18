import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; // Icons for Username and Password
import './AuthenticationPage.css';

const AuthenticationPage = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username); // Store username
        setIsAuthenticated(true);
        navigate('/'); 
      } else {
        setErrorMessage(data.message || 'Invalid login details');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert('Registration successful! You can now log in.');
        setIsNewUser(false);
        setUsername('');
        setPassword('');
      } else {
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };


  return (
    <div className="auth-container">

      <div className="auth-box">
        <h2 className="auth-title">{isNewUser ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={isNewUser ? handleRegister : handleLogin}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            {isNewUser ? 'Register' : 'Login'}
          </button>
        </form>

        {isNewUser ? (
          <p className="toggle-text">
            Already have an account?{' '}
            <span onClick={() => setIsNewUser(false)} className="toggle-link">
              Login
            </span>
          </p>
        ) : (
          <p className="toggle-text">
            New here?{' '}
            <span onClick={() => setIsNewUser(true)} className="toggle-link">
              Create an account
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthenticationPage;