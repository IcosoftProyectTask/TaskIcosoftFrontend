// components/Badges.jsx
import React from 'react';

// Badge de prioridad
export const PriorityBadge = ({ priority }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let darkBgColor = "dark:bg-gray-700";
  let darkTextColor = "dark:text-gray-200";

  if (priority === 'ALTA') {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    darkBgColor = "dark:bg-red-900";
    darkTextColor = "dark:text-red-200";
  } else if (priority === 'MEDIA') {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
    darkBgColor = "dark:bg-yellow-900";
    darkTextColor = "dark:text-yellow-200";
  } else if (priority === 'BAJA') {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    darkBgColor = "dark:bg-green-900";
    darkTextColor = "dark:text-green-200";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor}`}>
      {priority}
    </span>
  );
};

// Badge de estado
export const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let darkBgColor = "dark:bg-gray-700";
  let darkTextColor = "dark:text-gray-200";

  if (status === 'Completado') {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    darkBgColor = "dark:bg-green-900";
    darkTextColor = "dark:text-green-200";
  } else if (status === 'En proceso') {
    bgColor = "bg-blue-100";
    textColor = "text-blue-800";
    darkBgColor = "dark:bg-blue-900";
    darkTextColor = "dark:text-blue-200";
  } else if (status === 'Pendiente') {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
    darkBgColor = "dark:bg-yellow-900";
    darkTextColor = "dark:text-yellow-200";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor}`}>
      {status}
    </span>
  );
};