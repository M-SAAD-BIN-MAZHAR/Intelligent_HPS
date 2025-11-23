import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import streamlit as st
from components import show_header, show_footer,back_to_dashboard_button


st.set_page_config(page_title="Image Diagnosis", page_icon="🧠")
show_header()


st.markdown("### 🧠 Image-Based Diagnosis")


# TODO: Add ML image classification integration
uploaded_file = st.file_uploader("Upload Image for Diagnosis", type=["jpg", "png", "jpeg"])
if uploaded_file:
    st.image(uploaded_file, caption="Uploaded Image", use_container_width=True)
    st.info("TODO: Model classification result will appear here.")





back_to_dashboard_button()
show_footer()