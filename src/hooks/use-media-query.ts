
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design - detects if a media query matches
 * @param query The media query to check
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with default value, which we assume is false for SSR compatibility
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a media query list
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Define callback to handle changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the callback as a listener for changes to the media query
    media.addEventListener('change', listener);

    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
