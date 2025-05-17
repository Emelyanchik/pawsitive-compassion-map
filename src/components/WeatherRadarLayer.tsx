
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface WeatherRadarLayerProps {
  map: mapboxgl.Map | null;
  visible: boolean;
  type: 'radar' | 'satellite' | null;
}

const WeatherRadarLayer: React.FC<WeatherRadarLayerProps> = ({ map, visible, type }) => {
  const [isLayerAdded, setIsLayerAdded] = useState(false);
  
  useEffect(() => {
    if (!map || !type) return;
    
    const addRadarLayer = () => {
      // Remove any existing radar layers first
      removeRadarLayer();
      
      // In a real application, you would use actual weather radar tiles from a service like:
      // - OpenWeatherMap
      // - AccuWeather
      // - RainViewer
      // - Weather.gov (US only)
      
      // For this demo, we'll create a simple visual representation
      // In a real app, you would have a URL like:
      // https://api.weather.com/v1/radar/{timestamp}/{z}/{x}/{y}.png?apiKey=yourkey
      
      // Adding a mock radar layer
      if (type === 'radar') {
        map.addSource('weather-radar', {
          type: 'image',
          url: 'https://www.weather.gov/images/srh/gis/rad_con.png', // Example URL - would be dynamic in real app
          coordinates: [
            [-130, 55], // Top left [lng, lat]
            [-65, 55],  // Top right [lng, lat]
            [-65, 25],  // Bottom right [lng, lat]
            [-130, 25]  // Bottom left [lng, lat]
          ]
        });
        
        map.addLayer({
          id: 'weather-radar-layer',
          type: 'raster',
          source: 'weather-radar',
          paint: {
            'raster-opacity': 0.6,
            'raster-fade-duration': 0
          }
        });
      } else if (type === 'satellite') {
        // Adding a mock satellite layer
        map.addSource('weather-satellite', {
          type: 'raster',
          tiles: [
            // These would be actual satellite image tiles in a real app
            'https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=yourapikey'
          ],
          tileSize: 256
        });
        
        map.addLayer({
          id: 'weather-satellite-layer',
          type: 'raster',
          source: 'weather-satellite',
          paint: {
            'raster-opacity': 0.7
          }
        });
      }
      
      setIsLayerAdded(true);
    };
    
    const removeRadarLayer = () => {
      // Remove existing radar layers
      if (map.getLayer('weather-radar-layer')) {
        map.removeLayer('weather-radar-layer');
      }
      if (map.getSource('weather-radar')) {
        map.removeSource('weather-radar');
      }
      
      // Remove existing satellite layers
      if (map.getLayer('weather-satellite-layer')) {
        map.removeLayer('weather-satellite-layer');
      }
      if (map.getSource('weather-satellite')) {
        map.removeSource('weather-satellite');
      }
      
      setIsLayerAdded(false);
    };
    
    // Add or remove radar layer based on visibility
    if (visible && !isLayerAdded) {
      if (map.isStyleLoaded()) {
        addRadarLayer();
      } else {
        map.once('style.load', addRadarLayer);
      }
    } else if (!visible && isLayerAdded) {
      removeRadarLayer();
    }
    
    return () => {
      if (map && isLayerAdded) {
        removeRadarLayer();
      }
    };
  }, [map, visible, type, isLayerAdded]);
  
  return null; // This component just modifies the map
};

export default WeatherRadarLayer;
