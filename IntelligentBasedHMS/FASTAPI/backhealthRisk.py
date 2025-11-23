import sys
import os
from pathlib import Path
from typing import Annotated
import pickle
import pandas as pd
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Add parent directory to sys.path (if needed)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

app = FastAPI(title="Health Risk Prediction API")

# --------------------------
# Load the model safely
# --------------------------
def load_pipeline(path: str = "xgb_model.pkl"):
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Pipeline file not found: {path.resolve()}")
    with open(path, "rb") as f:
        model = pickle.load(f)
    return model

try:
    load_model = load_pipeline("xgb_model.pkl")
except Exception as e:
    print("Could not load pipeline (xgb_model.pkl). Make sure file is in the same folder as this script.")
    print(e)
    load_model = None

# --------------------------
# Pydantic model for input
# --------------------------
class RiskModel(BaseModel):
    age: Annotated[int, Field(description="Age of the person in years")]
    weight: Annotated[int, Field(description="Weight of the person in kilograms")]
    height: Annotated[int, Field(description="Height of the person in centimeters")]
    exercise: Annotated[int, Field(description="Exercise hours per day")]
    sleep: Annotated[int, Field(description="Sleep hours per day")]
    sugar_intake: Annotated[int, Field(description="Sugar intake in grams per day")]
    bmi_recalc: Annotated[float, Field(description="Recalculated BMI value")]

    # Lifestyle factors with default 0
    smoking_yes: Annotated[int, Field(default=0, description="Smoking status (1=yes, 0=no)")]
    alcohol_yes: Annotated[int, Field(default=0, description="Alcohol consumption (1=yes, 0=no)")]

    # Profession indicators with default 0
    profession_doctor: Annotated[int, Field(default=0, description="Doctor profession indicator")]
    profession_driver: Annotated[int, Field(default=0, description="Driver profession indicator")]
    profession_engineer: Annotated[int, Field(default=0, description="Engineer profession indicator")]
    profession_farmer: Annotated[int, Field(default=0, description="Farmer profession indicator")]
    profession_office_worker: Annotated[int, Field(default=0, description="Office worker profession indicator")]
    profession_student: Annotated[int, Field(default=0, description="Student profession indicator")]
    profession_teacher: Annotated[int, Field(default=0, description="Teacher profession indicator")]

# --------------------------
# Prediction endpoint
# --------------------------
@app.post("/predict_risk/")
def predict_risk(input_data: RiskModel):
    if load_model is None:
        return JSONResponse(
            status_code=500,
            content={"error": "Model not loaded. Cannot make predictions."}
        )

    # Convert input data to DataFrame
    input_df = pd.DataFrame([input_data.dict()])

    # Predict using the model
    if hasattr(load_model, "predict"):
        pred = load_model.predict(input_df)[0]
        status = "High Risk" if pred == 1 else "Low Risk/Save"
        return JSONResponse(status_code=200, content={"risk_prediction": int(pred), "risk_status": status})
    else:
        return JSONResponse(
            status_code=500,
            content={"error": "Loaded model does not have a predict method."}
        )

 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
