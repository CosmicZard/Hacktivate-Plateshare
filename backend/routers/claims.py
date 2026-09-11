import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Donation, Claim, User
from backend.schemas import ClaimCreate, ClaimVerifyOTP, ClaimResponse, DonationResponse
from backend.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/api/claims", tags=["Claims (3 Endpoints: Claim, OTP Verify, My Claims)"])

@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED, summary="Claim a food donation")
def claim_donation(
    claim_in: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Claim an available surplus food donation.
    Transitions donation from `posted` -> `claimed` (Step 2).
    Assigns the claimer's credentials to the donation record.
    """
    donation = db.query(Donation).filter(Donation.id == claim_in.donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Donation '{claim_in.donation_id}' not found."
        )

    if donation.status not in ["posted", "available"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot claim donation with status '{donation.status}'. Only 'posted' donations can be claimed."
        )

    # Use authenticated user or fallback guest NGO info
    user_id = current_user.id if current_user else 2
    user_name = current_user.name if current_user else "Robin Hood Army Volunteer"
    user_org = current_user.organization if current_user else "Robin Hood Army Mumbai"
    user_phone = current_user.phone if current_user else "+91 98200 11984"

    now_iso = datetime.datetime.utcnow().isoformat() + "Z"

    # Update donation
    donation.status = "claimed"
    donation.current_step = 2
    donation.claimed_by_id = user_id
    donation.claimed_by_name = user_name
    donation.claimed_by_org = user_org
    donation.claimed_by_phone = user_phone
    donation.claimed_at = now_iso

    # Create Claim record
    new_claim = Claim(
        donation_id=donation.id,
        user_id=user_id,
        user_name=user_name,
        user_org=user_org,
        user_phone=user_phone,
        status="claimed",
        claimed_at=datetime.datetime.utcnow()
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    db.refresh(donation)

    return {
        "id": new_claim.id,
        "donation_id": new_claim.donation_id,
        "user_id": new_claim.user_id,
        "user_name": new_claim.user_name,
        "user_org": new_claim.user_org,
        "user_phone": new_claim.user_phone,
        "status": new_claim.status,
        "claimed_at": new_claim.claimed_at,
        "verified_at": new_claim.verified_at,
        "donation": donation
    }


@router.post("/verify-otp", response_model=ClaimResponse, summary="Verify 4-digit handover OTP at pickup location")
def verify_pickup_otp(
    otp_data: ClaimVerifyOTP,
    db: Session = Depends(get_db)
):
    """
    **Two-Party Handover Verification via 4-Digit OTP**

    When the NGO or volunteer arrives at the food donor's venue, the donor shares
    the 4-digit OTP. Upon successful verification:
    1. Donation moves to `picked_up` (Step 3)
    2. Claim record is marked `verified` with timestamp
    """
    donation = db.query(Donation).filter(Donation.id == otp_data.donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Donation '{otp_data.donation_id}' not found."
        )

    if donation.status != "claimed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Donation is in '{donation.status}' state. OTP verification is only valid for 'claimed' donations."
        )

    if donation.otp.strip() != otp_data.otp.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 4-digit OTP. Please verify the code directly with the food donor."
        )

    # Valid OTP -> update status to picked_up
    now = datetime.datetime.utcnow()
    donation.status = "picked_up"
    donation.current_step = 3

    # Update claim
    claim = db.query(Claim).filter(Claim.donation_id == donation.id).order_by(Claim.claimed_at.desc()).first()
    if claim:
        claim.status = "verified"
        claim.verified_at = now
    else:
        claim = Claim(
            donation_id=donation.id,
            user_id=donation.claimed_by_id or 1,
            user_name=donation.claimed_by_name or "Verified Volunteer",
            user_org=donation.claimed_by_org or "Community Partner",
            user_phone=donation.claimed_by_phone,
            status="verified",
            claimed_at=now,
            verified_at=now
        )
        db.add(claim)

    db.commit()
    db.refresh(donation)
    db.refresh(claim)

    return {
        "id": claim.id,
        "donation_id": claim.donation_id,
        "user_id": claim.user_id,
        "user_name": claim.user_name,
        "user_org": claim.user_org,
        "user_phone": claim.user_phone,
        "status": claim.status,
        "claimed_at": claim.claimed_at,
        "verified_at": claim.verified_at,
        "donation": donation
    }


@router.get("/my", response_model=List[ClaimResponse], summary="Retrieve user's claimed food donations")
def get_my_claims(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Get all active and past claims made by the authenticated NGO or volunteer.
    Includes full linked donation details.
    """
    query = db.query(Claim)
    if current_user:
        query = query.filter(Claim.user_id == current_user.id)
    
    claims = query.order_by(Claim.claimed_at.desc()).all()
    results = []

    for c in claims:
        donation = db.query(Donation).filter(Donation.id == c.donation_id).first()
        results.append({
            "id": c.id,
            "donation_id": c.donation_id,
            "user_id": c.user_id,
            "user_name": c.user_name,
            "user_org": c.user_org,
            "user_phone": c.user_phone,
            "status": c.status,
            "claimed_at": c.claimed_at,
            "verified_at": c.verified_at,
            "donation": donation
        })

    return results
