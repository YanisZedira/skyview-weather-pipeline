from utils.logger import get_logger
import requests

logger = get_logger("EXTRACT")

def extract_weather(city, api_key):
    try:
        weather_url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={city['lat']}&lon={city['lon']}&appid={api_key}"
        )
        air_url = (
            f"https://api.openweathermap.org/data/2.5/air_pollution"
            f"?lat={city['lat']}&lon={city['lon']}&appid={api_key}"
        )

        weather = requests.get(weather_url, timeout=10).json()
        air = requests.get(air_url, timeout=10).json()

        logger.info(f"Weather data extracted for {city['city']}")
        return weather, air

    except Exception as e:
        logger.error(f"Extract failed for {city['city']} - {e}")
        return None, None
