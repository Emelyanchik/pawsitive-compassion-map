
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/contexts/MapContext';

interface MapClusterLayerProps {
  map: mapboxgl.Map | null;
}

const MapClusterLayer: React.FC<MapClusterLayerProps> = ({ map }) => {
  const sourceAdded = useRef(false);
  const { filteredAnimals } = useMap();

  useEffect(() => {
    if (!map || !map.isStyleLoaded() || sourceAdded.current) return;
    
    map.on('load', () => {
      // Check if the source already exists
      if (map.getSource('animals')) return;
      
      // Add the animals source as a GeoJSON point collection
      map.addSource('animals', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points
      });
      
      // Add a layer showing the clusters
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'animals',
        filter: ['has', 'point_count'],
        paint: {
          // Size based on the number of points in the cluster
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20, // Default radius
            5, // If point_count >= 5
            25, // Radius when point_count >= 5
            10, // If point_count >= 10
            30  // Radius when point_count >= 10
          ],
          // Color based on the number of points in the cluster
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6', // Default color
            5,         // If point_count >= 5
            '#f1f075', // Color when point_count >= 5
            10,        // If point_count >= 10
            '#f28cb1'  // Color when point_count >= 10
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
      
      // Add a layer for the cluster count labels
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'animals',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });
      
      // Add a layer for unclustered points
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'animals',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'status'],
            'needs_help', '#FF4500',
            'being_helped', '#FFA500',
            'adopted', '#32CD32',
            'reported', '#9B30FF',
            '#51bbd6' // default color
          ],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
      
      // Add click event for clusters
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0]?.properties?.cluster_id;
        
        if (!clusterId) return;
        
        const source = map.getSource('animals') as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            
            const coordinates = (features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
            
            // Zoom in to the cluster
            map.flyTo({
              center: coordinates,
              zoom: zoom
            });
          }
        );
      });
      
      // Change cursor when hovering over clusters or points
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });
      
      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
      });
      
      sourceAdded.current = true;
    });
  }, [map]);
  
  // Update the GeoJSON data when filtered animals change
  useEffect(() => {
    if (!map || !sourceAdded.current) return;
    
    const source = map.getSource('animals') as mapboxgl.GeoJSONSource;
    if (!source) return;
    
    // Convert animals to GeoJSON features
    const features = filteredAnimals.map(animal => ({
      type: 'Feature' as const,
      properties: {
        id: animal.id,
        name: animal.name,
        type: animal.type,
        status: animal.status,
        description: animal.description
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [animal.longitude, animal.latitude]
      }
    }));
    
    // Update the GeoJSON source
    source.setData({
      type: 'FeatureCollection',
      features
    });
  }, [map, filteredAnimals]);
  
  return null; // This component doesn't render anything visible
};

export default MapClusterLayer;
