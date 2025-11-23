import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import streamlit as st
from components import show_header, show_footer, navigate_to_page,back_to_dashboard_button
 


st.set_page_config(page_title="Patient Dashboard", page_icon="🩺")
show_header()


st.markdown("### 👩‍⚕️ Patient Dashboard")
st.markdown("Select a module below:")


col1, col2 = st.columns(2)
col3, col4 = st.columns(2)
col5, col6, col7 = st.columns([1, 2, 1])  # width ratios (optional)

 



if col1.button("🩸 Health Prediction", use_container_width=True):
   navigate_to_page("pages/health_prediction.py")


if col2.button("🫁 Pneumonia Detection", use_container_width=True):
   navigate_to_page("pages/pneumonia_detection.py")


if col3.button("🧠 Image-Based Diagnosis", use_container_width=True):
   navigate_to_page("pages/image_classification.py")


if col4.button("🤖 Medical Bot & AI Assistant", use_container_width=True):
   navigate_to_page("pages/frontend.py")

with col6:
    if st.button("🧠 Depression Tester", use_container_width=True):
        navigate_to_page("pages/Depression.py")
 
show_footer()