import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, RefreshCw, Heart } from 'lucide-react';
import { SearchBar } from '@/components/weather/SearchBar';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { WeatherMetrics } from '@/components/weather/WeatherMetrics';
import { AirQuality } from '@/components/weather/AirQuality';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { FavoriteCities } from '@/components/weather/FavoriteCities';
import { 
  getWeatherData, 
  getAirQuality, 
  GeoLocation, 
  WeatherData, 
  AirQualityData,
  getWeatherBackground,
  saveFavorite,
  isFavorite,
  removeFavorite,
  getFavorites
} from '@/services/weatherApi';

const defaultLocation: GeoLocation = {
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
};

const Index = () => {
  const [location, setLocation] = useState<GeoLocation>(() => {
    const favorites = getFavorites();
    return favorites.length > 0 ? favorites[0] : defaultLocation;
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [weatherData, aqData] = await Promise.all([
        getWeatherData(lat, lon),
        getAirQuality(lat, lon),
      ]);
      
      setWeather(weatherData);
      setAirQuality(aqData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(location.latitude, location.longitude);
    setIsFav(isFavorite(location));
  }, [location]);

  const handleLocationSelect = (newLocation: GeoLocation) => {
    setLocation(newLocation);
  };

  const handleRefresh = () => {
    fetchWeatherData(location.latitude, location.longitude);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            name: 'Current Location',
            country: '',
            latitude,
            longitude,
          });
        },
        (err) => {
          console.error('Error getting location:', err);
        }
      );
    }
  };

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(location);
    } else {
      saveFavorite(location);
    }
    setIsFav(!isFav);
  };

  const backgroundClass = weather 
    ? getWeatherBackground(weather.weatherCode, weather.isDay)
    : 'weather-gradient';

  return (
    <motion.div 
      className={`min-h-screen transition-all duration-1000 ${backgroundClass}`}
      key={backgroundClass}
    >
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex items-center gap-3 w-full">
            <SearchBar 
              onLocationSelect={handleLocationSelect}
              currentLocation={location.name}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleFavorite}
              className="glass p-3 rounded-xl hover:bg-primary/10 transition-colors"
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={20} 
                className={`transition-colors ${isFav ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} 
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetCurrentLocation}
              className="glass p-3 rounded-xl hover:bg-primary/10 transition-colors"
              title="Use current location"
            >
              <MapPin size={20} className="text-primary" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="glass p-3 rounded-xl hover:bg-primary/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={20} className={`text-primary ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* Favorite Cities */}
          <FavoriteCities 
            onSelect={handleLocationSelect}
            currentLocation={location}
          />
        </motion.header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading && !weather ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading weather data...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </motion.div>
          ) : weather ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <CurrentWeather 
                weather={weather} 
                locationName={`${location.name}${location.country ? `, ${location.country}` : ''}`}
              />
              
              {(weather.hourly.length > 0 || weather.daily.length > 0) && (
                <ForecastCard 
                  hourly={weather.hourly} 
                  daily={weather.daily}
                />
              )}
              
              <WeatherMetrics weather={weather} />
              
              {airQuality && (
                <AirQuality airQuality={airQuality} />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-xs text-muted-foreground/80"
        >
          Data provided by Open-Meteo
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default Index;
