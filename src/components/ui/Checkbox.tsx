import React from 'react';

export const Checkbox = ({ id, checked, onCheckedChange, label, className }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  );
};