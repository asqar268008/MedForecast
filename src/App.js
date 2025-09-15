// App.js
import React from 'react'
//import Navbar from './components/navbar/Navbar'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import History from './components/History'
import SignUp from './components/SignUp'
import Contact from './components/Contact' 
import LogOut from './components/LogOut'
import Settings from './components/Settings'
import Forgotpassword from './components/Forgotpassword'
import Condition from './components/Condition'
import Searchbox from './components/Searchbox'

const AppContent = () => {
  const location = useLocation();

  // Hide Navbar only on the login page
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/History" element={<History/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/LogOut" element={<LogOut/>} />
        <Route path="/Settings" element={<Settings/>} />
        <Route path="/Forgotpassword" element={<Forgotpassword/>} />
        <Route path="/Condition" element={<Condition/>} />
        <Route path="/Searchbox" element={<Searchbox/>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;