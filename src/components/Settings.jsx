import React from 'react'
import './Settings.css'
import { AiOutlineHome } from 'react-icons/ai'

const Settings = () => {
  return (
    <div className='name'>
       <div className='name-link'>
       </div>
      <img src="user logo.jpg" alt="settings" />
      <div className='name1'> 
        <h1>Name</h1>
        <h1>Age</h1>
        <h1>E-mail</h1>
        <br></br>
        <p>
             <a href="/Forgotpassword">Change the password</a>
          </p>
          <br></br>
          <p>
             <a href="SignUp">Change the E-mail</a>
          </p>
        </div>
    </div>
  )
}

export default Settings
