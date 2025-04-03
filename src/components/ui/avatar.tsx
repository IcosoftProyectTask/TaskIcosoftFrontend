// src/components/ui/avatar.jsx
import React from 'react';

export const Avatar = ({ children, className }) => (
  <div className={`rounded-full overflow-hidden ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
);

export const AvatarFallback = ({ children, className }) => (
  <div className={`flex items-center justify-center bg-gray-200 text-gray-700 ${className}`}>
    {children}
  </div>
);