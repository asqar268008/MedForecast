import React, {  useRef,useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import './Searchbox.css'

const Searchbox = () => {
  
   const [file1, setFile1] = useState(null);
 
  
    const handleLogin = () => {
      alert("Login is successful");
    };
  
    
  
  
  
    const handleFileChange1 = (e) => {
      setFile1(e.target.files[0]);
    };
  
   
  
    const handleUpload1 = () => {
      if (file1) {
        alert(`File 1 uploaded: ${file1.name}`);
      } else {
        alert("No file selected for File 1");
      }
    };
  
    
  return (
    
    <div className='box'>
       <h3>How can we help?</h3>
      <div className='search'>
      <form>
        <div className='type' >
        < RiSearchLine/><input type="search" placeholder="Type symptoms to search....."/>
        </div>
      </form>
      </div>
      
      <div className="file">
       
        <h3>Upload File 1</h3>
        <input type="file" onChange={handleFileChange1} />
        <button className='upload1' onClick={handleUpload1}>Upload </button>
        {file1 && <p>Selected File: {file1.name}</p>}

       
      
  
      
      </div>
      <div>
        <button className='submit'>submit</button>
      </div>
    </div>
  )
}

export default Searchbox