import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",  
    lastname: "",   
    password: "",
    confirmpassword: "", 
    email: "",
    dob: "",        
    age: "",
    gender: "",
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age: age.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, age: "" }));
    }
  }, [formData.dob]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmpassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!formData.terms) {
      setMessage("Please agree to the privacy policy!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const { terms, ...userData } = formData;

      console.log("Sending data to backend:", userData);

      const response = await fetch("http://localhost:8000/api/sign-up/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Server returned HTML instead of JSON:", text.substring(0, 200));
        throw new Error(`Server returned HTML. Check API endpoint. Status: ${response.status}`);
      }

      if (response.ok) {
        setMessage("Account created successfully! Redirecting to login...");
        
        setFormData({
          firstname: "",
          lastname: "",
          password: "",
          confirmpassword: "",
          email: "",
          dob: "",
          age: "",
          gender: "",
          terms: false,
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);

      } else {
        if (data.error) {
          setMessage(data.error);
        } else if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setMessage(errorMessages);
        } else {
          setMessage(data.message || "Error creating account");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.message.includes("HTML")) {
        setMessage("API endpoint not found. Please check if the server is running correctly.");
      } else if (error.message.includes("Failed to fetch")) {
        setMessage("Cannot connect to server. Please make sure Django is running on http://localhost:8000");
      } else {
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    navigate("/condition");
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="brand">🩺 MedForecast</h1>
          <p className="tagline">AI-powered health predictions for better decisions.</p>
        </div>

        <h2>Create Account</h2>

        {message && (
          <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="form-row">
            <div className="form-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="icon" />
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* DOB, Age, Gender in one row */}
          <div className="form-row">
            <div className="form-group">
              <FaBirthdayCake className="icon" />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input type="number" name="age" placeholder="Age" value={formData.age} readOnly />
            </div>
            <div className="form-group gender-group">
              <FaVenusMars className="icon" />
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Terms */}
          <div className="terms">
            <label className="terms-label">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
              <span>
                Agree with <a href="/condition" onClick={handleTermsClick}>terms and conditions</a>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="signup-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login redirect link */}
        <div className="login-redirect">
          <p>
            Already have an account? <span onClick={() => navigate("/")} className="login-link">Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;