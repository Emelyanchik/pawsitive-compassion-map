import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/contexts/MapContext';
import { AreaLabel } from '@/contexts/MapContext';

interface AreaLabelsLayerProps {
  map: mapboxgl.Map | null;
}

const AreaLabelsLayer: React.FC<AreaLabelsLayerProps> = ({ map }) => {
  const { areaLabels } = useMap();
  
  useEffect(() => {
    if (!map || areaLabels.length === 0) return;

    // Wait for the map's style to load before adding layers
    const addLayersWhenReady = () => {
      // Remove existing layers and sources first
      if (map.getLayer('area-labels-fill')) {
        map.removeLayer('area-labels-fill');
      }
      if (map.getLayer('area-labels-outline')) {
        map.removeLayer('area-labels-outline');
      }
      if (map.getLayer('area-labels-symbol')) {
        map.removeLayer('area-labels-symbol');
      }
      if (map.getSource('area-labels')) {
        map.removeSource('area-labels');
      }

      // Create features from area labels
      const features = areaLabels.map(area => {
        const coordinates = area.coordinates;
        
        // Close the polygon by adding the first point at the end
        if (coordinates.length >= 3 && 
            (coordinates[0][0] !== coordinates[coordinates.length - 1][0] || 
             coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
          coordinates.push(coordinates[0]);
        }

        // Calculate center point for the label
        const centerLng = coordinates.reduce((sum, point) => sum + point[0], 0) / coordinates.length;
        const centerLat = coordinates.reduce((sum, point) => sum + point[1], 0) / coordinates.length;

        return {
          type: 'Feature' as const,
          properties: {
            id: area.id,
            label: area.label,
            description: area.description
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [coordinates]
          },
          center: [centerLng, centerLat]
        };
      });

      // Create separate features for labels at center points
      const labelFeatures = areaLabels.map(area => {
        const coordinates = area.coordinates;
        const centerLng = coordinates.reduce((sum, point) => sum + point[0], 0) / coordinates.length;
        const centerLat = coordinates.reduce((sum, point) => sum + point[1], 0) / coordinates.length;

        return {
          type: 'Feature' as const,
          properties: {
            id: area.id,
            label: area.label,
            description: area.description
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [centerLng, centerLat]
          }
        };
      });

      // Add source for polygons
      map.addSource('area-labels', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        }
      });

      // Add source for label points
      map.addSource('area-labels-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: labelFeatures
        }
      });

      // Add fill layer
      map.addLayer({
        id: 'area-labels-fill',
        type: 'fill',
        source: 'area-labels',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#90cdf4',  // Lighter blue when hovered
            '#3182ce'   // Regular blue
          ],
          'fill-opacity': 0.2
        }
      });

      // Add outline layer
      map.addLayer({
        id: 'area-labels-outline',
        type: 'line',
        source: 'area-labels',
        paint: {
          'line-color': '#3182ce',
          'line-width': 2
        }
      });

      // Add symbol layer for text labels
      map.addLayer({
        id: 'area-labels-symbol',
        type: 'symbol',
        source: 'area-labels-points',
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 12,
          'text-anchor': 'center',
          'text-offset': [0, 0],
          'text-allow-overlap': false,
          'text-ignore-placement': false
        },
        paint: {
          'text-color': '#1a202c',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5
        }
      });

      // Set up interactions
      let hoveredStateId: string | null = null;

      map.on('mousemove', 'area-labels-fill', (e) => {
        if (e.features && e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: 'area-labels', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].properties?.id || null;
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: 'area-labels', id: hoveredStateId },
              { hover: true }
            );
          }
          map.getCanvas().style.cursor = 'pointer';
        }
      });

      map.on('mouseleave', 'area-labels-fill', () => {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: 'area-labels', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
        map.getCanvas().style.cursor = '';
      });
    };

    // If the style is already loaded, add layers immediately
    if (map.isStyleLoaded()) {
      addLayersWhenReady();
    } else {
      // Otherwise, wait for the style.load event
      map.once('style.load', addLayersWhenReady);
    }

    // Clean up on unmount
    return () => {
      if (map.getLayer('area-labels-fill')) map.removeLayer('area-labels-fill');
      if (map.getLayer('area-labels-outline')) map.removeLayer('area-labels-outline');
      if (map.getLayer('area-labels-symbol')) map.removeLayer('area-labels-symbol');
      if (map.getSource('area-labels')) map.removeSource('area-labels');
      if (map.getLayer('area-labels-points')) map.removeLayer('area-labels-points');
      if (map.getSource('area-labels-points')) map.removeSource('area-labels-points');
    };
  }, [map, areaLabels]);

  return null; // This is a utility component that just modifies the map
};

export default AreaLabelsLayer;
