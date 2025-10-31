import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Condition.css';

const Condition = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    alert("You have accepted the terms and conditions.");
    navigate("/signup"); // Go back to signup page
  };

  const handleDecline = () => {
    alert("You have declined the terms and conditions.");
    navigate("/signup"); // Go back to signup page
  };

  return (
    <div className="condition-container">
      <div className="condition-card">
        <h2>Terms and Conditions</h2>
        <div className="terms-content">
          <p>
            By using MedForecast, you agree to follow these terms and conditions. MedForecast is a medical prediction tool 
            designed for informational purposes only and should not replace professional medical advice. Users must provide 
            accurate information when signing up and ensure that uploaded files are in supported formats (PDF, JPG, PNG) and 
            free from harmful content.
          </p>
          <p>
            The app does not guarantee 100% accuracy of predictions and is not responsible for any health-related decisions 
            based on the results. Always consult a healthcare professional before taking any action.
          </p>
          <p>
            MedForecast may introduce premium features requiring payment, and the platform does not support emergency medical services. 
            The company reserves the right to update these terms at any time without prior notice.
          </p>
        </div>
        <div className="button-group">     
          <button className="accept-button" onClick={handleAccept}>
            I Accept
          </button>
          <button className="decline-button" onClick={handleDecline}>
            I Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default Condition;