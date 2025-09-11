import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { AiOutlineHome } from 'react-icons/ai'
import { FcAbout }  from 'react-icons/fc'
import { BiPhone } from 'react-icons/bi'
import { AiOutlineHistory } from 'react-icons/ai'
import { CgLogIn } from 'react-icons/cg'
import { RiUserSettingsLine } from 'react-icons/ri'



const Navbar = () => {

  return (
    <nav className='navbar'>
      <spam><img src="logo.png" alt="logo" />
        <h3 className='logo'>MedForecast</h3></spam>
        <u1 className= 'nav-links'>
            <Link to="/Home" className='home'>
            <li>< AiOutlineHome />Home</li>
            </Link>
            <Link to="/about" className='about'>
               <li><FcAbout/>About</li>
            </Link>
            <Link to="/contact" className='contact'>
               <li></li>
            </Link>
            <Link to="/Signup" className='signup'>
               <li><CgLogIn/>SignUp</li>
            </Link>
            <Link to="/Home" className='logout'>
               <li><CgLogIn/>Logout</li>
            </Link>
            <Link to="/settings" className='Settings'>
               <li><RiUserSettingsLine/>Settings</li>
            </Link>
            <Link to="/Forgotpassword" className='Forgotpassword'>
               <li></li>
            </Link>
            <Link to="/Condition" className='Condition'>
               <li></li>
            </Link>
            <Link to="/Searchbox" className='Searchbox'>
               <li></li>
            </Link>
        </u1>

    </nav>
  )
}

export default Navbar