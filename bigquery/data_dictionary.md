# Data Dictionary — weather_daily

| Column name | Type | Description | Example |
|------------|------|-------------|---------|
| city | STRING | Name of the city | Paris |
| continent | STRING | Continent where the city is located | Europe |
| date | DATE | Date of data collection | 2026-01-08 |
| hour | INT64 | Hour of collection (UTC) | 12 |
| temperature_c | FLOAT64 | Temperature in Celsius | 18.5 |
| humidity | INT64 | Humidity percentage | 72 |
| wind_speed | FLOAT64 | Wind speed in meters per second | 4.2 |
| air_quality_index | INT64 | Air Quality Index (1–5) | 3 |
| ingestion_timestamp | TIMESTAMP | Ingestion time in BigQuery | 2026-01-08T12:00:01Z |
