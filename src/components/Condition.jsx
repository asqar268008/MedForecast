import React from 'react';
import './Condition.css'


const Condition = () => {
  const handleAccept = () => {
    alert("You have accepted the terms and conditions.");
  };

  const handleDeclien = () => {
    alert("You have declined the terms and conditions.");
  };

  return (
    <div className="condition">
      <h2>Terms and Conditions</h2>
      <p>
        By using MedForCast, you agree to follow these terms and conditions. MedForCast is a medical prediction tool 
        designed for informational purposes only and should not replace professional medical advice. Users must provide 
        accurate information when signing up and ensure that uploaded files are in supported formats (PDF, JPG, PNG) and 
        free from harmful content.
      </p>
      <p>
        The app does not guarantee 100% accuracy of predictions and is not responsible for any health-related decisions 
        based on the results. Always consult a healthcare professional before taking any action.
      </p>
      <p>
        MedForCast may introduce premium features requiring payment, and the platform does not support emergency medical services. 
        The company reserves the right to update these terms at any time without prior notice.
      </p>
      <div>     
           <button className="accept-button" onClick={handleAccept}><a href="SignUp">I Accept</a></button>
           </div>

           <div >
        <button className="declien-button" onClick={handleDeclien}>I Declien</button>
           </div>
      
    </div>
  );
};

export default Condition;
