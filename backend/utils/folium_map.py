import folium
from typing import List, Dict, Any

def generate_donations_map_html(donations: List[Dict[str, Any]], center_lat: float = 19.0760, center_lng: float = 72.8777, zoom_start: int = 12) -> str:
    """
    Generate an interactive Leaflet map using Folium and return standalone HTML.

    Working pattern for React / Frontend:
    Folium generates standalone HTML rather than native React components.
    FastAPI serves this endpoint as an HTMLResponse, and React embeds it seamlessly via an <iframe>:
    <iframe src="http://localhost:8000/map/donations" width="100%" height="500px" style="border:none;"></iframe>
    (Alternatively, react-leaflet is the native-React alternative if direct DOM bindings are desired).
    """
    # If donations exist, center on the first donation or average
    if donations:
        valid_coords = [(d["lat"], d["lng"]) for d in donations if d.get("lat") and d.get("lng")]
        if valid_coords:
            center_lat = sum(c[0] for c in valid_coords) / len(valid_coords)
            center_lng = sum(c[1] for c in valid_coords) / len(valid_coords)

    # Initialize Folium Map with clean OpenStreetMap tiles
    fmap = folium.Map(
        location=[center_lat, center_lng],
        zoom_start=zoom_start,
        tiles="OpenStreetMap",
        control_scale=True
    )

    # Color mapping based on status
    status_colors = {
        "posted": "green",
        "claimed": "blue",
        "picked_up": "orange",
        "delivered": "purple",
        "served": "darkblue"
    }

    status_icons = {
        "posted": "cutlery",
        "claimed": "user",
        "picked_up": "truck",
        "delivered": "check",
        "served": "heart"
    }

    for d in donations:
        lat = d.get("lat")
        lng = d.get("lng")
        if lat is None or lng is None:
            continue

        status = d.get("status", "posted")
        color = status_colors.get(status, "gray")
        icon_name = status_icons.get(status, "info-sign")
        title = d.get("title", "Food Donation")
        qty = d.get("quantity", "")
        unit = d.get("unit", "meals")
        org = d.get("donor_org") or d.get("donor_name", "Anonymous Donor")
        address = d.get("address", "")
        expiry = d.get("expiry_time", "N/A")
        food_type = d.get("food_type", "Cooked")
        category = d.get("category", "")

        popup_html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px; padding: 4px;">
            <div style="font-size: 14px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">{title}</div>
            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                <span style="background-color: #ecfdf5; color: #065f46; font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 9999px;">
                    {qty} {unit}
                </span>
                <span style="background-color: #eff6ff; color: #1e40af; font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 9999px;">
                    {food_type}
                </span>
                <span style="background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 9999px;">
                    Status: {status.upper()}
                </span>
            </div>
            <div style="font-size: 12px; color: #4b5563; margin-bottom: 2px;"><b>Donor:</b> {org}</div>
            <div style="font-size: 12px; color: #4b5563; margin-bottom: 2px;"><b>Location:</b> {address}</div>
            <div style="font-size: 11px; color: #ef4444; margin-top: 4px;"><b>Expires:</b> {expiry}</div>
        </div>
        """

        folium.Marker(
            location=[lat, lng],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=f"{title} ({qty} {unit}) - Status: {status}",
            icon=folium.Icon(color=color, icon=icon_name, prefix="fa" if icon_name in ["cutlery", "truck", "heart"] else "glyphicon")
        ).add_to(fmap)

    return fmap.get_root().render()
