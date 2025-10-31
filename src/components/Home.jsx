import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./Home.css";
import { FaUserCircle, FaEnvelope, FaLock, FaSignOutAlt } from "react-icons/fa"; 
import Header from "./Header";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userName, setUserName] = useState(""); 
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/sign-in/", {
        email,
        password
      });

      if (response.status === 200) {
        alert("Login successful!");
        setIsLoggedIn(true);
        setUserName(email.split("@")[0]); 
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        navigate("/Searchbox"); 
      } else {
        alert("Login failed! Please check your credentials.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Invalid email or password.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setUserName("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    alert("You have been logged out successfully.");
  };

  React.useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("userEmail");
    if (loggedIn === "true" && userEmail) {
      setIsLoggedIn(true);
      setUserName(userEmail.split("@")[0]);
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <div className="logged-in-container">
          <Header />
          <div className="welcome-card">
            <div className="welcome-header">
              <FaUserCircle className="user-icon" />
              <h2>Welcome back, {userName}!</h2>
            </div>
            <p className="welcome-message">
              You are successfully logged in to MedForecast. 
              Start your AI-powered health predictions now for better medical decisions.
            </p>
            <div className="action-buttons">
              <button 
                onClick={() => navigate("/Searchbox")} 
                className="primary-btn"
              >
                Start Prediction
              </button>
              <button 
                onClick={() => navigate("/Settings")} 
                className="secondary-btn"
              >
                Settings
              </button>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="home-page">
          <Header />
          
          <div className="login-wrapper">
            <div className="login-card">
              {/* Doctor Emoji Added Here */}
              <div className="login-emoji">🩺</div>
              
              <div className="login-header">
                <h2>Welcome Back</h2>
                <p className="tagline">AI-powered health predictions for better decisions</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <h3 className="login-title">Login to Your Account</h3>
                
                <div className="form-group">
                  <FaEnvelope className="icon" />
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="login-btn">Login</button>

                {/* Centered Links */}
                <div className="login-links-centered">
                  <p className="link-item">
                    Don't have an account? <a href="/SignUp" className="link">Sign Up</a>
                  </p>
                  <p className="link-item">
                    Forgot password? <a href="/Forgotpassword" className="link">Click Here</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;