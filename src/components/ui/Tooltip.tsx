import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ children, content, delay = 200, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  let timeout;

  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 mb-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-1 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-1 mr-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-1 ml-1',
  };

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  // Ajusta posición si el tooltip se sale de la pantalla
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const triggerRect = triggerRef.current.getBoundingClientRect();
      
      // Ajustar posición si es necesario
      if (tooltipRect.left < 0) {
        tooltipRef.current.style.left = '0px';
        tooltipRef.current.style.transform = 'translate(0, -100%)';
      }
      
      if (tooltipRect.right > window.innerWidth) {
        tooltipRef.current.style.left = 'auto';
        tooltipRef.current.style.right = '0px';
        tooltipRef.current.style.transform = 'translate(0, -100%)';
      }
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} ref={triggerRef}>
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-2 py-1 text-xs text-white bg-slate-900 rounded shadow-md 
            pointer-events-none whitespace-nowrap
            ${positionStyles[position]}
            dark:bg-slate-800 
            ${className}
          `}
          role="tooltip"
        >
          {content}
          {position === 'top' && (
            <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-slate-900 rotate-45 transform -translate-x-1/2 dark:bg-slate-800" />
          )}
          {position === 'bottom' && (
            <div className="absolute left-1/2 -top-1 w-2 h-2 bg-slate-900 rotate-45 transform -translate-x-1/2 dark:bg-slate-800" />
          )}
          {position === 'left' && (
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-900 rotate-45 transform -translate-y-1/2 dark:bg-slate-800" />
          )}
          {position === 'right' && (
            <div className="absolute top-1/2 -left-1 w-2 h-2 bg-slate-900 rotate-45 transform -translate-y-1/2 dark:bg-slate-800" />
          )}
        </div>
      )}
    </div>
  );
};

export { Tooltip };