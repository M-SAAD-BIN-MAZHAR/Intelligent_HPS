import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import streamlit as st
import numpy as np
import tensorflow as tf
from PIL import Image
from components import show_header, show_footer, back_to_dashboard_button

# Page config
st.set_page_config(page_title="Pneumonia Detection", page_icon="🫁")

# Header
show_header()
st.title("Pneumonia Detection")
st.write("Upload a chest X-ray image and the AI will predict if Pneumonia is present.")

# Load model
@st.cache_resource
def load_model():
    model = tf.keras.models.load_model("pneumonia_model_custom.h5")
    return model

model = load_model()

# File uploader
uploaded_file = st.file_uploader("Upload Chest X-ray Image (jpg/png)", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image = Image.open(uploaded_file).convert("RGB")
    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Preprocess image
    resized = image.resize((150,150))
    img_array = np.expand_dims(np.array(resized)/255.0, axis=0)

    # Prediction
    prediction = model.predict(img_array)[0][0]
    if prediction > 0.8:
        st.error("Pneumonia Detected 😷")
    else:
        st.success("Normal Lungs 🫶")

# Back to dashboard button
back_to_dashboard_button("pages/patient_dashboard.py")
show_footer()
 