import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

 

import streamlit as st
from PIL import Image
import requests

from components import show_header, show_footer, back_to_dashboard_button

API_URL = "http://localhost:8000/predict"  # change if your API is elsewhere

st.set_page_config(page_title="Pneumonia Detection", page_icon="🫁")
show_header()
st.title("Pneumonia Detection")
st.write("Upload a chest X-ray and the API will tell you if Pneumonia is present.")

uploaded_file = st.file_uploader("Upload Chest X-ray (jpg/png)", type=["jpg","jpeg","png"])

if uploaded_file:
    img = Image.open(uploaded_file).convert("RGB")
    st.image(img, use_column_width=True, caption="Uploaded Image")

    # send image bytes to API
    uploaded_file.seek(0)
    files = {"file": (uploaded_file.name, uploaded_file.getvalue(), "image/jpeg")}

    with st.spinner("Predicting..."):
        try:
            resp = requests.post(API_URL, files=files, timeout=20)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            st.error(f"API error: {e}")
        else:
            prob = data.get("probability")
            label = data.get("label", "").lower()
            if prob is not None:
                st.write(f"Probability: **{prob:.3f}**")
            if "pneu" in label:
                st.error("Pneumonia Detected 😷")
            else:
                st.success("Normal Lungs 🫶")

back_to_dashboard_button("pages/patient_dashboard.py")
show_footer()

 
 