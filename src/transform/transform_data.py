from utils.logger import get_logger

logger = get_logger("TRANSFORM")

def transform_weather(weather, air, city, now):
    try:
        if weather is None or air is None:
            raise ValueError("Missing input data")

        row = {
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

        logger.info(f"Data transformed for {city['city']}")
        return row

    except Exception as e:
        logger.error(f"Transform failed for {city['city']} - {e}")
        return None
