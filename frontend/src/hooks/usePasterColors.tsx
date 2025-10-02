import { useEffect, useState, useCallback } from 'react';

export const useCardColors = (items: unknown[]) => {
  const [colors, setColors] = useState<string[]>([]);

  const generatePastelColors = useCallback(() => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70;
    const lightness = Math.floor(Math.random() * 20) + 80;

    return `hsl(${hue}, ${saturation}%, ${lightness}%, 0.4)`;
  }, []);

  useEffect(() => {
    if (items?.length) {
      const newColors = items.map(() => generatePastelColors());
      setColors(newColors);
    }
  }, [items]);

  return colors;
};
