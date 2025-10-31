import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./LogOut.css";

const LogOut = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    // Clear any stored user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    
    // Navigate to login page
    navigate("/");
  };

  return (
    <div className='logout-container'>
      <div className='logout-card'>
        <h2>Logout Successful</h2>
        <p>You have been successfully logged out.</p>
        <button onClick={handleBackToLogin} className="login-btn">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default LogOut;