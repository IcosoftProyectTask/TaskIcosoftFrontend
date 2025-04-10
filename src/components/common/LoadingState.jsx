// src/components/common/LoadingState.jsx
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState = ({ message = "Cargando datos..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
      <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingState;