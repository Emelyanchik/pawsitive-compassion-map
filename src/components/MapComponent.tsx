import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from '../contexts/MapContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Compass, MapPin, Plus, Minus, Dog, Cat, Rotate3d, Ruler, Maximize2, Minimize2, Navigation, MousePointer, Target, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AddAnimalForm } from './AddAnimalForm';
import AnimalDetailsDialog from './AnimalDetailsDialog';
import MapLegend from './MapLegend';
import AreaLabeling from './AreaLabeling';
import AreaLabelsLayer from './AreaLabelsLayer';
import MapToolsPopup from './MapToolsPopup';
import MapClusterLayer from './MapClusterLayer';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const { 
    filteredAnimals,
    selectedAnimal, 
    setSelectedAnimal, 
    mapboxToken,
    setMapboxToken,
    userLocation,
    distanceFilter,
    mapRotation,
    mapPitch,
    setMapRotation,
    setMapPitch
  } = useMap();
  const [mapTokenInput, setMapTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [clickedLocation, setClickedLocation] = useState<[number, number] | null>(null);
  const [isAddAnimalDialogOpen, setIsAddAnimalDialogOpen] = useState(false);
  const [isAnimalDetailsOpen, setIsAnimalDetailsOpen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToolsPopupOpen, setIsToolsPopupOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<Array<[number, number]>>([]);
  const measureSourceRef = useRef<mapboxgl.GeoJSONSource | null>(null);
  const watchPositionRef = useRef<number | null>(null);
  const [useClusterView, setUseClusterView] = useState(false);

  const setupMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation || [0, 51.5],
        zoom: 12,
        pitch: mapPitch,
        bearing: mapRotation,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      // Only add the click event listener for empty map areas
      map.current.on('click', (e) => {
        // Check if we clicked on a marker (which will be handled separately)
        // The map element itself will have a class name that starts with "mapboxgl-"
        const targetElement = e.originalEvent.target as HTMLElement;
        const isMapboxElement = 
          targetElement.className.toString().startsWith('mapboxgl-') || 
          targetElement.closest('.animal-marker');
        
        // Handle click based on active tool
        if (activeTool === 'measure') {
          handleMeasureClick(e.lngLat);
          return;
        }
        
        // Only open the add animal dialog if we clicked directly on the map (not on a marker)
        if (!targetElement.closest('.animal-marker')) {
          const { lng, lat } = e.lngLat;
          setClickedLocation([lng, lat]);
          setIsAddAnimalDialogOpen(true);
        }
      });

      map.current.on('load', () => {
        setIsMapReady(true);
        
        // Add measure line source and layer
        map.current?.addSource('measure-line', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
        
        map.current?.addLayer({
          id: 'measure-line',
          type: 'line',
          source: 'measure-line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#f33',
            'line-width': 2,
            'line-dasharray': [2, 1]
          }
        });
        
        map.current?.addLayer({
          id: 'measure-points',
          type: 'circle',
          source: 'measure-line',
          paint: {
            'circle-radius': 5,
            'circle-color': '#f33'
          },
          filter: ['in', '$type', 'Point']
        });
        
        // Store reference to the source
        measureSourceRef.current = map.current?.getSource('measure-line') as mapboxgl.GeoJSONSource;
      });

      // Track rotation and pitch changes
      map.current.on('rotate', () => {
        if (map.current) {
          setMapRotation(map.current.getBearing());
          setMapPitch(map.current.getPitch());
        }
      });

      map.current.on('pitch', () => {
        if (map.current) {
          setMapPitch(map.current.getPitch());
        }
      });

      return () => {
        if (watchPositionRef.current !== null) {
          navigator.geolocation.clearWatch(watchPositionRef.current);
        }
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

  // Initialize map when mapbox token and user location are available
  useEffect(() => {
    if (mapboxToken && !map.current) {
      setupMap();
    }
  }, [mapboxToken]);

  // Update map markers when filtered animals change and cluster view is not active
  useEffect(() => {
    if (!isMapReady || !map.current || useClusterView) return;

    // Remove all existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add markers for filtered animals
    filteredAnimals.forEach(animal => {
      const el = document.createElement('div');
      el.className = 'animal-marker';
      
      const statusColors = {
        needs_help: '#FF4500',
        being_helped: '#FFA500',
        adopted: '#32CD32',
        reported: '#9B30FF'
      };
      
      let iconSvg;
      if (animal.type === 'cat') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${statusColors[animal.status]}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58 1.25 3.75 1.17 5-.47 1.34-1.26 2.5-2.33 3.32A8.03 8.03 0 0 1 20 16c0 3.5-2.8 2.96-4 1.5-.63 1.47-1.4 3-3.5 3s-2.88-1.53-3.5-3C7.8 18.96 5 19.5 5 16c0-1.77.57-3.34 1.5-4.64-1.1-.83-1.9-2-2.38-3.36-.08-1.25-.24-4.42 1.17-5 1.39-.58 4.65.26 6.43 2.26.65-.17 1.33-.26 2-.26Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>`;
      } else if (animal.type === 'dog') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${statusColors[animal.status]}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.305 2.344-2.628M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.398-2.344-2.628"/><path d="M8 14v.5M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path></svg>`;
      } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${statusColors[animal.status]}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      }
      
      el.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(iconSvg)}")`;
      el.style.width = '35px';
      el.style.height = '35px';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([animal.longitude, animal.latitude])
        .addTo(map.current!);

      marker.getElement().addEventListener('click', (e) => {
        // Prevent the map's click event from firing
        e.stopPropagation();
        
        setSelectedAnimal(animal);
        setIsAnimalDetailsOpen(true);
        map.current?.flyTo({
          center: [animal.longitude, animal.latitude],
          zoom: 15,
          duration: 1000
        });
      });

      markersRef.current[animal.id] = marker;
    });
  }, [filteredAnimals, isMapReady, useClusterView]);

  // Add distance circle when user location and distance filter change
  useEffect(() => {
    if (!isMapReady || !map.current || !userLocation) return;

    // Remove existing circle if it exists
    if (map.current.getLayer('distance-circle')) {
      map.current.removeLayer('distance-circle');
    }
    if (map.current.getSource('distance-circle')) {
      map.current.removeSource('distance-circle');
    }

    // Add distance circle if user location is available
    if (userLocation && distanceFilter > 0) {
      // Check if the map style is loaded
      if (!map.current.isStyleLoaded()) {
        map.current.once('style.load', () => {
          addDistanceCircle();
        });
      } else {
        addDistanceCircle();
      }
    }
  }, [userLocation, distanceFilter, isMapReady]);

  const addDistanceCircle = () => {
    if (!map.current || !userLocation) return;

    // Create a GeoJSON source for the circle
    const point = {
      type: 'Point' as const,
      coordinates: userLocation
    };

    // Convert km to meters for the buffer
    const radiusInMeters = distanceFilter * 1000;
    
    if (map.current.getSource('distance-circle')) {
      // Update existing source
      (map.current.getSource('distance-circle') as mapboxgl.GeoJSONSource).setData(point);
    } else {
      // Create new source and layer
      map.current.addSource('distance-circle', {
        type: 'geojson',
        data: point
      });

      map.current.addLayer({
        id: 'distance-circle',
        type: 'circle',
        source: 'distance-circle',
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, radiusInMeters / 0.075] // Scale the radius based on zoom level
            ],
            base: 2
          },
          'circle-color': 'rgba(67, 156, 230, 0.2)',
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(67, 156, 230, 0.8)'
        }
      });
    }
  };

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

  const handleToggle3DMode = () => {
    if (!map.current) return;

    const newMode = !is3DMode;
    setIs3DMode(newMode);
    
    map.current.flyTo({
      pitch: newMode ? 60 : 0,
      duration: 1000
    });

    // Update building extrusion layer
    if (newMode) {
      if (!map.current.getLayer('3d-buildings')) {
        map.current.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              16, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              16, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
      }
    } else if (map.current.getLayer('3d-buildings')) {
      map.current.removeLayer('3d-buildings');
    }

    toast({
      title: newMode ? "3D Mode Enabled" : "3D Mode Disabled",
      description: newMode ? "Showing buildings in 3D. Zoom in for more detail." : "Returned to 2D view.",
    });
  };

  const resetMapRotation = () => {
    if (!map.current) return;
    
    map.current.flyTo({
      bearing: 0,
      pitch: is3DMode ? 60 : 0,
      duration: 1000
    });
    
    toast({
      title: "Map Orientation Reset",
      description: "Map rotation has been reset to north.",
    });
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const mapElement = mapContainer.current;
    if (!mapElement) return;

    if (!isFullscreen) {
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Measurement tool functions
  const handleMeasureClick = (lngLat: mapboxgl.LngLat) => {
    const newPoint: [number, number] = [lngLat.lng, lngLat.lat];
    const newPoints = [...measurePoints, newPoint];
    setMeasurePoints(newPoints);
    
    if (measureSourceRef.current) {
      const data = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: newPoints
        }
      } as GeoJSON.Feature<GeoJSON.LineString>;
      
      measureSourceRef.current.setData(data);
      
      // Calculate distance if we have at least 2 points
      if (newPoints.length >= 2) {
        const distance = calculateDistance(newPoints);
        
        toast({
          title: "Distance Measurement",
          description: `Total distance: ${distance.toFixed(2)} km`,
        });
      }
    }
  };
  
  const calculateDistance = (points: Array<[number, number]>): number => {
    let totalDistance = 0;
    
    for (let i = 1; i < points.length; i++) {
      const [lon1, lat1] = points[i - 1];
      const [lon2, lat2] = points[i];
      
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      totalDistance += distance;
    }
    
    return totalDistance;
  };
  
  const resetMeasurement = () => {
    setMeasurePoints([]);
    if (measureSourceRef.current) {
      measureSourceRef.current.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
    }
    setActiveTool(null);
    toast({
      title: "Measurement Tool Reset",
      description: "Distance measurement has been cleared.",
    });
  };
  
  // Live location tracking
  const toggleLiveTracking = () => {
    if (isLiveTracking) {
      // Stop tracking
      if (watchPositionRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionRef.current);
        watchPositionRef.current = null;
      }
      setIsLiveTracking(false);
      toast({
        title: "Live Tracking Disabled",
        description: "Your location is no longer being tracked.",
      });
    } else {
      // Start tracking
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation Not Supported",
          description: "Your browser does not support geolocation.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Live Tracking Enabled",
        description: "Your location is now being tracked in real-time.",
      });
      
      watchPositionRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          
          // Update user location in context
          const newLocation: [number, number] = [longitude, latitude];
          // This would update the user location in context, but we're keeping the original for now
          
          // Update map view
          if (map.current) {
            map.current.panTo(newLocation, { duration: 500 });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Failed to track your location. Please check your device settings.",
            variant: "destructive",
          });
          setIsLiveTracking(false);
          watchPositionRef.current = null;
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000, // 10 seconds
          timeout: 5000
        }
      );
      
      setIsLiveTracking(true);
    }
  };

  const toggleTool = (toolName: string) => {
    if (activeTool === toolName) {
      setActiveTool(null);
      
      if (toolName === 'measure') {
        resetMeasurement();
      }
    } else {
      setActiveTool(toolName);
      
      if (toolName === 'measure') {
        toast({
          title: "Measurement Tool Activated",
          description: "Click on the map to add measurement points. Click the tool again to deactivate.",
        });
      }
    }
  };

  const toggleClusterView = () => {
    setUseClusterView(prev => !prev);
    
    // Show a toast message to inform the user
    toast({
      title: useClusterView ? "Cluster View Disabled" : "Cluster View Enabled",
      description: useClusterView 
        ? "Showing individual animal markers." 
        : "Showing clusters of nearby animals.",
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  const closeAddAnimalDialog = () => {
    setIsAddAnimalDialogOpen(false);
    setClickedLocation(null);
  };

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
      
      {/* Map Legend */}
      <MapLegend />
      
      {/* Area Labeling */}
      <AreaLabeling map={map.current} />
      <AreaLabelsLayer map={map.current} />
      
      {/* Add cluster layer when needed */}
      {useClusterView && <MapClusterLayer map={map.current} />}
      
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
        <Button 
          variant="secondary" 
          size="icon" 
          className={`rounded-full bg-white shadow-md hover:bg-gray-100 ${is3DMode ? 'bg-blue-100' : ''}`}
          onClick={handleToggle3DMode}
        >
          <Rotate3d className="w-5 h-5 text-gray-700" />
        </Button>
        {(mapRotation !== 0 || mapPitch !== 0) && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-white shadow-md hover:bg-gray-100"
            onClick={resetMapRotation}
          >
            <Ruler className="w-5 h-5 text-gray-700" />
          </Button>
        )}
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-700" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700" />
          )}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className={`rounded-full bg-white shadow-md hover:bg-gray-100 ${useClusterView ? 'bg-blue-100' : ''}`}
          onClick={toggleClusterView}
          title={useClusterView ? "Show individual markers" : "Show cluster view"}
        >
          <Layers className="w-5 h-5 text-gray-700" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className={`rounded-full bg-white shadow-md hover:bg-gray-100 ${isToolsPopupOpen ? 'bg-blue-100' : ''}`}
          onClick={() => setIsToolsPopupOpen(!isToolsPopupOpen)}
        >
          <Target className="w-5 h-5 text-gray-700" />
        </Button>
      </div>
      
      {/* Map Tools Popup */}
      {isToolsPopupOpen && (
        <div className="absolute left-20 bottom-20 bg-white p-2 rounded-lg shadow-lg flex flex-col gap-2 animate-fade-in">
          <Button 
            variant={activeTool === 'measure' ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => toggleTool('measure')}
          >
            <Ruler className="w-4 h-4" />
            <span>Measure Distance</span>
          </Button>
          <Button 
            variant={isLiveTracking ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            onClick={toggleLiveTracking}
          >
            <Navigation className="w-4 h-4" />
            <span>{isLiveTracking ? 'Stop Tracking' : 'Live Tracking'}</span>
          </Button>
          {activeTool === 'measure' && measurePoints.length > 0 && (
            <Button 
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
              onClick={resetMeasurement}
            >
              <span>Reset Measurement</span>
            </Button>
          )}
        </div>
      )}

      <Dialog open={isAddAnimalDialogOpen} onOpenChange={setIsAddAnimalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Animal at Selected Location</DialogTitle>
            <DialogDescription>
              Report an animal at coordinates: {clickedLocation ? `${clickedLocation[1].toFixed(4)}, ${clickedLocation[0].toFixed(4)}` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {clickedLocation && (
            <AddAnimalForm 
              initialValues={{
                latitude: clickedLocation[1],
                longitude: clickedLocation[0]
              }} 
              onSuccess={closeAddAnimalDialog}
              onCancel={closeAddAnimalDialog}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AnimalDetailsDialog 
        open={isAnimalDetailsOpen} 
        onOpenChange={setIsAnimalDetailsOpen} 
      />
    </div>
  );
};

export default MapComponent;
