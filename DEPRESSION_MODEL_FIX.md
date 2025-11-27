# Depression Model Fix Guide

## Problem
The depression assessment feature is returning a 503 error because the model (`pipe.pkl`) was trained with scikit-learn 1.6.1, but the system is running scikit-learn 1.7.2.

## Solutions

### Option 1: Downgrade scikit-learn (Quick Fix)
```bash
cd IntelligentBasedHMS
pip install scikit-learn==1.6.1
```

Then restart the backend server:
```bash
python api_server.py
```

### Option 2: Retrain the Model (Recommended)
1. Locate the training script for the depression model
2. Retrain the model with the current scikit-learn version (1.7.2)
3. Save the new model as `pipe.pkl` in the `IntelligentBasedHMS` directory
4. Restart the backend server

### Option 3: Use a Virtual Environment
Create a separate environment with the correct scikit-learn version:
```bash
cd IntelligentBasedHMS
python -m venv venv_sklearn16
source venv_sklearn16/bin/activate  # On Windows: venv_sklearn16\Scripts\activate
pip install scikit-learn==1.6.1
pip install -r requirements.txt
python api_server.py
```

## Verification
After applying the fix, test the depression assessment:
1. Navigate to the Depression Assessment page
2. Fill out the form
3. Submit the assessment
4. You should receive a risk assessment result instead of a 503 error

## Current Status
- ✅ Health Risk Prediction - Working
- ✅ Pneumonia Detection - Working
- ❌ Depression Assessment - Model unavailable (needs fix)
- ✅ Medical Chatbot - UI ready (backend not implemented)
