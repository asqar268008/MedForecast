# 🏥 MedForecast

MedForecast is an intelligent **web-based medical diagnostic platform** that leverages **Machine Learning** and **Computer Vision (OCR)** to analyze medical reports and predict potential diseases at an early stage. The system enhances healthcare monitoring by providing **personalized insights and recommendations** for users.

---

⚠️ Note

This repository represents a hackathon-level implementation of MedForecast, and the associated conference/research paper is not included in this repository.

---

## 🚀 Overview

The platform enables users to securely upload medical reports, automatically extracts relevant information using OCR, and applies trained machine learning models to generate predictive insights. It is designed to assist in **early detection, proactive healthcare, and improved decision-making**.

---

## ✨ Key Features

- 🔐 Secure Authentication (Signup & Login)  
- 📄 Medical Report Analysis via OCR (OpenCV)  
- 🧠 Disease Prediction using ML Models  
- 🔔 Personalized Health Recommendations  
- ⚡ Real-time Web Application Interface  
- 🗄️ Hybrid Database Architecture:  
  MongoDB → Medical & prediction data  
  PostgreSQL → User credentials & authentication  

---

## 🛠️ Technology Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | React.js |
| Backend      | Django |
| ML Models    | Scikit-learn |
| OCR Engine   | OpenCV |
| Database     | MongoDB, PostgreSQL |

---

## ⚙️ Setup & Execution
Clone Repository
```
git clone https://github.com/asqar268008/MedForecast.git
```
```
cd MedForecast
```

---

Create a `.env` file in the project root and configure:
```env
MONGO_URI=your_mongodb_connection_string
POSTGRESQL_PASSWORD=your_postgresql_password
```

---

```
pip install -r requirements.txt
npm install
python manage.py migrate
python manage.py runserver
```
## Open a new terminal and start the frontend:
```
npm start
```

---

📸 Application Preview
<div align="center"> 
  <img src="img/login page.png" width="45%" />
  <img src="img/signup page.png" width="45%" />
  <img src="img/login successful page.png" width="100%" />
  <img src="img/home page.png" width="100%" />
  <img src="img/prediction page.png" width="100%" />
  <img src="img/server image.png" width="100%" />
</div>

---

⭐ Acknowledgement

If you found this project useful, consider giving it a ⭐ on GitHub.

---


