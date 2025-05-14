import React from "react";

const TipoCard = ({ tipo, onClick, disabled = false }) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all text-center
        ${disabled
          ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
          : "cursor-pointer hover:shadow-md bg-white dark:bg-gray-800"}`}
      title={disabled ? "Opción no disponible" : ""}
    >
      <div className="mb-2">{tipo.icono}</div>
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {tipo.nombre}
      </h3>
      {tipo.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {tipo.description}
        </p>
      )}
    </div>
  );
};

export default TipoCard;