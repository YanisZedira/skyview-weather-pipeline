// Configuration des API
const OPENWEATHER_API_KEY = 'dcc41ba5eea1fc4d1f5d51168dfd4d4a';
const OPENAQ_API_KEY = '696cd62f43185652853fd28c3f49fe289291874fee3cb977302eae6c2dd6d2e3';

// Variables globales
let map;
let markers = [];
let currentLat, currentLon;

// ========================================
// INITIALISATION DE LA CARTE
// ========================================

function initMap(lat = 48.8566, lon = 2.3522) {
    if (map) {
        map.remove();
    }

    map = L.map('map').setView([lat, lon], 10);

    // Carte de base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Couche température
    L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`, {
        opacity: 0.6,
        attribution: 'OpenWeather'
    }).addTo(map);

    // Couche précipitations
    L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`, {
        opacity: 0.5,
        attribution: 'OpenWeather'
    }).addTo(map);

    // Couche nuages
    L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`, {
        opacity: 0.3,
        attribution: 'OpenWeather'
    }).addTo(map);

    // Marqueur position actuelle
    L.marker([lat, lon]).addTo(map)
        .bindPopup('📍 Votre position')
        .openPopup();

    // Ajouter les grandes villes
    addCityMarkers();
}

// ========================================
// MARQUEURS DES GRANDES VILLES
// ========================================

async function addCityMarkers() {
    const cities = [
        { name: 'Paris', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
        { name: 'Londres', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
        { name: 'New York', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093, flag: '🇦🇺' },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' },
        { name: 'Moscow', lat: 55.7558, lon: 37.6173, flag: '🇷🇺' },
        { name: 'Rio', lat: -22.9068, lon: -43.1729, flag: '🇧🇷' },
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777, flag: '🇮🇳' },
        { name: 'Beijing', lat: 39.9042, lon: 116.4074, flag: '🇨🇳' }
    ];

    for (const city of cities) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
            );
            const data = await response.json();

            const temp = Math.round(data.main.temp);
            const icon = data.weather[0].icon;
            
            const customIcon = L.divIcon({
                html: `
                    <div style="
                        background: rgba(255,255,255,0.95);
                        padding: 8px 12px;
                        border-radius: 12px;
                        text-align: center;
                        font-weight: bold;
                        color: #333;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                        border: 2px solid ${temp > 25 ? '#ff6b6b' : temp > 15 ? '#ffd93d' : '#6bcbff'};
                    ">
                        <div style="font-size: 18px;">${temp}°C</div>
                        <div style="font-size: 10px; opacity: 0.8;">${city.flag}</div>
                    </div>
                `,
                className: 'weather-marker',
                iconSize: [70, 50]
            });

            const marker = L.marker([city.lat, city.lon], { icon: customIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="text-align: center; min-width: 150px;">
                        <h3>${city.flag} ${city.name}</h3>
                        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" style="width: 60px;">
                        <p style="font-size: 24px; margin: 5px 0;"><b>${temp}°C</b></p>
                        <p style="text-transform: capitalize;">${data.weather[0].description}</p>
                        <p>💧 ${data.main.humidity}% | 💨 ${Math.round(data.wind.speed * 3.6)} km/h</p>
                    </div>
                `);

            markers.push(marker);
        } catch (error) {
            console.error(`Erreur pour ${city.name}:`, error);
        }
    }
}

// ========================================
// DONNÉES MÉTÉO
// ========================================

async function getWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
            getForecast(lat, lon);
            getAirQuality(lat, lon);
            getPopulation(data.name, data.sys.country);
        }
    } catch (error) {
        console.error('Erreur météo:', error);
        showError('Impossible de charger les données météo');
    }
}

// ========================================
// AFFICHAGE MÉTÉO
// ========================================

