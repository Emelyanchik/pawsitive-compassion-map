
/**
 * Calculate the distance between two points on Earth in kilometers
 * Uses the Haversine formula to calculate the great-circle distance between two points
 * 
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Convert degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Format a distance in a human-readable way
 * @param distanceInKm Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  } else if (distanceInKm < 10) {
    return `${distanceInKm.toFixed(1)} km`;
  } else {
    return `${Math.round(distanceInKm)} km`;
  }
};

/**
 * Calculate the center point between multiple coordinates
 * @param coordinates Array of [longitude, latitude] points
 * @returns [longitude, latitude] of the center point
 */
export const calculateCenter = (coordinates: [number, number][]): [number, number] => {
  if (coordinates.length === 0) {
    return [0, 0];
  }
  
  const sumLng = coordinates.reduce((sum, point) => sum + point[0], 0);
  const sumLat = coordinates.reduce((sum, point) => sum + point[1], 0);
  
  return [sumLng / coordinates.length, sumLat / coordinates.length];
};

/**
 * Create a bounding box around a coordinate with a specified radius
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Bounding box as [west, south, east, north]
 */
export const createBoundingBox = (lat: number, lng: number, radiusKm: number): [number, number, number, number] => {
  // Approximate degrees for the given distance
  const latChange = radiusKm / 111.32; // 1 degree of latitude is approximately 111.32 km
  const lonChange = radiusKm / (111.32 * Math.cos(deg2rad(lat))); // Longitude degrees vary based on latitude
  
  return [
    lng - lonChange, // west
    lat - latChange, // south
    lng + lonChange, // east
    lat + latChange  // north
  ];
};
