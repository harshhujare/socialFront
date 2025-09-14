import { useState, useEffect } from 'react';

/**
 * A custom hook that returns whether a media query matches the current viewport
 * @param {string} query - The media query to check
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  // Initialize with the current match state
  const getMatches = (query) => {
    // SSR check - return false on the server
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches(query));

  // Update matches state when the media query changes
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Define a callback function to handle changes
    const handleChange = () => setMatches(mediaQuery.matches);
    
    // Call once to set initial value
    handleChange();
    
    // Add event listener for subsequent changes
    if (mediaQuery.addEventListener) {
      // Modern browsers
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Older browsers (IE, older Edge)
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}