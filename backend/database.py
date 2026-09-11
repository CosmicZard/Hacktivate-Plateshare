import datetime
import hashlib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.config import DATABASE_URL
from backend.models import Base, User, Donation, Claim, ImpactRecord

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Ensure tables are created immediately
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_pass(password: str) -> str:
    # Deterministic salted hash for seeds
    salt = "plateshare_salt"
    return hashlib.sha256((salt + password).encode()).hexdigest()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users exist
        if db.query(User).count() == 0:
            demo_users = [
                User(
                    name="Chef Rajendra",
                    email="chef@grandhyatt.com",
                    hashed_password=hash_pass("password123"),
                    role="donor",
                    organization="Grand Hyatt Banquets",
                    phone="+91 98201 44521"
                ),
                User(
                    name="Pooja Sharma",
                    email="pooja@robinhoodarmy.org",
                    hashed_password=hash_pass("password123"),
                    role="ngo",
                    organization="Robin Hood Army Mumbai",
                    phone="+91 98200 11984"
                ),
                User(
                    name="Aarav Mehta",
                    email="aarav@community.org",
                    hashed_password=hash_pass("password123"),
                    role="community",
                    organization="Khar Citizens Collective",
                    phone="+91 98330 44211"
                )
            ]
            db.add_all(demo_users)
            db.commit()

        # Check if donations exist
        if db.query(Donation).count() == 0:
            now = datetime.datetime.utcnow()
            demo_donations = [
                Donation(
                    id="ps-101",
                    title="Vegetarian Thali – 120 meals",
                    food_type="Vegetarian",
                    category="Cooked meal",
                    quantity=120,
                    unit="meals",
                    prep_time=(now - datetime.timedelta(minutes=45)).isoformat() + "Z",
                    expiry_time=(now + datetime.timedelta(minutes=135)).isoformat() + "Z",
                    storage_method="Insulated hot containers at >65°C",
                    allergens="Contains dairy (ghee/paneer). No peanuts.",
                    packaging_time="Packed 30 min ago in eco-foil containers",
                    pickup_instructions="Use service gate 3 near loading dock. Ask for Raj at banquet kitchen.",
                    location_name="Grand Hyatt Convention Center",
                    address="Plot 4, Bandra Kurla Complex, Mumbai",
                    lat=19.0657,
                    lng=72.8687,
                    donor_name="Executive Chef Rajendra",
                    donor_org="Grand Hyatt Banquet Hall",
                    donor_phone="+91 98201 44521",
                    otp="4892",
                    visibility="ngo",
                    status="posted",
                    current_step=1,
                    image_url="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80"
                ),
                Donation(
                    id="ps-102",
                    title="Paneer Butter Masala with 90 Tandoori Rotis",
                    food_type="Vegetarian",
                    category="Cooked meal",
                    quantity=90,
                    unit="meals",
                    prep_time=(now - datetime.timedelta(minutes=90)).isoformat() + "Z",
                    expiry_time=(now + datetime.timedelta(minutes=50)).isoformat() + "Z",
                    storage_method="Thermal food warmers",
                    allergens="Contains cashews and dairy.",
                    packaging_time="Packed 45 mins ago",
                    pickup_instructions="Kitchen entrance via rear alley. Call chef directly on arrival.",
                    location_name="Spice Route Fine Dining",
                    address="14 Linking Road, Santacruz West",
                    lat=19.0822,
                    lng=72.8415,
                    donor_name="Chef Anil Mehra",
                    donor_org="Spice Route Bistro",
                    donor_phone="+91 98112 33412",
                    otp="7315",
                    visibility="ngo",
                    status="posted",
                    current_step=1,
                    image_url="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
                ),
                Donation(
                    id="ps-103",
                    title="Fresh Bakery Breads, Buns & Muffins – 60 packs",
                    food_type="Vegetarian",
                    category="Bakery",
                    quantity=60,
                    unit="pieces",
                    prep_time=(now - datetime.timedelta(hours=2)).isoformat() + "Z",
                    expiry_time=(now + datetime.timedelta(hours=4)).isoformat() + "Z",
                    storage_method="Dry ambient cooling rack, sealed bakery paper bags",
                    allergens="Gluten (wheat). Eggs present in muffins.",
                    packaging_time="Freshly baked today at 4 PM",
                    pickup_instructions="Front counter. Tell staff you are here for the PlateShare pickup.",
                    location_name="Artisan Sourdough & Patisserie",
                    address="Shop 8, Hill Road, Bandra West",
                    lat=19.0553,
                    lng=72.8295,
                    donor_name="Sarah Dsouza",
                    donor_org="Artisan Sourdough Bakery",
                    donor_phone="+91 97690 12894",
                    otp="2941",
                    visibility="community",
                    status="posted",
                    current_step=1,
                    image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                ),
                Donation(
                    id="ps-104",
                    title="Dum Vegetable Biryani Handi – 80 meals",
                    food_type="Vegetarian",
                    category="Cooked meal",
                    quantity=80,
                    unit="meals",
                    prep_time=(now - datetime.timedelta(minutes=140)).isoformat() + "Z",
                    expiry_time=(now + datetime.timedelta(minutes=25)).isoformat() + "Z",
                    storage_method="Sealed metal handi with live charcoal lid removed",
                    allergens="Dairy (ghee), saffron, whole spices.",
                    packaging_time="Sealed 2 hours ago",
                    pickup_instructions="Come to dispatch gate B. Quick drive-through pickup ready.",
                    location_name="Royal Heritage Wedding Hall",
                    address="22 SV Road, Khar West",
                    lat=19.0711,
                    lng=72.8361,
                    donor_name="Catering Manager Vikram",
                    donor_org="Royal Heritage Banquets",
                    donor_phone="+91 99203 77199",
                    otp="9183",
                    visibility="ngo",
                    status="posted",
                    current_step=1,
                    image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                ),
                Donation(
                    id="ps-105",
                    title="South Indian Idli, Vada & Sambar – 55 meals",
                    food_type="Vegetarian",
                    category="Cooked meal",
                    quantity=55,
                    unit="meals",
                    prep_time=(now - datetime.timedelta(minutes=60)).isoformat() + "Z",
                    expiry_time=(now + datetime.timedelta(minutes=110)).isoformat() + "Z",
                    storage_method="Insulated steel urns for sambar, foil trays for idlis",
                    allergens="Mustard seeds in sambar. Gluten in medu vada.",
                    packaging_time="Packed 50 mins ago",
                    pickup_instructions="Front reception. Handover to Robin Hood Army team.",
                    location_name="Dakshin Bhavan Catering",
                    address="102 Matunga Circle, Mumbai",
                    lat=19.0270,
                    lng=72.8557,
                    donor_name="Murugan Iyer",
                    donor_org="Dakshin Bhavan",
                    donor_phone="+91 98401 55210",
                    claimed_by_name="Pooja Sharma",
                    claimed_by_org="Robin Hood Army - Central Chapter",
                    claimed_by_phone="+91 98200 11984",
                    claimed_at=(now - datetime.timedelta(minutes=15)).isoformat() + "Z",
                    otp="6204",
                    visibility="ngo",
                    status="claimed",
                    current_step=2,
                    image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
                )
            ]
            db.add_all(demo_donations)
            db.commit()

        # Seed Impact historical records if empty
        if db.query(ImpactRecord).count() == 0:
            today = datetime.date.today()
            history = [
                {"days_ago": 6, "meals": 340, "kg": 136.0, "co2": 340.0},
                {"days_ago": 5, "meals": 410, "kg": 164.0, "co2": 410.0},
                {"days_ago": 4, "meals": 520, "kg": 208.0, "co2": 520.0},
                {"days_ago": 3, "meals": 390, "kg": 156.0, "co2": 390.0},
                {"days_ago": 2, "meals": 640, "kg": 256.0, "co2": 640.0},
                {"days_ago": 1, "meals": 780, "kg": 312.0, "co2": 780.0},
                {"days_ago": 0, "meals": 405, "kg": 162.0, "co2": 405.0}
            ]
            records = [
                ImpactRecord(
                    date=(today - datetime.timedelta(days=h["days_ago"])).strftime("%Y-%m-%d"),
                    meals_saved=h["meals"],
                    kg_saved=h["kg"],
                    co2_prevented_kg=h["co2"]
                )
                for h in history
            ]
            db.add_all(records)
            db.commit()

    finally:
        db.close()
