import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import pickle
import pandas as pd
import streamlit as st
from pathlib import Path

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
        suicide = st.selectbox("Have you ever had suicidal thoughts?", ["No", "Yes"])
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
        'Gender': gender,
        'Age': age,
        'Working Professional or Student': profession,
        'Sleep Duration': sleep,
        'Dietary Habits': dietary,
        'Have you ever had suicidal thoughts ?': suicide,
        'Work/Study Hours': work_hours,
        'Financial Stress': financial,
        'Family History of Mental Illness': family,
        'Pressure': pressure,
        'Satisfaction': satisfaction
    }
    
    input_df = pd.DataFrame([input_data])

    # Show input preview
    st.markdown("### 📊 Your Input Summary")
    st.dataframe(input_df, use_container_width=True)

    try:
        # Get prediction
        if hasattr(pipe, "predict_proba"):
            # Get probability prediction
            probabilities = pipe.predict_proba(input_df)[0]
            depression_probability = float(probabilities[1])  # Probability of depression class
            
            # Determine risk level
            risk_status = "High Risk of Depression" if depression_probability >= THRESHOLD else "Low Risk of Depression"
            
            # Display results
            st.markdown("### 📈 Prediction Results")
            
            # Risk status with color coding
            if depression_probability >= THRESHOLD:
                st.error(f"⚠️ **{risk_status}**")
            else:
                st.success(f"✅ **{risk_status}**")
            
            
            
        else:
            # Fallback to simple prediction
            prediction = pipe.predict(input_df)[0]
            risk_status = "High Risk of Depression" if prediction == 1 else "Low Risk of Depression"
            
            st.markdown("### 📈 Prediction Results")
            if prediction == 1:
                st.error(f"⚠️ **{risk_status}**")
            else:
                st.success(f"✅ **{risk_status}**")

        # Disclaimer
        st.info("""
        **ℹ️ Disclaimer:** This is a predictive model for assessment purposes only. 
        It is not a substitute for professional medical advice, diagnosis, or treatment. 
        If you're experiencing mental health concerns, please consult a healthcare professional.
        """)

    except Exception as e:
        st.error("❌ Prediction failed. Please check your inputs and try again.")
        st.exception(e)

# Footer
st.markdown("---")
st.caption("Built for mental health awareness and early risk assessment")