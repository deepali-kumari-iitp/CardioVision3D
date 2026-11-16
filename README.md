# CardioVision 3D

### AI-Powered Cardiovascular Disease Prediction, Explainability & 3D Visualization Platform

CardioVision 3D is a full-stack machine learning and data analytics platform designed to explore cardiovascular disease prediction using clinical tabular data, Explainable Artificial Intelligence (XAI), interactive analytics, and 3D heart visualization.

The platform focuses on Coronary Artery Disease (CAD) prediction using a trained Machine Learning pipeline. It combines data preprocessing, model evaluation, SHAP-based explainability, REST APIs, PostgreSQL-based prediction history, and an interactive React frontend into one integrated application.

CardioVision 3D aims to demonstrate how machine learning, software engineering, data analytics, and explainable AI can work together to build an interpretable healthcare research application.

> **Disclaimer:** This project is developed strictly for educational and research purposes. It is not clinically validated and must not be used for medical diagnosis, treatment decisions, or clinical recommendations.

---

## Key Features

- **CAD Prediction:** Predicts Coronary Artery Disease (CAD) versus Normal using a trained Random Forest machine learning pipeline.
- **Patient Analysis:** Accepts clinical input features and generates model predictions.
- **Explainable AI:** Uses SHAP to analyze feature contributions and understand model behavior.
- **Model Performance:** Displays accuracy, precision, recall, F1-score, confusion matrix, and cross-validation results.
- **Prediction History:** Stores and retrieves previous prediction records.
- **Database Analytics:** Provides prediction statistics and daily trend analysis.
- **3D Heart Explorer:** Offers an interactive 3D anatomical heart visualization.
- **REST API:** Provides FastAPI endpoints for predictions, history, and analytics.
- **Interactive Dashboard:** Presents prediction insights and model-related information through a React-based interface.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS, CSS |
| 3D Visualization | Three.js, React Three Fiber |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn, Pandas, NumPy |
| Explainable AI | SHAP |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| API Communication | REST API, HTTPX |
| Testing | Pytest |
| Version Control | Git, GitHub |

---

## Project Screenshots

### 1. Landing Page

![CardioVision 3D Landing Page](docs/screenshots/landing-page.png)

### 2. Dashboard

![CardioVision 3D Dashboard](docs/screenshots/dashboard.png)

### 3. Patient Analysis

![Patient Analysis](docs/screenshots/patient-analysis.png)

### 4. Model Performance

![Model Performance](docs/screenshots/model-performance.png)

### 5. Explainability Dashboard

![SHAP Explainability](docs/screenshots/explainability.png)

### 6. 3D Heart Explorer

![Interactive 3D Heart Explorer](docs/screenshots/heart-explorer.png)

### 7. Prediction History

![Prediction History](docs/screenshots/prediction-history.png)

---

## Machine Learning

### Dataset Overview

**Dataset:** Extension of Z-Alizadeh Sani Dataset

The project uses clinical tabular data to develop and evaluate a machine learning model for CAD prediction.

| Dataset Property | Value |
|---|---:|
| Total Patient Records | 303 |
| Original Features | 59 |
| Final Model Input Features | 54 |
| Missing Values | 0 |
| Duplicate Records | 0 |
| CAD Records | 216 |
| Normal Records | 87 |

### Data Preprocessing

The preprocessing workflow includes:

- Dataset inspection and data quality analysis.
- Missing-value and duplicate-record verification.
- Identification of binary, categorical, and continuous features.
- Outlier analysis and statistical exploration.
- Feature selection and preprocessing.
- Stratified train-test splitting.
- Prevention of target leakage.

The deployed model predicts the `Cath` target, representing the overall CAD classification.

The four target columns (`Cath`, `LAD`, `LCX`, and `RCA`) are excluded from model inputs to prevent target leakage. The constant `Exertional CP` feature is also excluded, resulting in 54 final input features.

### Model Performance

The Random Forest model was evaluated using a holdout test set and five-fold cross-validation.

| Evaluation Metric | Result |
|---|---:|
| Random Forest Holdout Accuracy | 83.61% |
| CAD Precision | 86.67% |
| CAD Recall | 90.70% |
| CAD F1-Score | 88.64% |
| Five-Fold CV Mean Accuracy | 88.88% |
| CV Standard Deviation | 3.72 percentage points |

