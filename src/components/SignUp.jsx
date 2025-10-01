import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    dob: "",
    age: "",
    gender: "",
    terms: false,
  });

  // Calculate age automatically based on DOB
  useEffect(() => {
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form Data:", formData);
    // TODO: send data to backend
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="brand">🩺 MedForecast</h1>
          <p className="tagline">AI-powered health predictions for better decisions.</p>
        </div>

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="form-row">
            <div className="form-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
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
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
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
                Agree with <a href="#">privacy policy</a>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
