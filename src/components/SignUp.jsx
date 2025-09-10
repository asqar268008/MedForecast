import React, { useState } from 'react';
import './SignUp.css';
import { AiOutlineUser } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    password: '',
    confirmpassword: '',
    age: '',
    email: '',
    dob: '',
    gender: '',
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert('Please accept the terms and conditions.');
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/sign-up/', formData);
      if (response.status === 201 || response.status === 200) {
        alert('Signed up successfully');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className='signup-container'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>First Name:</label>
          <div className='input-icon'>
            <AiOutlineUser />
            <input 
              type='text' 
              name='firstname' 
              placeholder='Enter First Name' 
              value={formData.firstName} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className='form-group'>
          <label>Last Name:</label>
          <div className='input-icon'>
            <AiOutlineUser />
            <input 
              type='text' 
              name='lastname' 
              placeholder='Enter Last Name' 
              value={formData.lastName} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className='form-group'>
          <label>Password:</label>
          <input 
            type='password' 
            name='password' 
            placeholder='Enter Password' 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className='form-group'>
          <label>Confirm Password:</label>
          <input 
            type='password' 
            name='confirmpassword' 
            placeholder='Re-enter Password' 
            value={formData.confirmpassword} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className='form-group'>
          <label>Email Address:</label>
          <div className='input-icon'>
            <MdEmail />
            <input 
              type='email' 
              name='email' 
              placeholder='Enter Email' 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className='form-group'>
          <label>Date of Birth:</label>
          <input 
            type='date' 
            name='dob' 
            value={formData.dob} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className='form-group'>
          <label>Age:</label>
          <input 
            type='number' 
            name='age' 
            placeholder='Enter Age' 
            value={formData.age} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className='form-group'>
          <label>Gender:</label>
          <select 
            name='gender' 
            value={formData.gender} 
            onChange={handleChange} 
            required
          >
            <option value='' disabled>Select Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
        </div>

        <div className='form-group'>
          <input 
            type='checkbox' 
            name='terms' 
            checked={formData.terms} 
            onChange={handleChange} 
          />
          I agree to the <a href='/Condition'>Terms and Conditions</a>
        </div>

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Signup;
