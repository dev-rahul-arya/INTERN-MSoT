import { motion } from 'framer-motion';
import { WeatherIcon } from './WeatherIcon';
import { WeatherData, getWeatherDescription } from '@/services/weatherApi';

interface CurrentWeatherProps {
  weather: WeatherData;
  locationName: string;
}

export function CurrentWeather({ weather, locationName }: CurrentWeatherProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-medium text-foreground/80 mb-6"
      >
        {locationName}
      </motion.h2>
      
      <div className="flex justify-center mb-4">
        <WeatherIcon 
          code={weather.weatherCode} 
          isDay={weather.isDay} 
          size={80} 
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-2"
      >
        <span className="text-8xl font-light tracking-tighter text-foreground">
          {weather.temperature}
        </span>
        <span className="text-4xl font-light text-muted-foreground align-top">°C</span>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-muted-foreground mb-2"
      >
        {getWeatherDescription(weather.weatherCode)}
      </motion.p>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-muted-foreground"
      >
        Feels like {weather.feelsLike}°C
      </motion.p>
    </motion.div>
  );
}
