import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { GeoLocation, getFavorites, removeFavorite } from '@/services/weatherApi';

interface FavoriteCitiesProps {
  onSelect: (location: GeoLocation) => void;
  currentLocation: GeoLocation;
}

export function FavoriteCities({ onSelect, currentLocation }: FavoriteCitiesProps) {
  const [favorites, setFavorites] = useState<GeoLocation[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
  }, [currentLocation]);

  const handleRemove = (e: React.MouseEvent, location: GeoLocation) => {
    e.stopPropagation();
    removeFavorite(location);
    setFavorites(getFavorites());
  };

  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-destructive fill-destructive" />
          <span className="text-sm font-medium text-foreground">
            Favorites ({favorites.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={18} className="text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2">
              {favorites.map((location, index) => {
                const isActive = 
                  location.latitude === currentLocation.latitude && 
                  location.longitude === currentLocation.longitude;

                return (
                  <motion.button
                    key={`${location.latitude}-${location.longitude}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelect(location)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors group ${
                      isActive ? 'bg-primary/10' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`}>
                        {location.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {location.country}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleRemove(e, location)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded-full transition-all"
                    >
                      <X size={14} className="text-destructive" />
                    </button>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
