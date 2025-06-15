// src/utils/useGold.js
import { useEffect, useState } from 'react';

export function useGold() {
  const [gold, setGold] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setGold(prev => Math.min(prev + 10, 500));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return [gold, setGold];
}
