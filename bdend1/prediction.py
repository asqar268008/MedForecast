'''from pymongo import MongoClient
import joblib
import os
import pandas as pd

# MongoDB connection
def get_mongo_client():
    return MongoClient("mongodb://localhost:27017/")

def get_db():
    client = get_mongo_client()
    return client["MedForecast"]

db = get_db()

# Load trained model safely
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "prediction.pkl")
model = None

def load_model():
    global model
    if model is not None:
        return model  # Already loaded
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            print("Prediction model loaded successfully.")
        else:
            print(f"Warning: prediction model not found at {MODEL_PATH}.")
            model = None
    except Exception as e:
        print(f"Failed to load prediction model: {str(e)}")
        model = None
    return model

# List of expected features
EXPECTED_FEATURES = [
    "Glucose", "Cholesterol", "Hemoglobin", "Platelets", "White Blood Cells",
    "Red Blood Cells", "Hematocrit", "Mean Corpuscular Volume",
    "Mean Corpuscular Hemoglobin", "Mean Corpuscular Hemoglobin Concentration",
    "Insulin", "BMI", "Systolic Blood Pressure", "Diastolic Blood Pressure",
    "Triglycerides", "HbA1c", "LDL Cholesterol", "HDL Cholesterol",
    "ALT", "AST", "Heart Rate", "Creatinine", "Troponin", "C-reactive Protein"
]

def predict_disease(pdf_id):
    """
    Fetch a medical report from MongoDB by pdf_id and predict the disease.
    Missing features are filled with 0 to match model input.
    Returns the predicted disease name.
    """
    mdl = load_model()
    if mdl is None:
        return "Prediction model not loaded"

    try:
        # Fetch medical report
        report = db.processed_pdfs.find_one({"pdf_id": str(pdf_id)})
        if not report:
            return "Medical report not found"

        features = report.get("extracted_text", {})
        if not features:
            return "No features found in the medical report"

        # Convert to DataFrame
        df = pd.DataFrame([features])

        # Fill missing features with 0
        for f in EXPECTED_FEATURES:
            if f not in df.columns:
                df[f] = 0

        # Ensure columns are in the correct order
        df = df[EXPECTED_FEATURES]

        # Predict disease
        prediction = mdl.predict(df)
        predicted_disease = prediction[0]

        # Store prediction in MongoDB history
        db.prediction_history.insert_one({
            "pdf_id": pdf_id,
            "email": report.get("email"),
            "predicted_disease": predicted_disease
        })

        return predicted_disease

    except Exception as e:
        print(f"Prediction error for PDF {pdf_id}: {str(e)}")
        return "Prediction failed"'''

from pymongo import MongoClient
import joblib
import os
import pandas as pd

# -------------------------------
# MongoDB Connection
# -------------------------------
def get_mongo_client():
    return MongoClient("mongodb://localhost:27017/")

def get_db():
    client = get_mongo_client()
    return client["MedForecast"]

db = get_db()

# -------------------------------
# Model and Label Encoder Paths
# -------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "prediction.joblib")
LABEL_PATH = os.path.join(BASE_DIR, "label.joblib")

model = None
label_encoder = None

def load_model_and_encoder():
    """Load trained model and label encoder safely"""
    global model, label_encoder

    # Load model if not already loaded
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            print("✅ Prediction model loaded successfully.")
        else:
            print(f"⚠️ Model file not found at {MODEL_PATH}")
            return None, None

    # Load label encoder if not already loaded
    if label_encoder is None:
        if os.path.exists(LABEL_PATH):
            label_encoder = joblib.load(LABEL_PATH)
            print("✅ Label encoder loaded successfully.")
        else:
            print(f"⚠️ Label encoder file not found at {LABEL_PATH}")
            return model, None

    return model, label_encoder


# -------------------------------
# Expected Medical Features
# -------------------------------
EXPECTED_FEATURES = [
    "Glucose", "Cholesterol", "Hemoglobin", "Platelets", "White Blood Cells",
    "Red Blood Cells", "Hematocrit", "Mean Corpuscular Volume",
    "Mean Corpuscular Hemoglobin", "Mean Corpuscular Hemoglobin Concentration",
    "Insulin", "BMI", "Systolic Blood Pressure", "Diastolic Blood Pressure",
    "Triglycerides", "HbA1c", "LDL Cholesterol", "HDL Cholesterol",
    "ALT", "AST", "Heart Rate", "Creatinine", "Troponin", "C-reactive Protein"
]

# -------------------------------
# Reference Normal Values (used if missing)
# -------------------------------
REFERENCE_NORMALS = {
    "Glucose": 90,
    "Cholesterol": 180,
    "Hemoglobin": 14,
    "Platelets": 250,
    "White Blood Cells": 7000,
    "Red Blood Cells": 5.0,
    "Hematocrit": 45,
    "Mean Corpuscular Volume": 90,
    "Mean Corpuscular Hemoglobin": 30,
    "Mean Corpuscular Hemoglobin Concentration": 34,
    "Insulin": 10,
    "BMI": 22,
    "Systolic Blood Pressure": 120,
    "Diastolic Blood Pressure": 80,
    "Triglycerides": 150,
    "HbA1c": 5.5,
    "LDL Cholesterol": 100,
    "HDL Cholesterol": 55,
    "ALT": 25,
    "AST": 25,
    "Heart Rate": 72,
    "Creatinine": 1.0,
    "Troponin": 0.01,
    "C-reactive Protein": 0.3
}


# -------------------------------
# Prediction Function
# -------------------------------
def predict_disease(pdf_id):
    """
    Fetch medical report from MongoDB, fill missing features,
    predict using trained model, and decode label using label encoder.
    """
    mdl, le = load_model_and_encoder()
    if mdl is None or le is None:
        return "Model or label encoder not loaded"

    try:
        # Fetch medical report
        report = db.processed_pdfs.find_one({"pdf_id": str(pdf_id)})
        if not report:
            return "Medical report not found"

        features = report.get("extracted_text", {})
        if not features:
            return "No features found in the medical report"

        # Fill missing values with reference normals
        complete_features = {}
        for f in EXPECTED_FEATURES:
            if f in features and features[f] not in (None, "", "NA"):
                try:
                    complete_features[f] = float(features[f])
                except ValueError:
                    complete_features[f] = REFERENCE_NORMALS[f]
            else:
                complete_features[f] = REFERENCE_NORMALS[f]

        # Convert to DataFrame
        df = pd.DataFrame([complete_features])
        df = df[EXPECTED_FEATURES]  # ensure correct order

        # Model prediction (numeric label)
        predicted_index = mdl.predict(df)[0]

        # Decode label using label encoder
        predicted_disease = le.inverse_transform([predicted_index])[0]

        # Store result in MongoDB
        db.prediction_history.insert_one({
            "pdf_id": pdf_id,
            "email": report.get("email"),
            "predicted_disease": predicted_disease
        })

        print(f"✅ Prediction for PDF {pdf_id}: {predicted_disease}")
        return predicted_disease

    except Exception as e:
        print(f"❌ Prediction error for PDF {pdf_id}: {str(e)}")
        return "Prediction failed"
