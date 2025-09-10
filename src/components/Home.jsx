import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./Home.css";
import { FaUserCircle } from "react-icons/fa"; // User icon

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [userName, setUserName] = useState(""); // Optionally store user's name
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
        setUserName(email.split("@")[0]); // simple username display
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
  };

  return (
    <div>
      <h1>Welcome to MedForCast</h1>

      {isLoggedIn ? (
        // **After login: show user icon and settings**
        <div className="home-container">
          <div className="header">
            <h3>Hello, {userName}</h3>
            <div className="user-menu">
              <FaUserCircle size={40} color="#27ae60" />
              <div className="dropdown">
                <button onClick={() => navigate("/Settings")}>Settings</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <p>You are logged in! Start your disease prediction now.</p>
        </div>
      ) : (
        // **Before login: show login form**
        <div className="home-container">
          <form onSubmit={handleLogin}>
            <h3>Login to Your Account</h3>

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            <p>
              Don't have an account? <a href="/SignUp">Sign Up</a>
            </p>
            <p>
              Forgot password? <a href="/Forgotpassword">Click Here</a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
