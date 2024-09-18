import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file

const NavBar = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    console.log('Stored Username:', storedUsername); // Debugging line
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    console.log('Logout button clicked'); // Debugging line
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setUsername(''); // Clear username state
    setIsAuthenticated(false); // Set isAuthenticated to false
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Logo Section */}
        <div className="logo">
          <img src="/logo.ico" alt="Logo" />
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><a href="/" className="active">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/employee-list">Employee List</a></li>
        </ul>
      </div>

      {/* Display Username and Logout Button */}
      {username && (
          <>
          <span className="username"> {username}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        
          </>
      )}
    </nav>
  );
};

export default NavBar;



