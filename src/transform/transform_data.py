from datetime import timezone

def transform_weather(weather, air, city, now):
    return {
        "city": city["city"],
        "continent": city["continent"],
        "date": str(now.date()),
        "hour": now.hour,
        "temperature_c": round(weather["main"]["temp"] - 273.15, 2),
        "humidity": weather["main"]["humidity"],
        "wind_speed": weather["wind"]["speed"],
        "air_quality_index": air["list"][0]["main"]["aqi"],
        "ingestion_timestamp": now.isoformat()
    }
