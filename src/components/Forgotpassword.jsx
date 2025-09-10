// import React, { useState } from 'react';
// import './Forgotpassword.css'

// const ForgotPassword = () => {

//     const handleotp = () => {
//         alert("OTP sent Successfully")
//     };
    
//     const handlerest = () => {
//         alert("password changed Successfully")
//     };

//   return (
//     <div className='forgot'>
//       <h2>Forgot Password</h2>
//       <form>
//         <label htmlFor="E-mail ">Phone Number </label>
//         <input type="number" id="phone" placeholder="Enter a E-Mail" required />

//         <button onClick={handleotp}>Sent OTP</button>
//         <label htmlFor="new-password">New Password</label>
//         <input type="password" id="new-password" placeholder="Enter new password" required />
//         <label htmlFor="confirm-password">Confirm Password</label>
//         <input type="password" id="confirm-password" placeholder="Enter confirm password" required />
//         <button onClick={handlerest}>Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState } from "react";
import axios from "axios";
import "./Forgotpassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOtpRequest = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/send-otp/", {
        email,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Error sending OTP. Please check your email.");
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/reset-password/", {
        email,
        otp,
        new_password: newPassword,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Error resetting password. Please check OTP.");
    }
  };

  return (
    <div className="forgot">
      <h2>Forgot Password</h2>
      <form>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="button" onClick={handleOtpRequest}>
          Send OTP
        </button>

        <label htmlFor="otp">Enter OTP</label>
        <input
          type="text"
          id="otp"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          placeholder="Enter new password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="button" onClick={handlePasswordReset}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
