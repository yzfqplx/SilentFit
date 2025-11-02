import { useRef, useEffect } from 'react';

export const useMouseGlow = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      node.style.setProperty('--mouse-x', `${x}px`);
      node.style.setProperty('--mouse-y', `${y}px`);
    };

    node.addEventListener('mousemove', handleMouseMove);

    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return ref;
};