import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { HourlyForecast, DailyForecast } from '@/services/weatherApi';

interface ForecastCardProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export function ForecastCard({ hourly, daily }: ForecastCardProps) {
  const [activeTab, setActiveTab] = useState<'hourly' | 'weekly'>('hourly');

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isCurrentHour = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    return date.getHours() === now.getHours();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.3 }}
      className="glass rounded-2xl p-5"
    >
      {/* Toggle Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          {activeTab === 'hourly' ? <Clock size={16} /> : <Calendar size={16} />}
          <span className="text-xs uppercase tracking-wide font-medium">
            {activeTab === 'hourly' ? 'Hourly' : 'Weekly'} Forecast
          </span>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-muted/50 rounded-full p-1">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              activeTab === 'hourly'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              activeTab === 'weekly'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'hourly' ? (
          <motion.div
            key="hourly"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
          >
            {hourly.map((hour, index) => (
              <motion.div
                key={hour.time}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex flex-col items-center gap-2 min-w-[60px] py-3 px-2 rounded-xl transition-colors ${
                  isCurrentHour(hour.time) ? 'bg-primary/10' : ''
                }`}
              >
                <span className={`text-xs font-medium ${
                  isCurrentHour(hour.time) ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {isCurrentHour(hour.time) ? 'Now' : formatTime(hour.time)}
                </span>
                <WeatherIcon 
                  code={hour.weatherCode} 
                  size={24} 
                  animate={false}
                  isDay={true}
                />
                <span className="text-sm font-semibold text-foreground">
                  {hour.temperature}°
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {daily.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between py-2 px-3 rounded-xl transition-colors ${
                  index === 0 ? 'bg-primary/10' : 'hover:bg-muted/30'
                }`}
              >
                <span className={`text-sm font-medium w-20 ${
                  index === 0 ? 'text-primary' : 'text-foreground'
                }`}>
                  {formatDay(day.date)}
                </span>
                <WeatherIcon 
                  code={day.weatherCode} 
                  size={24} 
                  animate={false}
                  isDay={true}
                />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground w-8 text-right">
                    {day.temperatureMax}°
                  </span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
                      style={{ 
                        width: `${((day.temperatureMax - day.temperatureMin) / 30) * 100}%`,
                        marginLeft: `${((day.temperatureMin + 10) / 50) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {day.temperatureMin}°
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
