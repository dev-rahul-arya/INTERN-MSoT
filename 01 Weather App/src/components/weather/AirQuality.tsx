import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { AirQualityData, getAqiLevel } from '@/services/weatherApi';

interface AirQualityProps {
  airQuality: AirQualityData;
}

export function AirQuality({ airQuality }: AirQualityProps) {
  const { label, color } = getAqiLevel(airQuality.aqi);
  
  const getProgressWidth = () => {
    const maxAqi = 300;
    return Math.min((airQuality.aqi / maxAqi) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Wind size={16} />
        <span className="text-xs uppercase tracking-wide font-medium">Air Quality</span>
      </div>
      
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-4xl font-semibold text-foreground">{airQuality.aqi}</span>
        <span className={`text-sm font-medium text-${color}`}>{label}</span>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${getProgressWidth()}%` }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, 
              hsl(var(--aqi-good)) 0%, 
              hsl(var(--aqi-moderate)) 33%, 
              hsl(var(--aqi-unhealthy)) 66%, 
              hsl(var(--aqi-hazardous)) 100%
            )`,
          }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">PM2.5</p>
          <p className="text-sm font-medium text-foreground">{airQuality.pm25} µg/m³</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">PM10</p>
          <p className="text-sm font-medium text-foreground">{airQuality.pm10} µg/m³</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">NO₂</p>
          <p className="text-sm font-medium text-foreground">{airQuality.no2} µg/m³</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">O₃</p>
          <p className="text-sm font-medium text-foreground">{airQuality.o3} µg/m³</p>
        </div>
      </div>
    </motion.div>
  );
}
