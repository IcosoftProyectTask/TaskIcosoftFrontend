// Ruta de No Autorizado
import React from "react";

const NotAuthorized = () => {
  return (
    <div className="text-center py-5">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        No tienes acceso a esta página
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Tu rol no tiene permisos para ver esta página.
      </p>
    </div>
  );
};

export default NotAuthorized;
