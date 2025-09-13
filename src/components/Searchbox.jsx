import React, { useState, useRef } from 'react';
import './Searchbox.css';

const Searchbox = ({ userEmail }) => {
  const [file1, setFile1] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [predictedDisease, setPredictedDisease] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange1 = (e) => {
    setFile1(e.target.files[0]);
    setSelectedFileName(e.target.files[0].name);
    setPredictedDisease("");
  };

  const handleUpload1 = async () => {
    if (!file1) {
      alert("No file selected for File 1");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file1);
      formData.append("email", userEmail);
      formData.append("name", "");

      const uploadResponse = await fetch("http://localhost:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        alert(uploadData.error || "File upload failed");
        return;
      }

      const pdfId = uploadData.pdf_id;
      const predictResponse = await fetch(`http://localhost:8000/predict/${pdfId}/`);
      const predictData = await predictResponse.json();

      if (predictResponse.ok) {
        setPredictedDisease(predictData.predicted_disease);
      } else {
        alert(predictData.error || "Prediction failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload or prediction");
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='searchbox-container'>
      <h2 className='title'>How can we help you today?</h2>
      
      <div className="file-upload">
        <h3 className="file-upload-title">Upload a PDF Report</h3>
        <p className="file-upload-subtitle">
          Select a PDF file to analyze and predict a disease.
        </p>
        
        <div className="file-input-container">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange1}
            style={{ display: 'none' }} 
          />
          <button onClick={handleChooseFileClick} className='choose-file-btn'>
            Choose File
          </button>
          <span className="file-name-display">{selectedFileName || "No file chosen"}</span>
        </div>

        <button 
          className='upload-predict-btn' 
          onClick={handleUpload1}
          disabled={!file1} 
        >
          Upload & Predict
        </button>
      </div>

      {predictedDisease && (
        <div className='prediction-result'>
          <p className='prediction-label'>Predicted Disease:</p>
          <p className='prediction-text'>{predictedDisease}</p>
        </div>
      )}
    </div>
  );
};

export default Searchbox;
