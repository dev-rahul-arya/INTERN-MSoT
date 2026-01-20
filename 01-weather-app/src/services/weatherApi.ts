export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  weatherCode: number;
  isDay: boolean;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

export interface GeoLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  
  const data = await response.json();
  
  if (!data.results) return [];
  
  return data.results.map((result: any) => ({
    name: result.name,
    country: result.country || '',
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
  );
  
  const data = await response.json();
  const current = data.current;
  
  // Get next 12 hours of forecast
  const currentHour = new Date().getHours();
  const hourlyForecasts: HourlyForecast[] = [];
  
  for (let i = currentHour; i < currentHour + 12 && i < 24; i++) {
    hourlyForecasts.push({
      time: data.hourly.time[i],
      temperature: Math.round(data.hourly.temperature_2m[i]),
      weatherCode: data.hourly.weather_code[i],
    });
  }

  // Get 7-day forecast
  const dailyForecasts: DailyForecast[] = data.daily.time.map((date: string, index: number) => ({
    date,
    temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
    temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
    weatherCode: data.daily.weather_code[index],
  }));
  
  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: current.wind_direction_10m,
    uvIndex: Math.round(current.uv_index),
    visibility: 10,
    pressure: Math.round(current.surface_pressure),
    weatherCode: current.weather_code,
    isDay: current.is_day === 1,
    hourly: hourlyForecasts,
    daily: dailyForecasts,
  };
}

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone`
  );
  
  const data = await response.json();
  const current = data.current;
  
  return {
    aqi: current.us_aqi || 0,
    pm25: Math.round(current.pm2_5 || 0),
    pm10: Math.round(current.pm10 || 0),
    no2: Math.round(current.nitrogen_dioxide || 0),
    o3: Math.round(current.ozone || 0),
  };
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };
  
  return descriptions[code] || 'Unknown';
}

export function getAqiLevel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: 'Good', color: 'aqi-good' };
  if (aqi <= 100) return { label: 'Moderate', color: 'aqi-moderate' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'aqi-unhealthy' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'aqi-very-unhealthy' };
  return { label: 'Hazardous', color: 'aqi-hazardous' };
}

export function getWeatherBackground(code: number, isDay: boolean): string {
  // Clear
  if (code === 0 || code === 1) {
    return isDay ? 'weather-bg-clear-day' : 'weather-bg-clear-night';
  }
  // Partly cloudy / Overcast
  if (code === 2 || code === 3) {
    return 'weather-bg-cloudy';
  }
  // Fog
  if (code === 45 || code === 48) {
    return 'weather-bg-cloudy';
  }
  // Drizzle / Rain
  if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
    return 'weather-bg-rainy';
  }
  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return 'weather-bg-snowy';
  }
  // Thunderstorm
  if (code >= 95) {
    return 'weather-bg-stormy';
  }
  
  return isDay ? 'weather-bg-clear-day' : 'weather-bg-clear-night';
}

// Favorite cities storage
const FAVORITES_KEY = 'weather-app-favorites';

export function getFavorites(): GeoLocation[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorite(location: GeoLocation): void {
  const favorites = getFavorites();
  const exists = favorites.some(
    f => f.latitude === location.latitude && f.longitude === location.longitude
  );
  if (!exists) {
    favorites.push(location);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(location: GeoLocation): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(
    f => !(f.latitude === location.latitude && f.longitude === location.longitude)
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isFavorite(location: GeoLocation): boolean {
  const favorites = getFavorites();
  return favorites.some(
    f => f.latitude === location.latitude && f.longitude === location.longitude
  );
}