The holdout accuracy and cross-validation mean represent different evaluation estimates and should be interpreted separately.

### Explainable AI (SHAP)

CardioVision 3D integrates SHAP (SHapley Additive exPlanations) to interpret the behavior of the trained Random Forest model.

SHAP TreeExplainer is used to estimate feature contributions and understand how individual features influence model predictions.

**Top 10 features by mean absolute SHAP importance:**

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

SHAP values describe model behavior and feature contributions. They do not establish causality, clinical significance, or medical risk.

---

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
|
+-- docs/
|   +-- screenshots/
|
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
|
+-- reports/
|
+-- sql/
|
+-- .gitignore
+-- pytest.ini
+-- start-backend.bat
+-- README.md
```

---

## Installation and Setup

### Prerequisites

Make sure the following tools are installed:

- Python 3.11+
- Node.js and npm
- PostgreSQL
- Git
- A code editor such as Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/deepali-kumari-iitp/CardioVision3D.git
cd CardioVision3D
```

### 2. Backend Setup

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the environment.

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### 3. Database Configuration

Configure your PostgreSQL database and create a root-level `.env` file.

Add the database connection string:

```env
DATABASE_URL=postgresql+psycopg://USERNAME:PASSWORD@localhost:5432/cardiovision_db
```

Replace `USERNAME` and `PASSWORD` with your local PostgreSQL credentials.

Do not commit your actual `.env` file or database credentials to GitHub.

### 4. Start the Backend

Run the following command from the project root:

```bash
python -m uvicorn app.main:app --reload --app-dir backend
```

Backend URL:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 5. Frontend Setup

Open a separate terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173`

### 6. Run Backend Tests

From the project root, activate the virtual environment and execute:

```bash
python -m pytest -v
```

**Latest recorded test result:** 22 tests passed.

---

## API Endpoints

The FastAPI backend provides REST endpoints for health checks, predictions, prediction history, and analytics.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Check backend health |
| POST | `/api/v1/predict` | Generate a CAD prediction |
| GET | `/api/v1/history` | Retrieve prediction history |
| GET | `/api/v1/history/{id}` | Retrieve prediction details |
| GET | `/api/v1/analytics` | Retrieve prediction analytics |

For request parameters, schemas, and response formats, refer to the interactive Swagger documentation at `/docs`.

---

## Research Reports

The `reports/` directory contains generated analysis and evaluation outputs, including:

- Data quality reports.
- Feature correlation analysis.
- Model comparison and evaluation.
- Confusion matrix.
- Random Forest feature importance.
- SHAP feature importance and summary plots.
- Cross-validation results.
- Target distribution analysis.

These reports support the model development and evaluation workflow.

---

## Dataset Reference

**Dataset:** Extension of Z-Alizadeh Sani Dataset

Source:

[UCI Machine Learning Repository - Extension of Z-Alizadeh Sani Dataset](https://archive.ics.uci.edu/dataset/411/extention%2Bof+z%2Balizadeh+sani%2Bdataset)

The original dataset is excluded from Git tracking. Please refer to the original source for dataset access, usage conditions, and licensing information.

---

## Data Security and Privacy

- Environment variables and credentials are excluded from Git tracking.
- Raw dataset files are excluded from Git tracking.
- Python virtual environments and Node.js dependencies are excluded.
- The final trained CAD pipeline is included as a model artifact.
- Database credentials must be stored in environment variables.
- Real patient-identifiable information must never be committed to the repository.

---

## Future Improvements

Potential future enhancements include:

- Individual patient-level SHAP explanations.
- Model calibration and external validation.
- Improved 3D cardiovascular visualization.
- Frontend performance optimization and code splitting.
- Production deployment and monitoring.
- Further model evaluation using additional datasets.

---

## Author

**Deepali Kumari**

B.Sc. (Hons.) Computer Science & Data Analytics
Indian Institute of Technology Patna

---

### CardioVision 3D

*Exploring Cardiovascular Data Through Machine Learning, Explainable AI, and Interactive Visualization.*

**Built as an educational and research-oriented full-stack machine learning project.**