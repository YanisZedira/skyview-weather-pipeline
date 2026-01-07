import requests

def extract_weather(city, api_key):
    weather = requests.get(
        f"https://api.openweathermap.org/data/2.5/weather?lat={city['lat']}&lon={city['lon']}&appid={api_key}"
    ).json()

    air = requests.get(
        f"https://api.openweathermap.org/data/2.5/air_pollution?lat={city['lat']}&lon={city['lon']}&appid={api_key}"
    ).json()

    return weather, air
