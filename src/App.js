// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogOut from './components/LogOut';
import Settings from './components/Settings';
import Forgotpassword from './components/Forgotpassword';
import Condition from './components/Condition';
import Searchbox from './components/Searchbox';
import Header from './components/Header';

const AppContent = () => {
  const location = useLocation();

  // Hide header only on login page
  const hideHeader = location.pathname === "/";

  return (
    <>
      {!hideHeader && <Header />} {/* Show header except on login */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/condition" element={<Condition />} />
        <Route path="/searchbox" element={<Searchbox />} />
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
