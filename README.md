# Heart Disease Predictor

A simple full-stack demo to predict heart disease using a trained ML model. This repo contains:

- `backend/` — Flask API that loads the saved model + scaler and exposes `/predict`.
- `frontend/` — React single-page app that collects input and shows predictions.
- `docker-compose.yml` — run frontend + backend together locally.

## Quick start (local)

1. Copy your model files into the `model_files/` folder:
   - `heart_rf_model.pkl`
   - `heart_scaler.pkl`
2. Place your training dataset `heart_dataset.csv` into `backend/` (used to align columns during preprocessing).

### Run with Docker Compose

```bash
# from repo root
docker-compose up --build
```

- Frontend will be available at `http://localhost:3000`.
- Backend API at `http://localhost:5000`.

### Run locally without Docker

#### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # use venv\Scripts\activate on Windows
pip install -r requirements.txt
# Make sure model_files/heart_rf_model.pkl and heart_scaler.pkl are in same root or update path in app.py
python app.py
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## API

**POST** `/predict`

Content-Type: `application/json`

Body: JSON object with clinical fields (example):

```json
{
  "age": 63,
  "sex": "M",
  "cp": "typical angina",
  "trestbps": 145,
  "chol": 233,
  "fbs": false,
  "restecg": "normal",
  "thalch": 150,
  "exang": false,
  "oldpeak": 2.3,
  "slope": "flat",
  "ca": 0,
  "thal": "fixed defect"
}
```

Response example:

```json
{
  "prediction": 1,
  "probability": 0.87,
  "message": "High risk of heart disease"
}
```

## Deployment suggestions

- Frontend: Vercel / Netlify / GitHub Pages.
- Backend: Render / Railway / Heroku (Docker), or any container host.

When deploying, set the frontend environment variable `REACT_APP_API_URL` to point to your backend URL (e.g. `https://your-backend.example.com`).

## Notes

- This project expects your `heart_dataset.csv` (the dataset used to create the model) to be present in `backend/` so the API can recreate training columns and properly align one-hot encoding. If you saved the original training columns to a file (recommended), you can update `app.py` to load them directly.

- Make sure `heart_rf_model.pkl` and `heart_scaler.pkl` are available under `model_files/` or update `app.py` with the correct path.
