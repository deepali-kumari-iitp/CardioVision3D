# CardioVision 3D
## AI-Powered Cardiovascular Disease Prediction & Explainability Platform

## Machine Learning

The platform uses clinical tabular data to predict Coronary Artery Disease (CAD), explain model behaviour, and visualize prediction analytics.

> **Disclaimer:** This project is intended for educational and research purposes only. It is not clinically validated and must not be used for medical diagnosis or treatment decisions.

## Key Features

## Machine Learning
- **Patient Analysis:** Input clinical features and generate model predictions.
- **Explainable AI:** SHAP-based global feature importance to understand model behaviour.
- **Model Performance:** View accuracy, precision, recall, F1-score, confusion matrix, and cross-validation results.
- **Prediction History:** Store and retrieve previous prediction records.
- **Database Analytics:** Explore prediction statistics and daily trends.
- **3D Heart Explorer:** Interactive anatomical heart visualization.
- **REST API:** FastAPI-powered backend for prediction, history, and analytics.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS, CSS |
| 3D Visualization | Three.js, React Three Fiber |
| Backend | Python, FastAPI |
## Machine Learning
| Explainable AI | SHAP |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Testing | Pytest, HTTPX |

## Project Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing-page.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Patient Analysis
![Patient Analysis](docs/screenshots/patient-analysis.png)

### Model Performance
![Model Performance](docs/screenshots/model-performance.png)

### Explainability
![Explainability](docs/screenshots/explainability.png)

### 3D Heart Explorer
![3D Heart Explorer](docs/screenshots/heart-explorer.png)

### Prediction History
![Prediction History](docs/screenshots/prediction-history.png)

---

## Machine Learning

**Dataset:** Extension of Z-Alizadeh Sani Dataset

- Patient records: 303
- Original features: 59
- Model input features: 54
- Missing values: 0
- Duplicate records: 0

The target variable for the deployed model is `Cath`, representing the overall CAD classification.

Four target columns (`Cath`, `LAD`, `LCX`, `RCA`) are excluded from model inputs to prevent target leakage.

### Model Performance

| Metric | Result |
|---|---:|
| Random Forest Holdout Accuracy | 83.61% |
| CAD Precision | 86.67% |
| CAD Recall | 90.70% |
| CAD F1-score | 88.64% |
| 5-Fold CV Mean Accuracy | 88.88% |
| CV Standard Deviation | 3.72 percentage points |

The holdout accuracy and cross-validation mean represent different evaluation estimates.

### Explainable AI (SHAP)

SHAP TreeExplainer is used to understand the Random Forest model's predictions.

Top features by mean absolute SHAP importance:

1. Typical Chest Pain
2. Age
3. Atypical Chest Pain (N)
4. Atypical Chest Pain (Y)
5. Region RWMA
6. EF-TTE
7. HTN
8. BP
9. FBS
10. Tinversion

SHAP values describe model behaviour and feature contributions. They do not establish causality or clinical importance.

## Project Architecture

```text
CardioVision3D/
|
+-- backend/
|   +-- app/
|   |   +-- api/
|   |   +-- core/
|   |   +-- db/
|   |   +-- ml/
|   |   +-- schemas/
|   |   +-- services/
|   |   +-- main.py
|   +-- tests/
|   +-- requirements.txt
|
+-- dataset/
|   +-- raw/
|   +-- processed/
|   +-- external/
|
+-- data_dictionary/
+-- docs/
+-- frontend/
|   +-- public/
|   +-- src/
|       +-- components/
|       +-- pages/
|       +-- services/
|       +-- types/
|       +-- utils/
|
+-- ml/
|   +-- models/
|   +-- pipelines/
|   +-- evaluation/
|   +-- input_schema.csv
|
+-- notebooks/
+-- reports/
+-- sql/
+-- .gitignore
+-- pytest.ini
+-- start-backend.bat
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd CardioVision3D
```

### 2. Backend Setup

Create and activate a Python virtual environment:

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Configure your PostgreSQL database and create a root `.env` file:

```env
DATABASE_URL=postgresql+psycopg://USERNAME:PASSWORD@localhost:5432/cardiovision_db
```

Start the backend from the project root:

```bash
python -m uvicorn app.main:app --reload --app-dir backend
```

Backend URL: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

### 4. Run Backend Tests

From the project root:

```bash
python -m pytest -v
```

Current test status: **22 passed**.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/predict` | Generate CAD prediction |
| GET | `/api/v1/history` | Retrieve prediction history |
| GET | `/api/v1/history/{id}` | Retrieve prediction details |
| GET | `/api/v1/analytics` | Retrieve prediction analytics |

Refer to Swagger UI at `/docs` for request and response schemas.

## Research Reports

The `reports/` directory contains:

- Data quality reports
- Feature correlation analysis
- Model comparison and evaluation
- Confusion matrix
- Random Forest feature importance
- SHAP feature importance and summary plots
- Cross-validation results
- Target distribution analysis

## Dataset Reference

Extension of Z-Alizadeh Sani Dataset:

https://archive.ics.uci.edu/dataset/411/extention%2Bof+z%2Balizadeh+sani%2Bdataset

The original dataset is excluded from Git tracking. Refer to its source for access and licensing information.

## Data & Security

- Environment variables and credentials are excluded from Git.
- Raw dataset files are excluded from Git.
- Python virtual environments and Node dependencies are excluded.
- The final trained CAD pipeline is included as a model artifact.

Never commit real patient-identifiable information or database credentials.

## Future Improvements

- Individual patient-level SHAP explanations
- Model calibration and external validation
- Improved 3D cardiovascular visualization
- Frontend performance optimization and code splitting
- Production deployment and monitoring

## Author

**Deepali Kumari**

B.Sc. (Hons.) Computer Science & Data Analytics
Indian Institute of Technology Patna

---

**CardioVision 3D - Exploring Cardiovascular Data Through AI, Explainability & Visualization.**
