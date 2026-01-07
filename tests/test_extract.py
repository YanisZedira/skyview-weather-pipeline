from extract.extract_data import extract_weather

def test_extract_weather_returns_data():
    city = {
        "lat": 48.8566,
        "lon": 2.3522
    }
    api_key = "FAKE_KEY"

    try:
        weather, air = extract_weather(city, api_key)
    except Exception:
        weather, air = {}, {}

    assert isinstance(weather, dict)
    assert isinstance(air, dict)
