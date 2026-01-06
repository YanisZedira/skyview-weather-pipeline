import requests
from datetime import datetime, timezone
from google.cloud import bigquery

PROJECT_ID = "skyview-air-1767618956"
DATASET_ID = "weather_etl"
TABLE_ID = "weather_daily"
OPENWEATHER_API_KEY = "CLE_API"

CITIES = [
    # EUROPE
    {"continent": "Europe", "city": "Paris", "lat": 48.8566, "lon": 2.3522},
    {"continent": "Europe", "city": "London", "lat": 51.5074, "lon": -0.1278},
    {"continent": "Europe", "city": "Berlin", "lat": 52.5200, "lon": 13.4050},

    # NORTH AMERICA
    {"continent": "North America", "city": "New York", "lat": 40.7128, "lon": -74.0060},
    {"continent": "North America", "city": "Los Angeles", "lat": 34.0522, "lon": -118.2437},
    {"continent": "North America", "city": "Toronto", "lat": 43.6532, "lon": -79.3832},

    # SOUTH AMERICA
    {"continent": "South America", "city": "Sao Paulo", "lat": -23.5505, "lon": -46.6333},
    {"continent": "South America", "city": "Buenos Aires", "lat": -34.6037, "lon": -58.3816},
    {"continent": "South America", "city": "Lima", "lat": -12.0464, "lon": -77.0428},

    # AFRICA
    {"continent": "Africa", "city": "Lagos", "lat": 6.5244, "lon": 3.3792},
    {"continent": "Africa", "city": "Cairo", "lat": 30.0444, "lon": 31.2357},
    {"continent": "Africa", "city": "Johannesburg", "lat": -26.2041, "lon": 28.0473},
    {"continent": "Africa", "city": "Algiers", "lat": 36.7538, "lon": 3.0588},
    {"continent": "Africa", "city": "Oran", "lat": 35.6971, "lon": -0.6308},
    {"continent": "Africa", "city": "Khenchela", "lat": 35.4358, "lon": 7.1433},

    # ASIA
    {"continent": "Asia", "city": "Tokyo", "lat": 35.6895, "lon": 139.6917},
    {"continent": "Asia", "city": "Shanghai", "lat": 31.2304, "lon": 121.4737},
    {"continent": "Asia", "city": "Mumbai", "lat": 19.0760, "lon": 72.8777},
    {"continent": "Asia", "city": "Jeddah", "lat": 21.4858, "lon": 39.1925},

    # OCEANIA
    {"continent": "Oceania", "city": "Sydney", "lat": -33.8688, "lon": 151.2093},
    {"continent": "Oceania", "city": "Melbourne", "lat": -37.8136, "lon": 144.9631},
    {"continent": "Oceania", "city": "Auckland", "lat": -36.8509, "lon": 174.7645}
]

def collect_weather(request):
    client = bigquery.Client()
    rows = []

    now = datetime.now(timezone.utc)

    for c in CITIES:
        weather = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={c['lat']}&lon={c['lon']}&appid={OPENWEATHER_API_KEY}"
        ).json()

        air = requests.get(
            f"https://api.openweathermap.org/data/2.5/air_pollution?lat={c['lat']}&lon={c['lon']}&appid={OPENWEATHER_API_KEY}"
        ).json()

        rows.append({
            "city": c["city"],
            "continent": c["continent"],
            "date": str(now.date()),
            "hour": now.hour,
            "temperature_c": round(weather["main"]["temp"] - 273.15, 2),
            "humidity": weather["main"]["humidity"],
            "wind_speed": weather["wind"]["speed"],
            "air_quality_index": air["list"][0]["main"]["aqi"],
            "ingestion_timestamp": now.isoformat()
        })

    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
    client.insert_rows_json(table_ref, rows)

    return {"status": "ok", "cities": len(rows)}, 200
