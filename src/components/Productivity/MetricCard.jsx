
// components/MetricCard.jsx
import React from 'react';
import { CheckSquare, Clock, Activity, AlertTriangle } from 'lucide-react';

const iconMap = {
  CheckSquare,
  Clock,
  Activity,
  AlertTriangle
};

const MetricCard = ({ title, value, subtitle, total, icon, color, badges, showProgress }) => {
  const IconComponent = iconMap[icon];
  
  const colorMap = {
    green: 'text-green-500',
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500'
  };
  
  const badgeColorMap = {
    green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow">
      <div className="flex items-center mb-2">
        {IconComponent && <IconComponent className={`mr-2 ${colorMap[color] || 'text-gray-500'}`} size={20} />}
        <h3 className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{title}</h3>
      </div>
      
      <div className="flex justify-between items-end">
        <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        {total && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">de {total} tareas</p>}
      </div>
      
      {subtitle && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      
      {showProgress && total > 0 && (
        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className={`h-2 bg-${color}-500 rounded-full`}
            style={{ width: `${(parseInt(value) / parseInt(total)) * 100}%` }}
          ></div>
        </div>
      )}
      
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className={`${badgeColorMap[badge.color] || badgeColorMap.gray} text-xs px-2 py-1 rounded-full`}
            >
              {badge.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricCard;