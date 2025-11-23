import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import streamlit as st
import requests
from components import show_footer, navigate_to_page, back_to_dashboard_button

# ---------------------------
# Streamlit page config
# ---------------------------
st.set_page_config(page_title="Risk Predictor", page_icon="⚕️", layout="centered")
st.title("⚕️ Health Risk Predictor")
st.markdown("Enter your details below to predict your risk level.")

# ---------------------------
# Input fields
# ---------------------------
st.header("Personal Information")
age = st.number_input("Age", min_value=0, step=1, value=30)
weight = st.number_input("Weight (kg)", min_value=0, step=1, value=70)
height = st.number_input("Height (cm)", min_value=0, step=1, value=170)

with st.expander("Health & Lifestyle Details"):
    exercise = st.number_input("Exercise (hours/day)", min_value=0, step=1, value=1)
    sleep = st.number_input("Sleep (hours/day)", min_value=0, step=1, value=7)
    sugar_intake = st.number_input("Sugar intake (grams/day)", min_value=0, step=1, value=50)
    bmi_recalc = st.number_input("BMI", min_value=0.0, step=0.1, value=22.5)
    smoking_yes = st.selectbox("Smoking?", [0, 1], index=0)
    alcohol_yes = st.selectbox("Alcohol?", [0, 1], index=0)

st.header("Profession")
profession_options = [
    "Doctor", "Driver", "Engineer", "Farmer",
    "Office Worker", "Student", "Teacher"
]
profession = st.selectbox("Select your profession", profession_options)

# ---------------------------
# API call function
# ---------------------------
API_URL = "http://127.0.0.1:8000/predict_risk/"

def call_api(data):
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"API returned {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

# ---------------------------
# Predict button
# ---------------------------
if st.button("Predict Risk"):

    # One-hot encode profession
    profession_one_hot = [1 if p == profession else 0 for p in profession_options]

    # Prepare data for API
    payload = {
        "age": int(age),
        "weight": int(weight),
        "height": int(height),
        "exercise": int(exercise),
        "sleep": int(sleep),
        "sugar_intake": int(sugar_intake),
        "bmi_recalc": float(bmi_recalc),
        "smoking_yes": int(smoking_yes),
        "alcohol_yes": int(alcohol_yes),
        "profession_doctor": profession_one_hot[0],
        "profession_driver": profession_one_hot[1],
        "profession_engineer": profession_one_hot[2],
        "profession_farmer": profession_one_hot[3],
        "profession_office_worker": profession_one_hot[4],
        "profession_student": profession_one_hot[5],
        "profession_teacher": profession_one_hot[6]
    }

    # Call API
    result = call_api(payload)

    # Show result
    if "risk_status" in result:
        if result["risk_status"] == "High Risk":
            st.error(f"🚨 {result['risk_status']}")
        else:
            st.success(f"✅ {result['risk_status']}")
    else:
        st.warning(f"API Error: {result.get('error', 'Unknown error')}")

# ---------------------------
# Footer & other buttons
# ---------------------------
st.markdown("---")
st.markdown("Developed with ❤️ using Streamlit")

# Example: Replace these with your existing functions if needed
 
if st.button("Consult Doctor / Chatbot"):
     navigate_to_page("pages/medical_bot.py")
back_to_dashboard_button()
show_footer()
