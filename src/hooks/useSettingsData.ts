
import { useState, useEffect } from 'react';

// --- useSettingsData Hook ---
export const useSettingsData = () => {
  const [heightCm, setHeightCm] = useState<number | ''>( '');
  useEffect(() => {
    const saved = localStorage.getItem('heightCm');
    if (saved) {
      const v = parseFloat(saved);
      if (!Number.isNaN(v) && v > 0) setHeightCm(v);
    }
  }, []);
  useEffect(() => {
    if (typeof heightCm === 'number' && heightCm > 0) {
      localStorage.setItem('heightCm', String(heightCm));
    }
  }, [heightCm]);

  return { heightCm, setHeightCm };
};
