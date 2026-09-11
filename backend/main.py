import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from backend.config import CORS_ORIGINS
from backend.database import seed_database
from backend.routers import auth, donations, geo, claims, impact

app = FastAPI(
    title="PlateShare Food-Rescue API",
    description="""
    🌿 **PlateShare — Community-First Food-Rescue Platform Backend**
    
    High-performance async backend built with **FastAPI**, **SQLite**, **Pydantic v2**, and **Folium**.
    
    ### API Modules (16 Total Endpoints):
    1. 🔐 **Auth (3)**: User registration, JWT login, and profile lookup (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`)
    2. 🍱 **Donations (5)**: Full CRUD + lifecycle status transition (`/api/donations`, `/api/donations/{id}`, `/api/donations/{id}/status`)
    3. 🗺️ **Geo (2)**: 
       - Haversine proximity query (`/api/donations/near` or `/donations/near`)
       - Standalone Folium interactive HTML map (`/map/donations`)
    4. 🤝 **Claims (3)**: Claim food listing, verify two-party 4-digit OTP handover, and query user claims (`/api/claims`, `/api/claims/verify-otp`, `/api/claims/my`)
    5. 📊 **Impact & AI (3)**: Real-time environmental metrics, trend timeseries for charts, and AI Food Safety assistant (`/api/impact/stats`, `/api/impact/timeseries`, `/api/ai/chatbot`)
    
    ### Key Architecture Decisions:
    - **Geospatial Proximity**: Python Haversine calculation over SQLite (*PostGIS in production*).
    - **Map Integration**: FastAPI serves Folium HTML map at `/map/donations` for React `<iframe>` embedding (*or react-leaflet for native component bindings*).
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware to allow React + Vite frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (e.g. React at http://localhost:5173 or 3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers (Register specific paths like /api/donations/near before /{donation_id})
app.include_router(auth.router)
app.include_router(geo.router)
app.include_router(donations.router)
app.include_router(claims.router)
app.include_router(impact.router)

@app.on_event("startup")
def on_startup():
    """Ensure database schema is created and seeded with realistic demo data on startup."""
    seed_database()

from fastapi.staticfiles import StaticFiles

@app.get("/api/health", tags=["System"])
def health_check():
    """Health check endpoint to verify backend service status."""
    return {
        "status": "ok",
        "service": "PlateShare FastAPI Backend",
        "database": "SQLite",
        "version": "1.0.0",
        "swagger_docs": "/docs",
        "folium_map": "/map/donations"
    }

# Mount static frontend assets from public/ directory
public_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")
if os.path.exists(public_dir):
    app.mount("/", StaticFiles(directory=public_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
