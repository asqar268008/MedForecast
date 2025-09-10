import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";  // Import axios
import "./Home.css";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      // Sending POST request to Django backend
      const response = await axios.post("http://127.0.0.1:8000/api/sign-in/", {
        email,
        password
      });

      // Handle successful response
      if (response.status === 200) {
        alert("Login successful!");
        navigate("/Searchbox"); 
      } else {
        alert("Login failed! Please check your credentials.");
      }
    } catch (error) {
      // Handle errors (e.g., wrong credentials, server issues)
      if (error.response && error.response.status === 400) {
        alert("Invalid email or password.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <h1>Welcome to MedForCast</h1>
      <div className="home-container">
        <div className="home-content">
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <h3>Login Form</h3>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div> 

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <p>
              Don't have an account? <a href="/SignUp">Sign up</a>
            </p>

            <button type="submit">Login</button>

            <p>
              Forgot password? <a href="/Forgotpassword">Click Here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
