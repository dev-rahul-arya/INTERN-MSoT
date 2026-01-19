import { motion } from 'framer-motion';
import { Droplets, Wind, Sun, Eye, Gauge, Navigation } from 'lucide-react';
import { WeatherData } from '@/services/weatherApi';

interface WeatherMetricsProps {
  weather: WeatherData;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  delay: number;
}

function MetricCard({ icon, label, value, subValue, delay }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass rounded-2xl p-4 flex flex-col"
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        {icon}
        <span className="text-xs uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {subValue && (
        <p className="text-sm text-muted-foreground mt-1">{subValue}</p>
      )}
    </motion.div>
  );
}

export function WeatherMetrics({ weather }: WeatherMetricsProps) {
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getUvLevel = (uv: number): string => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <MetricCard
        icon={<Droplets size={16} />}
        label="Humidity"
        value={`${weather.humidity}%`}
        delay={0.1}
      />
      <MetricCard
        icon={<Wind size={16} />}
        label="Wind"
        value={`${weather.windSpeed} km/h`}
        subValue={getWindDirection(weather.windDirection)}
        delay={0.15}
      />
      <MetricCard
        icon={<Sun size={16} />}
        label="UV Index"
        value={weather.uvIndex.toString()}
        subValue={getUvLevel(weather.uvIndex)}
        delay={0.2}
      />
      <MetricCard
        icon={<Eye size={16} />}
        label="Visibility"
        value={`${weather.visibility} km`}
        delay={0.25}
      />
      <MetricCard
        icon={<Gauge size={16} />}
        label="Pressure"
        value={`${weather.pressure} hPa`}
        delay={0.3}
      />
      <MetricCard
        icon={<Navigation size={16} style={{ transform: `rotate(${weather.windDirection}deg)` }} />}
        label="Wind Direction"
        value={`${weather.windDirection}°`}
        subValue={getWindDirection(weather.windDirection)}
        delay={0.35}
      />
    </div>
  );
}
