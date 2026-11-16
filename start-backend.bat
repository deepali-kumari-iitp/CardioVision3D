@echo off
cd /d D:\MYOWNPROJECT\CardioVision3D

call .venv\Scripts\activate.bat

python -m uvicorn app.main:app --reload --app-dir backend

pause
