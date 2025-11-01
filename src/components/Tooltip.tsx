import React, { useState, type ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  delay?: number; // Delay in ms before tooltip appears
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, delay = 400 }) => {
  const [active, setActive] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && (
        <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow-sm opacity-90 whitespace-nowrap -translate-x-1/2 left-1/2 top-full mt-2">
          {content}
          <div className="absolute text-gray-700 text-sm -top-1 left-1/2 -translate-x-1/2">
            &#9650;
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
