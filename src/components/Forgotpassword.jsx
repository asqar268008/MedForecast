import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from "react-icons/fa";
import "./Forgotpassword.css";
import Header from "./Header";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOtpRequest = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      console.log("Sending OTP request for email:", email);
      
      const response = await axios.post("http://127.0.0.1:8000/api/send-otp/", {
        email: email,
      });

      console.log("OTP Response:", response);
      
      if (response.status === 200) {
        setMessage("OTP sent successfully! Check your email.");
        setStep(2);
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Error Details:", error);
      
      if (error.response) {
        // Server responded with error status
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          setMessage(`Error: ${error.response.data.error}`);
        } else {
          setMessage(`Server error: ${error.response.status}. Please try again.`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        setMessage("Cannot connect to server. Please check if Django is running.");
      } else {
        // Other errors
        console.error("Error:", error.message);
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/reset-password/", {
        email: email,
        otp: otp,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      
      setMessage("Password reset successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Password Reset Error:", error);
      
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || "Error resetting password. Please check OTP.");
      } else {
        setMessage("Error resetting password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleBackToEmail = () => {
    setStep(1);
    setMessage("");
  };

  return (
    <div className="forgot-password-page">
      <Header />
      
      <div className="forgot-password-wrapper">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <FaKey className="password-icon" />
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
          </div>

          {message && (
            <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <form className="forgot-password-form">
            {step === 1 && (
              <div className="form-step">
                <div className="form-group">
                  <FaEnvelope className="icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="button" 
                  onClick={handleOtpRequest}
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <FaEnvelope className="icon" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
                  />
                </div>

                <div className="form-group">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>

                <div className="button-group">
                  <button 
                    type="button" 
                    onClick={handleBackToEmail}
                    className="back-btn"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={handlePasswordReset}
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </div>
              </div>
            )}

            <div className="back-to-login">
              <p>
                Remember your password?{" "}
                <span onClick={handleBackToLogin} className="login-link">
                  Back to Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;