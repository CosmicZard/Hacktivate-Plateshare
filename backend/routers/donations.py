import random
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Donation, User
from backend.schemas import (
    DonationCreate,
    DonationUpdate,
    DonationStatusUpdate,
    DonationResponse
)
from backend.auth import get_optional_current_user

router = APIRouter(prefix="/api/donations", tags=["Donations (5 Endpoints: CRUD + Status)"])

STEP_MAPPING = {
    "posted": 1,
    "claimed": 2,
    "picked_up": 3,
    "delivered": 4,
    "served": 5
}

@router.post("", response_model=DonationResponse, status_code=status.HTTP_201_CREATED, summary="Create a new food donation")
def create_donation(
    donation_in: DonationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Publish a surplus food donation. Automatically generates a secure 4-digit pickup OTP.
    """
    donation_id = f"ps-{random.randint(100, 999)}"
    # ensure uniqueness
    while db.query(Donation).filter(Donation.id == donation_id).first():
        donation_id = f"ps-{random.randint(100, 999)}"

    # Generate 4-digit OTP
    otp = str(random.randint(1000, 9999))

    donor_name = donation_in.donor_name
    donor_org = donation_in.donor_org
    donor_phone = donation_in.donor_phone
    donor_id = None

    if current_user:
        donor_id = current_user.id
        donor_name = donor_name or current_user.name
        donor_org = donor_org or current_user.organization
        donor_phone = donor_phone or current_user.phone

    new_donation = Donation(
        id=donation_id,
        title=donation_in.title,
        food_type=donation_in.food_type,
        category=donation_in.category,
        quantity=donation_in.quantity,
        unit=donation_in.unit,
        prep_time=donation_in.prep_time,
        expiry_time=donation_in.expiry_time,
        storage_method=donation_in.storage_method,
        allergens=donation_in.allergens,
        packaging_time=donation_in.packaging_time,
        pickup_instructions=donation_in.pickup_instructions,
        location_name=donation_in.location_name,
        address=donation_in.address,
        lat=donation_in.lat,
        lng=donation_in.lng,
        donor_id=donor_id,
        donor_name=donor_name or "PlateShare Community Donor",
        donor_org=donor_org or "Community Kitchen",
        donor_phone=donor_phone or "+91 99999 00000",
        otp=otp,
        visibility=donation_in.visibility,
        status="posted",
        current_step=1,
        image_url=donation_in.image_url or "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80"
    )

    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)
    return new_donation


@router.get("", response_model=List[DonationResponse], summary="List all donations with optional filters")
def list_donations(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (posted, claimed, picked_up, delivered, served)"),
    category: Optional[str] = Query(None, description="Filter by food category"),
    visibility: Optional[str] = Query(None, description="Filter by visibility (ngo, community)"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Retrieve all food donations, sorted with the newest first.
    Supports filtering by status, category, and target audience visibility.
    """
    query = db.query(Donation)
    if status_filter:
        query = query.filter(Donation.status == status_filter)
    if category:
        query = query.filter(Donation.category == category)
    if visibility:
        query = query.filter(Donation.visibility == visibility)

    donations = query.order_by(Donation.created_at.desc()).offset(offset).limit(limit).all()
    return donations


@router.get("/{donation_id}", response_model=DonationResponse, summary="Get donation details by ID")
def get_donation(donation_id: str, db: Session = Depends(get_db)):
    """
    Retrieve full details for a specific food rescue donation by its unique ID.
    """
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Donation '{donation_id}' not found."
        )
    return donation


@router.put("/{donation_id}", response_model=DonationResponse, summary="Update an existing donation")
def update_donation(
    donation_id: str,
    update_data: DonationUpdate,
    db: Session = Depends(get_db)
):
    """
    Update donation details (quantity, prep time, expiry, address, pickup instructions, etc.).
    """
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Donation '{donation_id}' not found."
        )

    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(donation, field, value)

    db.commit()
    db.refresh(donation)
    return donation


@router.patch("/{donation_id}/status", response_model=DonationResponse, summary="Update donation lifecycle status")
def update_donation_status(
    donation_id: str,
    status_update: DonationStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Transition donation through lifecycle steps:
    1: `posted` -> 2: `claimed` -> 3: `picked_up` -> 4: `delivered` -> 5: `served`
    """
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Donation '{donation_id}' not found."
        )

    new_status = status_update.status.lower()
    if new_status not in STEP_MAPPING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{new_status}'. Allowed: {list(STEP_MAPPING.keys())}"
        )

    donation.status = new_status
    donation.current_step = STEP_MAPPING[new_status]
    db.commit()
    db.refresh(donation)
    return donation


@router.delete("/{donation_id}", status_code=status.HTTP_200_OK, summary="Delete a donation")
def delete_donation(donation_id: str, db: Session = Depends(get_db)):
    """
    Delete a donation listing.
    """
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Donation '{donation_id}' not found."
        )
    db.delete(donation)
    db.commit()
    return {"message": f"Donation '{donation_id}' successfully deleted."}
