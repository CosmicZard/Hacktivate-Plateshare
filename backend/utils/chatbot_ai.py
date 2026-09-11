import re
from typing import Dict, Any, List

KNOWLEDGE_BASE = [
    {
        "keywords": ["temperature", "hot", "cold", "holding", "storage", "spoilage", "safe"],
        "answer": (
            "🌡️ **Food Safety & Storage Guidelines (FSSAI Aligned):**\n\n"
            "- **Hot Cooked Food:** Keep above **65°C (149°F)** in insulated food-grade containers. Consume or redistribute within 2–4 hours of preparation.\n"
            "- **Chilled/Cold Food:** Maintain below **5°C (41°F)** in refrigerated transport. Safe window is up to 24–48 hours depending on dairy/protein content.\n"
            "- **Bakery & Dry Goods:** Store at dry room temperature in moisture-barrier packaging away from direct sunlight.\n"
            "- **Danger Zone:** Avoid leaving cooked food between **5°C and 65°C** for more than 2 hours to prevent bacterial multiplication."
        ),
        "suggestions": ["What items cannot be donated?", "How does OTP verification work?", "FSSAI compliance rules"]
    },
    {
        "keywords": ["fssai", "regulation", "law", "legal", "liability", "policy", "guideline"],
        "answer": (
            "📜 **FSSAI Surplus Food Regulations (Food Safety and Standards Act):**\n\n"
            "Under FSSAI Surplus Food Regulations (2019):\n"
            "1. Surplus food must remain wholesome, hygienic, and free from cross-contamination.\n"
            "2. Donors and Food Recovery Agencies (NGOs) must maintain traceability records.\n"
            "3. Food nearing expiry or showing signs of spoilage/sour smell must not be distributed.\n"
            "4. Packaging must clearly label allergens, preparation time, and use-by time."
        ),
        "suggestions": ["Safe temperatures for cooked food", "How does PlateShare work?", "How do I claim a meal?"]
    },
    {
        "keywords": ["claim", "otp", "verify", "pickup", "code", "handover", "collect"],
        "answer": (
            "🔐 **Claiming & OTP Verification Flow:**\n\n"
            "1. **Claiming:** Registered NGOs or community volunteers click **'Claim Donation'**.\n"
            "2. **Unique 4-digit OTP:** The system assigns a secure 4-digit OTP to the donor listing.\n"
            "3. **Pickup:** The volunteer arrives at the donor's address with insulated transport.\n"
            "4. **Verification:** The donor checks the volunteer's credentials and shares the 4-digit OTP. Once entered at `/api/claims/verify-otp`, status updates to **'Picked Up'**."
        ),
        "suggestions": ["Check nearby donations", "What are the donation statuses?", "Impact stats"]
    },
    {
        "keywords": ["how to donate", "donate", "post", "listing", "caterer", "hotel", "restaurant"],
        "answer": (
            "🍱 **How to Post a Food Donation:**\n\n"
            "1. Go to **'Post Surplus Food'** in your dashboard.\n"
            "2. Fill in: Title, Estimated Meals, Food Category (Cooked, Bakery, Raw, Packaged).\n"
            "3. Add prep time and estimated consumption expiry (e.g., 2–3 hours for hot food).\n"
            "4. Specify pickup gate and contact person. Your listing instantly shows on the live map and notifies nearby NGOs!"
        ),
        "suggestions": ["Food storage temperatures", "How does OTP work?", "View current impact"]
    },
    {
        "keywords": ["impact", "co2", "emissions", "meals", "metrics", "stats"],
        "answer": (
            "🌱 **PlateShare Environmental & Social Impact:**\n\n"
            "- Every **1 meal saved** (~400g) prevents approx **1.0 kg of CO2 equivalent emissions** from landfill methane.\n"
            "- PlateShare connects high-volume banquet halls, hotels, and bakeries with grassroots hunger relief organizations.\n"
            "- Real-time stats are accessible via `/api/impact/stats` and plotted on our timeseries graph."
        ),
        "suggestions": ["View timeseries data", "How to post food", "Safety temperatures"]
    }
]

DEFAULT_FALLBACK = (
    "🤖 **PlateShare Food Rescue AI Assistant:**\n\n"
    "I can assist you with:\n"
    "• Safe food holding temperatures and FSSAI surplus food guidelines\n"
    "• How to post a donation or claim surplus meals\n"
    "• Step-by-step OTP pickup verification\n"
    "• Environmental impact (CO2 offset and meal statistics)\n\n"
    "Feel free to ask specific questions like: *'What is the safe temperature for cooked rice?'* or *'How does OTP verification work?'*"
)

def ask_chatbot(message: str) -> Dict[str, Any]:
    """
    Intelligent food rescue assistant answering queries about food safety,
    FSSAI protocols, PlateShare workflows, and environmental impact.
    """
    query = message.lower().strip()
    
    # Check for keyword matches
    for entry in KNOWLEDGE_BASE:
        for kw in entry["keywords"]:
            if re.search(r'\b' + re.escape(kw) + r'\b', query):
                return {
                    "response": entry["answer"],
                    "suggestions": entry.get("suggestions", []),
                    "matched_topic": entry["keywords"][0]
                }
                
    return {
        "response": DEFAULT_FALLBACK,
        "suggestions": ["Safe temperatures for cooked food", "How does OTP verification work?", "FSSAI surplus food regulations", "Environmental impact calculation"],
        "matched_topic": "general"
    }
