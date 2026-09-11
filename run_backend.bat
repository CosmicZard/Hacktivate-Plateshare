@echo off
echo ====================================================
echo   Starting PlateShare FastAPI Backend on Port 8000
echo   Swagger Docs: http://localhost:8000/docs
echo   Folium Map:   http://localhost:8000/map/donations
echo ====================================================
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
