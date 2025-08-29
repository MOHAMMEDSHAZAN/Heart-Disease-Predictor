from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
import logging

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)
CORS(app)  # allow requests from frontend (configure origins in production)

# Paths (adjust if needed)
MODEL_PATH = os.path.join('model_files','heart_rf_model.pkl')
SCALER_PATH = os.path.join('model_files','heart_scaler.pkl')
TRAIN_DATA_PATH = 'heart_dataset.csv'  # ensure this is present in backend/

# load model and scaler (will raise helpful error if missing)
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Place heart_rf_model.pkl in model_files/")
if not os.path.exists(SCALER_PATH):
    raise FileNotFoundError(f"Scaler not found at {SCALER_PATH}. Place heart_scaler.pkl in model_files/")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Load training data to get expected columns
if not os.path.exists(TRAIN_DATA_PATH):
    raise FileNotFoundError(f"Training dataset not found at {TRAIN_DATA_PATH}. Place heart_dataset.csv in backend/")
train_df = pd.read_csv(TRAIN_DATA_PATH)
# assume target column named 'target' or similar
possible_target_cols = ['target','heart_disease','target_pred','output']
for tcol in possible_target_cols:
    if tcol in train_df.columns:
        train_df = train_df.drop(columns=[tcol])

numeric_cols = train_df.select_dtypes(include=['number']).columns.tolist()
cat_cols = train_df.select_dtypes(include=['object']).columns.tolist()
bool_cols = train_df.select_dtypes(include=['bool']).columns.tolist()

train_encoded = pd.get_dummies(train_df, columns=cat_cols)
X_cols = train_encoded.columns.tolist()

@app.route('/')
def health():
    return jsonify({'status':'ok'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error':'No JSON received'}), 400

        user_df = pd.DataFrame([data])

        # fill missing numerics with training means
        for col in numeric_cols:
            if col not in user_df.columns:
                user_df[col] = train_df[col].mean() if col in train_df.columns else 0

        for col in cat_cols:
            if col not in user_df.columns:
                user_df[col] = 'unknown'

        for col in bool_cols:
            if col not in user_df.columns:
                user_df[col] = False

        user_encoded = pd.get_dummies(user_df, columns=cat_cols)
        user_encoded = user_encoded.reindex(columns=X_cols, fill_value=0)

        # scale numeric features (scaler expects same order; scaler was fit on train_encoded)
        user_scaled = scaler.transform(user_encoded)

        pred = int(model.predict(user_scaled)[0])
        prob = float(model.predict_proba(user_scaled).max()) if hasattr(model, 'predict_proba') else 1.0

        return jsonify({
            'prediction': pred,
            'probability': prob,
            'message': 'High risk of heart disease' if pred==1 else 'Low risk of heart disease'
        })
    except Exception as e:
        logging.exception('Prediction error')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT',5000)), debug=True)
