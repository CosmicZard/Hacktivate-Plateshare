from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Donation
from backend.schemas import DonationNearResponse
from backend.utils.haversine import haversine_distance
from backend.utils.folium_map import generate_donations_map_html

router = APIRouter(tags=["Geo (2 Endpoints: Haversine & Folium Map)"])

@router.get("/api/donations/near", response_model=List[DonationNearResponse], summary="Find donations near coordinates using Haversine calculation")
@router.get("/donations/near", response_model=List[DonationNearResponse], include_in_schema=False)
def get_nearby_donations(
    lat: float = Query(..., description="Latitude of user/NGO (e.g. 19.0760 for Mumbai)"),
    lng: float = Query(..., description="Longitude of user/NGO (e.g. 72.8777 for Mumbai)"),
    radius_km: float = Query(10.0, ge=0.1, le=500.0, description="Search radius in kilometers"),
    status: Optional[str] = Query(None, description="Optional filter by status (default: all)"),
    db: Session = Depends(get_db)
):
    """
    **Geospatial Proximity Search via Python Haversine Formula**

    *Engineering Pushback & Design Choice:*
    SQLite does not include native spatial queries (R-tree / PostGIS functions).
    We compute geodesic distances in Python using the Haversine formula over candidate records.
    This offers sub-millisecond response times at hackathon scale.
    For high-throughput production workloads, recommend **PostGIS** with spatial indexing.
    """
    query = db.query(Donation)
    if status:
        query = query.filter(Donation.status == status)

    all_donations = query.all()
    results = []

    for d in all_donations:
        if d.lat is not None and d.lng is not None:
            dist = haversine_distance(lat, lng, d.lat, d.lng)
            if dist <= radius_km:
                # Convert ORM to dict and add distance_km
                d_dict = {
                    "id": d.id,
                    "title": d.title,
                    "food_type": d.food_type,
                    "category": d.category,
                    "quantity": d.quantity,
                    "unit": d.unit,
                    "prep_time": d.prep_time,
                    "expiry_time": d.expiry_time,
                    "storage_method": d.storage_method,
                    "allergens": d.allergens,
                    "packaging_time": d.packaging_time,
                    "pickup_instructions": d.pickup_instructions,
                    "location_name": d.location_name,
                    "address": d.address,
                    "lat": d.lat,
                    "lng": d.lng,
                    "donor_name": d.donor_name,
                    "donor_org": d.donor_org,
                    "donor_phone": d.donor_phone,
                    "claimed_by_name": d.claimed_by_name,
                    "claimed_by_org": d.claimed_by_org,
                    "claimed_by_phone": d.claimed_by_phone,
                    "claimed_at": d.claimed_at,
                    "otp": d.otp,
                    "visibility": d.visibility,
                    "status": d.status,
                    "current_step": d.current_step,
                    "image_url": d.image_url,
                    "created_at": d.created_at,
                    "distance_km": dist
                }
                results.append(d_dict)

    # Sort nearest first
    results.sort(key=lambda x: x["distance_km"])
    return results


@router.get("/map/donations", response_class=HTMLResponse, summary="Interactive Folium HTML Map of Active Food Donations")
def get_donations_map(
    lat: Optional[float] = Query(None, description="Center latitude (optional)"),
    lng: Optional[float] = Query(None, description="Center longitude (optional)"),
    zoom: int = Query(12, ge=1, le=18, description="Initial map zoom level"),
    db: Session = Depends(get_db)
):
    """
    **Interactive Folium Map Rendering (HTML Response)**

    *Engineering Pushback & React Integration Pattern:*
    Folium generates complete standalone HTML/Leaflet documents rather than React components.
    The recommended production pattern is for FastAPI to serve this endpoint as `text/html`,
    which the React frontend embeds cleanly via an `<iframe>`:
    ```jsx
    <iframe
      src="http://localhost:8000/map/donations"
      title="Surplus Food Map"
      width="100%"
      height="550px"
      style={{ border: 'none', borderRadius: '12px' }}
    />
    ```
    *(Note: react-leaflet is the native-React alternative if direct React component trees are desired).*
    """
    donations = db.query(Donation).all()
    donations_data = [
        {
            "id": d.id,
            "title": d.title,
            "quantity": d.quantity,
            "unit": d.unit,
            "food_type": d.food_type,
            "category": d.category,
            "status": d.status,
            "lat": d.lat,
            "lng": d.lng,
            "donor_org": d.donor_org,
            "donor_name": d.donor_name,
            "address": d.address,
            "expiry_time": d.expiry_time
        }
        for d in donations
        if d.lat is not None and d.lng is not None
    ]

    center_lat = lat if lat is not None else 19.0760
    center_lng = lng if lng is not None else 72.8777

    html_content = generate_donations_map_html(
        donations=donations_data,
        center_lat=center_lat,
        center_lng=center_lng,
        zoom_start=zoom
    )

    return HTMLResponse(content=html_content)
