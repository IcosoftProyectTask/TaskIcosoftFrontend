// Componentes comunes y estados

// components/LoadingState.jsx
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState = () => (
  <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
      <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando datos...</p>
    </div>
  </div>
);

export default LoadingState;


