from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import datetime

# --- Auth Schemas ---

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, example="Executive Chef Raj")
    email: EmailStr = Field(..., example="raj@grandhyatt.com")
    password: str = Field(..., min_length=6, example="password123")
    role: str = Field(default="donor", example="donor")  # donor, ngo, community, volunteer
    organization: Optional[str] = Field(None, example="Grand Hyatt Banquets")
    phone: Optional[str] = Field(None, example="+91 98201 44521")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="raj@grandhyatt.com")
    password: str = Field(..., example="password123")

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    organization: Optional[str] = None
    phone: Optional[str] = None
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Donation Schemas ---

class DonationCreate(BaseModel):
    title: str = Field(..., example="Vegetarian Thali – 120 meals")
    food_type: str = Field(default="Vegetarian", example="Vegetarian")
    category: str = Field(default="Cooked meal", example="Cooked meal")
    quantity: int = Field(..., gt=0, example=120)
    unit: str = Field(default="meals", example="meals")
    prep_time: Optional[str] = Field(None, example="2026-09-11T13:00:00Z")
    expiry_time: Optional[str] = Field(None, example="2026-09-11T16:00:00Z")
    storage_method: Optional[str] = Field(None, example="Insulated hot containers at >65°C")
    allergens: Optional[str] = Field(None, example="Contains dairy (ghee/paneer).")
    packaging_time: Optional[str] = Field(None, example="Packed 30 min ago in eco-foil containers")
    pickup_instructions: Optional[str] = Field(None, example="Use service gate 3 near loading dock.")
    location_name: Optional[str] = Field(None, example="Grand Hyatt Convention Center")
    address: Optional[str] = Field(None, example="Plot 4, Bandra Kurla Complex, Mumbai")
    lat: float = Field(..., example=19.0657)
    lng: float = Field(..., example=72.8687)
    donor_name: Optional[str] = Field(None, example="Chef Rajendra")
    donor_org: Optional[str] = Field(None, example="Grand Hyatt Banquets")
    donor_phone: Optional[str] = Field(None, example="+91 98201 44521")
    visibility: str = Field(default="ngo", example="ngo")  # ngo or community
    image_url: Optional[str] = Field(None, example="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80")

class DonationUpdate(BaseModel):
    title: Optional[str] = None
    food_type: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    prep_time: Optional[str] = None
    expiry_time: Optional[str] = None
    storage_method: Optional[str] = None
    allergens: Optional[str] = None
    packaging_time: Optional[str] = None
    pickup_instructions: Optional[str] = None
    location_name: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    visibility: Optional[str] = None
    image_url: Optional[str] = None

class DonationStatusUpdate(BaseModel):
    status: str = Field(..., example="claimed")  # posted, claimed, picked_up, delivered, served

class DonationResponse(BaseModel):
    id: str
    title: str
    food_type: Optional[str] = "Vegetarian"
    category: Optional[str] = "Cooked meal"
    quantity: int
    unit: Optional[str] = "meals"
    prep_time: Optional[str] = None
    expiry_time: Optional[str] = None
    storage_method: Optional[str] = None
    allergens: Optional[str] = None
    packaging_time: Optional[str] = None
    pickup_instructions: Optional[str] = None
    location_name: Optional[str] = None
    address: Optional[str] = None
    lat: float
    lng: float
    donor_name: Optional[str] = None
    donor_org: Optional[str] = None
    donor_phone: Optional[str] = None
    claimed_by_name: Optional[str] = None
    claimed_by_org: Optional[str] = None
    claimed_by_phone: Optional[str] = None
    claimed_at: Optional[str] = None
    otp: str
    visibility: str
    status: str
    current_step: int
    image_url: Optional[str] = None
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class DonationNearResponse(DonationResponse):
    distance_km: float


# --- Claim Schemas ---

class ClaimCreate(BaseModel):
    donation_id: str = Field(..., example="ps-101")

class ClaimVerifyOTP(BaseModel):
    donation_id: str = Field(..., example="ps-101")
    otp: str = Field(..., example="4892")

class ClaimResponse(BaseModel):
    id: int
    donation_id: str
    user_id: int
    user_name: Optional[str] = None
    user_org: Optional[str] = None
    user_phone: Optional[str] = None
    status: str
    claimed_at: Optional[datetime.datetime] = None
    verified_at: Optional[datetime.datetime] = None
    donation: Optional[DonationResponse] = None

    class Config:
        from_attributes = True


# --- Impact & AI Schemas ---

class ImpactStatsResponse(BaseModel):
    total_donations: int
    total_meals_rescued: int
    total_kg_saved: float
    total_co2_prevented_kg: float
    active_donations_count: int
    active_ngos_count: int

class TimeSeriesPoint(BaseModel):
    date: str
    meals_saved: int
    kg_saved: float
    co2_prevented_kg: float

    class Config:
        from_attributes = True

class ChatbotRequest(BaseModel):
    message: str = Field(..., example="What is the safe holding temperature for hot cooked food?")

class ChatbotResponse(BaseModel):
    response: str
    suggestions: List[str]
    matched_topic: str
