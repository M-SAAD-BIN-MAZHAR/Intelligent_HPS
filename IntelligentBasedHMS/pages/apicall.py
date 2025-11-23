import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import pickle
import requests
import pandas as pd
import streamlit as st
from pathlib import Path
API_URL = "http://127.0.0.1:8000/predict_depression/"
 
st.set_page_config(page_title="🧠 Depression Prediction", page_icon="🩺", layout="centered")

@st.cache_resource
def load_pipeline(path="pipe.pkl"):
    """Load the trained ML pipeline"""
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Pipeline file not found: {path.resolve()}")
    with open(path, "rb") as f:
        pipe = pickle.load(f)
    return pipe

# Load model
try:
    pipe = load_pipeline("pipe.pkl")
    st.success("✅ Model loaded successfully!")
except Exception as e:
    st.error("❌ Could not load pipeline (pipe.pkl). Make sure file is in the same folder as this script.")
    st.exception(e)
    st.stop()

# App title and description
st.title("🧠 Depression Prediction")
st.write("Fill the form below to assess depression risk based on your inputs.")

# Constants
THRESHOLD = 0.24

# Input form
with st.form(key="prediction_form"):
    col1, col2 = st.columns(2)

    with col1:
        gender = st.selectbox("Gender", ["Male", "Female"])
        age = st.number_input("Age", min_value=10, max_value=100, value=25)
        profession = st.selectbox("Profession", ["Working Professional", "Student"])
        sleep = st.slider("Sleep Duration (hours)", 0, 24, 7)
        dietary = st.selectbox("Dietary Habits", ["Healthy", "Moderate", "Unhealthy"])

    with col2:
        succide = st.selectbox("Have you ever had suicidal thoughts?", ["No", "Yes"])
        work_hours = st.slider("Work/Study Hours (0-12)", 0, 12, 6)
        financial = st.slider("Financial Stress (0-5)", 0, 5, 2)
        family = st.selectbox("Family History of Mental Illness?", ["No", "Yes"])
        pressure = st.slider("Pressure (0-5)", 0, 5, 2)
        satisfaction = st.slider("Satisfaction (0-5)", 0, 5, 3)

    submit = st.form_submit_button("🔮 Predict Depression Risk")

# Prediction logic
if submit:
    # Create input dataframe
    input_data = {
    "gender": gender,
    "succide": succide,
    "age": age,
    "work_hours": work_hours,
    "profession": profession,
    "sleep": sleep,
    "financial": financial,
    "family": family,
    "pressure": pressure,
    "dietary": dietary,
    "satisfaction": satisfaction
}

    try:
        response = requests.post(API_URL, json=input_data)
        
        prediction = response.json()
        if response.status_code == 200:
           if "depression_probability" in prediction:
              st.success(prediction["risk_status"])
              st.write(f"**Depression Probability:** {prediction['depression_probability']:.2f}")
           else:
             st.success(prediction["risk_status"])
        else:
          st.error(f"❌ API Error: {response.status_code}")
          st.write(prediction)

    except Exception as e:
        st.error("❌ API call failed. Please check your inputs and try again.")
        st.exception(e)
        st.stop()
 
    
    
 

# Footer
st.markdown("---")
st.caption("Built for mental health awareness and early risk assessment")