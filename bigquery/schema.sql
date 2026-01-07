CREATE TABLE weather_etl.weather_daily (
  city STRING,
  continent STRING,
  date DATE,
  hour INT64,
  temperature_c FLOAT64,
  humidity INT64,
  wind_speed FLOAT64,
  air_quality_index INT64,
  ingestion_timestamp TIMESTAMP
);
