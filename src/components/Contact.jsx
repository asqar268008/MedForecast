import React, { useState, useSyncExternalStore } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
    file: null,
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    alert("Your report has been submitted successfully! We will contact you soon.");
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="contact-report-container">
      <h2>Contact MedForCast Support</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

   

        <div className="form">
          <label>Message:</label>
          <textarea
            name="message"
            placeholder="Describe your issue or inquiry"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <div className="name"> <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange}  />
          <p>I accept the Terms & Conditions</p>
          </div>
          <div>
            <button type="submit" className="submit">Submit Report</button></div>
        </div>
      </form>
      <div><h1> Dial:0000 1111 2222</h1></div>
      
    </div>
  );
};

export default Contact;
