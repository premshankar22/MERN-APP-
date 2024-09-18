import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Component/NavBar';
import EmployeeList from './Component/EmployeeList';
import HomePage from './Component/HomePage';
import AuthenticationPage from './Component/AuthenticationPage';
import PrivateRoute from './Component/PrivateRoute';
//import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div>
        {/* Conditionally render the NavBar only if the user is authenticated */}
        {isAuthenticated && <NavBar setIsAuthenticated={setIsAuthenticated} />} 
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <AuthenticationPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/"
            element={<PrivateRoute element={<HomePage />} />}
          />
          <Route
            path="/employee-list"
            element={<PrivateRoute element={<EmployeeList />} />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;





