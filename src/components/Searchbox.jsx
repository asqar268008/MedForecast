import React, { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import './Searchbox.css';

const Searchbox = ({ userEmail }) => {
  const [file1, setFile1] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [predictedDisease, setPredictedDisease] = useState("");

  // Handle file selection
  const handleFileChange1 = (e) => {
    setFile1(e.target.files[0]);
    setSelectedFileName(e.target.files[0].name);
    setPredictedDisease(""); // Clear previous prediction
  };

  // Upload PDF & get prediction
  const handleUpload1 = async () => {
    if (!file1) {
      alert("No file selected for File 1");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file1);
      formData.append("email", userEmail); // Use logged-in user email
      formData.append("name", ""); // Optional: can pass username if needed

      // Upload PDF
      const uploadResponse = await fetch("http://localhost:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        alert(uploadData.error || "File upload failed");
        return;
      }

      // Get PDF ID and predict disease
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

  return (
    <div className='box'>
      <h3>How can we help?</h3>

      <div className='search'>
        <form>
          <div className='type'>
            <RiSearchLine />
            <input type="search" placeholder="Type symptoms to search....." />
          </div>
        </form>
      </div>

      {/* File upload */}
      <div className="file">
        <h3>Upload PDF</h3>
        <input type="file" onChange={handleFileChange1} />
        <button type="button" className='upload1' onClick={handleUpload1}>
          Upload & Predict
        </button>

        {selectedFileName && <p>Selected File: {selectedFileName}</p>}
        {predictedDisease && (
          <p><strong>Predicted Disease:</strong> {predictedDisease}</p>
        )}
      </div>

      <div>
        <button className='submit'>Submit</button>
      </div>
    </div>
  );
};

export default Searchbox;
