import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="community")  # donor, ngo, community, volunteer
    organization = Column(String(150), nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    donations = relationship("Donation", foreign_keys="Donation.donor_id", back_populates="donor_rel")
    claims = relationship("Claim", back_populates="user_rel")


class Donation(Base):
    __tablename__ = "donations"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    food_type = Column(String(50), default="Vegetarian")
    category = Column(String(100), default="Cooked meal")
    quantity = Column(Integer, nullable=False, default=1)
    unit = Column(String(50), default="meals")
    prep_time = Column(String(100), nullable=True)
    expiry_time = Column(String(100), nullable=True)
    storage_method = Column(String(255), nullable=True)
    allergens = Column(String(255), nullable=True)
    packaging_time = Column(String(100), nullable=True)
    pickup_instructions = Column(Text, nullable=True)
    location_name = Column(String(200), nullable=True)
    address = Column(String(300), nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    donor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    donor_name = Column(String(100), nullable=True)
    donor_org = Column(String(150), nullable=True)
    donor_phone = Column(String(50), nullable=True)

    claimed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    claimed_by_name = Column(String(100), nullable=True)
    claimed_by_org = Column(String(150), nullable=True)
    claimed_by_phone = Column(String(50), nullable=True)
    claimed_at = Column(String(100), nullable=True)

    otp = Column(String(10), nullable=False)
    visibility = Column(String(50), default="ngo")  # ngo or community
    status = Column(String(50), default="posted")  # posted, claimed, picked_up, delivered, served
    current_step = Column(Integer, default=1)      # 1: posted, 2: claimed, 3: picked_up, 4: delivered, 5: served
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    donor_rel = relationship("User", foreign_keys=[donor_id], back_populates="donations")
    claims = relationship("Claim", back_populates="donation_rel", cascade="all, delete-orphan")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(String(50), ForeignKey("donations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_name = Column(String(100), nullable=True)
    user_org = Column(String(150), nullable=True)
    user_phone = Column(String(50), nullable=True)
    status = Column(String(50), default="claimed")  # claimed, verified, cancelled
    claimed_at = Column(DateTime, default=datetime.datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

    # Relationships
    donation_rel = relationship("Donation", back_populates="claims")
    user_rel = relationship("User", back_populates="claims")


class ImpactRecord(Base):
    __tablename__ = "impact_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(20), nullable=False, index=True)
    meals_saved = Column(Integer, default=0)
    kg_saved = Column(Float, default=0.0)
    co2_prevented_kg = Column(Float, default=0.0)
