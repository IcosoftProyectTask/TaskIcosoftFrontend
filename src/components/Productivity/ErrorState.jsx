// components/ErrorState.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ error }) => (
  <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div className="text-center max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Error al cargar el dashboard</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
      >
        Reintentar
      </button>
    </div>
  </div>
);

export default ErrorState;