
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from '../contexts/MapContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Compass, MapPin, Plus, Minus } from 'lucide-react';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const { 
    animals, 
    filter, 
    selectedAnimal, 
    setSelectedAnimal, 
    mapboxToken,
    setMapboxToken
  } = useMap();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapTokenInput, setMapTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const setupMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation || [0, 51.5],
        zoom: 12,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      map.current.on('load', () => {
        setIsMapReady(true);
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Failed to initialize the map. Please check your Mapbox token.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Default to London if user location not available
          setUserLocation([-0.127, 51.507]);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (mapboxToken && userLocation && !map.current) {
      setupMap();
    }
  }, [mapboxToken, userLocation]);

  useEffect(() => {
    if (!isMapReady || !map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add filtered markers to map
    const filteredAnimals = animals.filter(animal => {
      if (filter === 'all') return true;
      if (filter === 'cats') return animal.type === 'cat';
      if (filter === 'dogs') return animal.type === 'dog';
      return false;
    });

    filteredAnimals.forEach(animal => {
      const el = document.createElement('div');
      el.className = 'animal-marker';
      
      // Set background based on animal type and status
      const statusColors = {
        needs_help: '#FF4500',
        being_helped: '#FFA500',
        adopted: '#32CD32',
        reported: '#9B30FF'
      };
      
      el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${statusColors[animal.status]}' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E")`;

      // Create and add the marker to the map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([animal.longitude, animal.latitude])
        .addTo(map.current!);

      // Add click event to show animal details
      marker.getElement().addEventListener('click', () => {
        setSelectedAnimal(animal);
        map.current?.flyTo({
          center: [animal.longitude, animal.latitude],
          zoom: 15,
          duration: 1000
        });
      });

      markersRef.current[animal.id] = marker;
    });
  }, [animals, filter, isMapReady]);

  // Zoom to selected animal
  useEffect(() => {
    if (selectedAnimal && map.current) {
      map.current.flyTo({
        center: [selectedAnimal.longitude, selectedAnimal.latitude],
        zoom: 15,
        duration: 1000
      });
    }
  }, [selectedAnimal]);

  const handleMapTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapTokenInput.trim()) {
      setMapboxToken(mapTokenInput.trim());
      localStorage.setItem('mapbox_token', mapTokenInput.trim());
    }
  };

  const handleUserLocation = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 14,
        duration: 1000
      });
    }
  };

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  // Check for token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-background">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-bold text-center text-primary">MapBox API Token Required</h2>
          <p className="mb-4 text-sm text-gray-600">
            To use PetMap, you need to provide a Mapbox API token. Get your free token at{' '}
            <a 
              href="https://account.mapbox.com/auth/signup/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mapbox.com
            </a>
          </p>
          <form onSubmit={handleMapTokenSubmit} className="space-y-4">
            <input
              type="text"
              value={mapTokenInput}
              onChange={(e) => setMapTokenInput(e.target.value)}
              placeholder="Enter your Mapbox token"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <Button type="submit" className="w-full">
              Continue to PetMap
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute left-4 bottom-20 flex flex-col space-y-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={handleZoomIn}
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={handleZoomOut}
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={handleUserLocation}
        >
          <Compass className="w-5 h-5 text-gray-700" />
        </Button>
      </div>
    </div>
  );
};

export default MapComponent;