function displayWeather(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('weatherMain').innerHTML = `
        <div class="city-name">${data.name}, ${data.sys.country}</div>
        <img src="${iconUrl}" alt="weather icon" style="width: 150px; height: 150px;">
        <div class="weather-description">${data.weather[0].description}</div>
        <div class="temperature">${temp}°C</div>
        
        <div class="weather-details">
            <div class="detail-item">
                <i class="fas fa-temperature-high"></i>
                <div class="detail-label">Ressenti</div>
                <div class="detail-value">${feelsLike}°C</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-tint"></i>
                <div class="detail-label">Humidité</div>
                <div class="detail-value">${data.main.humidity}%</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-wind"></i>
                <div class="detail-label">Vent</div>
                <div class="detail-value">${Math.round(data.wind.speed * 3.6)} km/h</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-compress-arrows-alt"></i>
                <div class="detail-label">Pression</div>
                <div class="detail-value">${data.main.pressure} hPa</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-eye"></i>
                <div class="detail-label">Visibilité</div>
                <div class="detail-value">${(data.visibility / 1000).toFixed(1)} km</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-cloud"></i>
                <div class="detail-label">Nuages</div>
                <div class="detail-value">${data.clouds.all}%</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-sunrise"></i>
                <div class="detail-label">Lever du soleil</div>
                <div class="detail-value">${sunrise}</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-sunset"></i>
                <div class="detail-label">Coucher du soleil</div>
                <div class="detail-value">${sunset}</div>
            </div>
            ${data.rain ? `
            <div class="detail-item">
                <i class="fas fa-cloud-rain"></i>
                <div class="detail-label">Pluie (1h)</div>
                <div class="detail-value">${data.rain['1h'] || 0} mm</div>
            </div>
            ` : ''}
            ${data.snow ? `
            <div class="detail-item">
                <i class="fas fa-snowflake"></i>
                <div class="detail-label">Neige (1h)</div>
                <div class="detail-value">${data.snow['1h'] || 0} mm</div>
            </div>
            ` : ''}
        </div>
    `;
}

// ========================================
// PRÉVISIONS
// ========================================

async function getForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Erreur prévisions:', error);
    }
}

function displayForecast(data) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.style.display = 'block';

    const dailyData = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    const forecastHTML = dailyData.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('fr-FR', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
        });
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const temp = Math.round(day.main.temp);

        return `
            <div class="forecast-item">
                <div class="forecast-date">${dayName}</div>
                <img src="${iconUrl}" alt="weather" style="width: 50px; height: 50px;">
                <div style="text-transform: capitalize; font-size: 0.9em; margin: 5px 0;">
                    ${day.weather[0].description}
                </div>
                <div class="forecast-temp">${temp}°C</div>
                <div style="font-size: 0.85em; opacity: 0.8;">
                    <i class="fas fa-tint"></i> ${day.main.humidity}%
                </div>
                ${day.rain ? `
                <div style="font-size: 0.85em; color: #4fc3f7; margin-top: 5px;">
                    <i class="fas fa-cloud-rain"></i> ${(day.rain['3h'] || 0).toFixed(1)} mm
                </div>
                ` : ''}
                <div style="font-size: 0.85em; opacity: 0.7; margin-top: 5px;">
                    <i class="fas fa-wind"></i> ${Math.round(day.wind.speed * 3.6)} km/h
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('forecastContent').innerHTML = forecastHTML;
}

// ========================================
// QUALITÉ DE L'AIR
// ========================================

async function getAirQuality(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        
        if (data.list && data.list.length > 0) {
            displayAirQuality(data.list[0]);
        }
    } catch (error) {
        console.error('Erreur qualité de l\'air:', error);
    }
}

function displayAirQuality(data) {
    const airQualityElement = document.getElementById('airQuality');
    airQualityElement.style.display = 'block';

    const aqi = data.main.aqi;
    const aqiLabels = ['', 'Bon', 'Moyen', 'Médiocre', 'Mauvais', 'Très Mauvais'];
    const aqiClasses = ['', 'aqi-good', 'aqi-moderate', 'aqi-sensitive', 'aqi-unhealthy', 'aqi-very-unhealthy'];
    const aqiDescriptions = [
        '',
        'La qualité de l\'air est excellente',
        'La qualité de l\'air est acceptable',
        'Peut affecter les personnes sensibles',
        'Mauvais pour la santé',
        'Très mauvais pour la santé'
    ];

    const components = data.components;

    document.getElementById('airQualityContent').innerHTML = `
        <div class="air-quality">
            <div class="aqi-badge ${aqiClasses[aqi]}">
                ${aqiLabels[aqi]}
            </div>
            <p style="margin: 10px 0; opacity: 0.9;">${aqiDescriptions[aqi]}</p>
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fas fa-smog"></i>
                    <div class="detail-label">PM2.5</div>
                    <div class="detail-value">${components.pm2_5.toFixed(1)}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">μg/m³</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-cloud"></i>
                    <div class="detail-label">PM10</div>
                    <div class="detail-value">${components.pm10.toFixed(1)}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">μg/m³</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <div class="detail-label">NO₂</div>
                    <div class="detail-value">${components.no2.toFixed(1)}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">μg/m³</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-atom"></i>
                    <div class="detail-label">O₃ (Ozone)</div>
                    <div class="detail-value">${components.o3.toFixed(1)}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">μg/m³</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-industry"></i>
                    <div class="detail-label">CO</div>
                    <div class="detail-value">${components.co.toFixed(1)}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">μg/m³</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-fire"></i>
                    <div class="detail-label">SO₂</div>
                    <div class="detail-value">${components.so2.toFixed(1)}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">μg/m³</div>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// POPULATION
