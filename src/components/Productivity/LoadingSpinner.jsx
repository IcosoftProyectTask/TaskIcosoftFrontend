import React from 'react';

export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`${fullScreen ? 'fixed inset-0' : 'absolute inset-0'} z-50 flex items-center justify-center bg-gray-900 bg-opacity-50`}>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-white font-semibold">Cargando...</p>
      </div>
    </div>
  );
}