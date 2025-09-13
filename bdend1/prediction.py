from pymongo import MongoClient
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
        return "Prediction failed"