// ========================================

async function getPopulation(city, country) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${country}`);
        const data = await response.json();
        
        if (data && data[0]) {
            const countryData = data[0];
            const populationInfo = `
                <div class="population-info">
                    <h3><i class="fas fa-flag"></i> ${countryData.name.common}</h3>
                    <div class="weather-details" style="margin-top: 15px;">
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <div class="detail-label">Population</div>
                            <div class="detail-value">${(countryData.population / 1000000).toFixed(2)}M</div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-city"></i>
                            <div class="detail-label">Capitale</div>
                            <div class="detail-value" style="font-size: 1.2em;">${countryData.capital ? countryData.capital[0] : 'N/A'}</div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-globe"></i>
                            <div class="detail-label">Région</div>
                            <div class="detail-value" style="font-size: 1.2em;">${countryData.region}</div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map"></i>
                            <div class="detail-label">Sous-région</div>
                            <div class="detail-value" style="font-size: 1.2em;">${countryData.subregion || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('weatherMain').innerHTML += populationInfo;
        }
    } catch (error) {
        console.error('Erreur population:', error);
    }
}

// ========================================
// RECHERCHE
// ========================================

async function searchCity() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert('Veuillez entrer une ville');
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();

        if (data.cod === 200) {
            currentLat = data.coord.lat;
            currentLon = data.coord.lon;
            getWeatherData(currentLat, currentLon);
            initMap(currentLat, currentLon);
            document.getElementById('suggestions').innerHTML = '';
        } else {
            alert('Ville non trouvée. Essayez une autre recherche.');
        }
    } catch (error) {
        console.error('Erreur recherche:', error);
        alert('Erreur lors de la recherche. Veuillez réessayer.');
    }
}

// ========================================
// SUGGESTIONS
// ========================================

document.getElementById('cityInput').addEventListener('input', async (e) => {
    const value = e.target.value.trim();
    if (value.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${OPENWEATHER_API_KEY}`
        );
        const cities = await response.json();

        if (cities.length > 0) {
            const suggestionsHTML = cities.map(city => `
                <div class="suggestion-item" onclick="selectCity(${city.lat}, ${city.lon}, '${city.name}, ${city.country}')">
                    📍 ${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}
                </div>
            `).join('');

            document.getElementById('suggestions').innerHTML = suggestionsHTML;
        }
    } catch (error) {
        console.error('Erreur suggestions:', error);
    }
});

function selectCity(lat, lon, name) {
    currentLat = lat;
    currentLon = lon;
    document.getElementById('cityInput').value = name;
    document.getElementById('suggestions').innerHTML = '';
    getWeatherData(lat, lon);
    initMap(lat, lon);
}

// Touche Entrée pour rechercher
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// ========================================
// GESTION DES ERREURS
// ========================================

function showError(message) {
    document.getElementById('weatherMain').innerHTML = `
        <div class="loading" style="color: #ff6b6b;">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

// ========================================
// INITIALISATION
// ========================================

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                getWeatherData(currentLat, currentLon);
                initMap(currentLat, currentLon);
            },
            (error) => {
                console.log('Géolocalisation refusée, utilisation de Paris');
                currentLat = 48.8566;
                currentLon = 2.3522;
                getWeatherData(currentLat, currentLon);
                initMap(currentLat, currentLon);
            }
        );
    } else {
        currentLat = 48.8566;
        currentLon = 2.3522;
        getWeatherData(currentLat, currentLon);
        initMap(currentLat, currentLon);
    }
};

// Rafraîchissement automatique toutes les 10 minutes
setInterval(() => {
    if (currentLat && currentLon) {
        getWeatherData(currentLat, currentLon);
    }
}, 600000);