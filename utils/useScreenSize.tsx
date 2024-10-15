import { useState, useEffect } from 'react';

export const useScreenSize = (minWidth: number) => {
  const [isScreenLarge, setIsScreenLarge] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsScreenLarge(e.matches);
    };

    
    setIsScreenLarge(mediaQuery.matches);

    
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, [minWidth]);

  return isScreenLarge;
};
