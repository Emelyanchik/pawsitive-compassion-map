
/**
 * Geo utilities for PetMap
 * Helper functions for geographic calculations
 */

/**
 * Calculate distance between two geographical points in kilometers
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
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
 * @param deg Angle in degrees
 * @returns Angle in radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted string with appropriate unit
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Calculate the center point between multiple coordinates
 * @param coordinates Array of [longitude, latitude] coordinates
 * @returns [longitude, latitude] of the center point
 */
export const calculateCenter = (coordinates: Array<[number, number]>): [number, number] => {
  if (coordinates.length === 0) return [0, 0];
  if (coordinates.length === 1) return coordinates[0];
  
  let x = 0;
  let y = 0;
  let z = 0;
  
  // Convert lat/lon to cartesian coordinates
  coordinates.forEach(([lon, lat]) => {
    // Convert to radians
    const latRad = lat * Math.PI / 180;
    const lonRad = lon * Math.PI / 180;
    
    // Convert to cartesian
    x += Math.cos(latRad) * Math.cos(lonRad);
    y += Math.cos(latRad) * Math.sin(lonRad);
    z += Math.sin(latRad);
  });
  
  // Average points
  x /= coordinates.length;
  y /= coordinates.length;
  z /= coordinates.length;
  
  // Convert back to lat/lon
  const lonRad = Math.atan2(y, x);
  const hyp = Math.sqrt(x * x + y * y);
  const latRad = Math.atan2(z, hyp);
  
  // Convert to degrees
  const centerLon = lonRad * 180 / Math.PI;
  const centerLat = latRad * 180 / Math.PI;
  
  return [centerLon, centerLat];
};
