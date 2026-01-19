import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog,
  CloudDrizzle,
  Moon,
  CloudSun,
  CloudMoon
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
  animate?: boolean;
}

export function WeatherIcon({ 
  code, 
  isDay = true, 
  size = 48, 
  className = '',
  animate = true 
}: WeatherIconProps) {
  const getIcon = () => {
    // Clear
    if (code === 0) {
      return isDay ? Sun : Moon;
    }
    // Mainly clear, partly cloudy
    if (code === 1 || code === 2) {
      return isDay ? CloudSun : CloudMoon;
    }
    // Overcast
    if (code === 3) {
      return Cloud;
    }
    // Fog
    if (code === 45 || code === 48) {
      return CloudFog;
    }
    // Drizzle
    if (code >= 51 && code <= 55) {
      return CloudDrizzle;
    }
    // Rain
    if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
      return CloudRain;
    }
    // Snow
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return CloudSnow;
    }
    // Thunderstorm
    if (code >= 95) {
      return CloudLightning;
    }
    
    return Cloud;
  };
  
  const Icon = getIcon();
  
  const getIconColor = () => {
    if (code === 0) return isDay ? 'text-accent' : 'text-secondary-foreground';
    if (code === 1 || code === 2) return 'text-primary';
    if (code >= 95) return 'text-accent';
    return 'text-muted-foreground';
  };
  
  return (
    <motion.div
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      <Icon 
        size={size} 
        className={`${getIconColor()} ${animate ? 'animate-float' : ''}`}
        strokeWidth={1.5}
      />
    </motion.div>
  );
}
