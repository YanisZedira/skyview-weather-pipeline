from transform.transform_data import transform_weather
from datetime import datetime, timezone

def test_transform_weather_format():
    weather = {
        "main": {"temp": 300, "humidity": 50},
        "wind": {"speed": 3.5}
    }
    air = {
        "list": [{"main": {"aqi": 2}}]
    }
    city = {
        "city": "Paris",
        "continent": "Europe"
    }
    now = datetime.now(timezone.utc)

    result = transform_weather(weather, air, city, now)

    assert "temperature_c" in result
    assert result["city"] == "Paris"
    assert isinstance(result["temperature_c"], float)
