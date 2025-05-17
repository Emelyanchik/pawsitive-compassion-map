
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';

interface MapWeatherOverlayProps {
  map: mapboxgl.Map | null;
  weatherType: 'temperature' | 'precipitation' | 'clouds' | null;
}

const MapWeatherOverlay: React.FC<MapWeatherOverlayProps> = ({ map, weatherType }) => {
  const { toast } = useToast();
  const [isOverlayAdded, setIsOverlayAdded] = useState(false);
  
  useEffect(() => {
    if (!map) return;
    
    // Remove any existing weather layers
    const removeWeatherLayers = () => {
      if (map.getLayer('weather-layer')) {
        map.removeLayer('weather-layer');
      }
      if (map.getSource('weather-source')) {
        map.removeSource('weather-source');
      }
      setIsOverlayAdded(false);
    };
    
    // Only add layer if weather type is selected
    if (weatherType) {
      const addWeatherLayer = () => {
        // Remove existing layers first
        removeWeatherLayers();
        
        // In a real app, we would fetch actual weather data from a weather API
        // For this demo, we'll create a simple visual representation
        
        // Create a gradient based on weather type
        let colors;
        let opacity = 0.6;
        
        switch (weatherType) {
          case 'temperature':
            colors = [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, ['rgba', 255, 0, 0, opacity],
              6, ['rgba', 255, 165, 0, opacity],
              12, ['rgba', 255, 255, 0, opacity],
              16, ['rgba', 173, 255, 47, opacity],
              20, ['rgba', 0, 128, 0, opacity]
            ];
            break;
          case 'precipitation':
            colors = [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, ['rgba', 255, 255, 255, opacity],
              6, ['rgba', 200, 200, 255, opacity],
              12, ['rgba', 100, 100, 255, opacity],
              16, ['rgba', 0, 0, 255, opacity],
              20, ['rgba', 0, 0, 128, opacity]
            ];
            break;
          case 'clouds':
            colors = [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, ['rgba', 255, 255, 255, opacity],
              6, ['rgba', 200, 200, 200, opacity],
              12, ['rgba', 150, 150, 150, opacity],
              16, ['rgba', 100, 100, 100, opacity],
              20, ['rgba', 50, 50, 50, opacity]
            ];
            break;
          default:
            colors = ['rgba', 0, 0, 255, opacity];
        }
        
        // In a real implementation, we would fetch GeoJSON data from a weather API
        // For demo purposes, create a simple area covering the map view
        const bounds = map.getBounds();
        const center = map.getCenter();
        const nw = bounds.getNorthWest();
        const se = bounds.getSouthEast();
        
        const weatherData = {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[
              [nw.lng, nw.lat],
              [se.lng, nw.lat],
              [se.lng, se.lat],
              [nw.lng, se.lat],
              [nw.lng, nw.lat]
            ]]
          }
        };
        
        // Add weather data source
        map.addSource('weather-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [weatherData]
          }
        });
        
        // Add weather layer
        map.addLayer({
          id: 'weather-layer',
          type: 'fill',
          source: 'weather-source',
          paint: {
            'fill-color': colors
          }
        }, 'area-labels-fill'); // Place it below area labels
        
        setIsOverlayAdded(true);
        
        // Show toast notification
        toast({
          title: `${weatherType.charAt(0).toUpperCase() + weatherType.slice(1)} Overlay Added`,
          description: "Weather data is simulated for demonstration purposes.",
          duration: 3000,
        });
      };
      
      // Ensure the map style is loaded before adding layers
      if (map.isStyleLoaded()) {
        addWeatherLayer();
      } else {
        map.once('style.load', addWeatherLayer);
      }
    } else {
      // Remove layers if weather type is null
      if (isOverlayAdded) {
        removeWeatherLayers();
        toast({
          title: "Weather Overlay Removed",
          description: "Weather data layer has been removed from the map.",
          duration: 2000,
        });
      }
    }
    
    return () => {
      // Clean up on unmount or when weather type changes
      if (map) {
        removeWeatherLayers();
      }
    };
  }, [map, weatherType, toast]);
  
  return null; // This component just modifies the map
};

export default MapWeatherOverlay;
