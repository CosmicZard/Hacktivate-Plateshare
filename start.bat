@echo off
echo ========================================================
echo   Starting PlateShare Web App & FastAPI Backend...
echo   Frontend Website:    http://localhost:8000
echo   Swagger /docs:       http://localhost:8000/docs
echo   Folium Map:          http://localhost:8000/map/donations
echo ========================================================
start http://localhost:8000
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
