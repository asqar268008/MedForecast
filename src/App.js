import React from 'react'
import Navbar from './components/navbar/Navbar'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
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

const App = () => {
  return (
    <Router>
      <Navbar/>

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

    </Router>

  )
}

export default App