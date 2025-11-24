# app.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import tensorflow as tf

app = FastAPI(title="Pneumonia Detection API")

# Allow your Streamlit front-end (localhost) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501", "http://localhost"],  # adjust origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once on startup
# (TensorFlow/Keras models are not thread-safe to repeatedly load; load globally)
MODEL_PATH = "pneumonia_model_custom.h5"
try:
    model = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    # Informative error on startup if model missing/corrupt
    raise RuntimeError(f"Failed to load model at {MODEL_PATH}: {e}")


def preprocess_image_file(file_bytes: bytes, target_size=(150, 150)):
    """
    Accepts raw bytes of an image file and returns a preprocessed numpy array
    shaped (1, H, W, C) scaled [0,1].
    """
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Unable to read image: {e}")
    image = image.resize(target_size)
    arr = np.array(image).astype("float32") / 255.0
    arr = np.expand_dims(arr, axis=0)  # batch dim
    return arr


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Accept only image mime types
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    contents = await file.read()
    try:
        x = preprocess_image_file(contents, target_size=(150, 150))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Get model prediction
    try:
        pred = model.predict(x)  # shape (1, 1) or (1, n) depending on your model
        # handle outputs that are single-value or vector - adapt if your model returns classes
        prob = float(pred[0][0]) if pred.ndim == 2 else float(np.squeeze(pred))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {e}")

    # Interpret threshold - you used 0.8 in Streamlit, keep consistent
    label = "Pneumonia" if prob > 0.8 else "Normal"

    return JSONResponse({"probability": prob, "label": label})
