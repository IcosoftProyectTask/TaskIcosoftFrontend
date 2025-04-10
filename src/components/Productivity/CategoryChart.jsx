// Componentes de Gráficos

// components/CategoryChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { createChartData, CHART_COLORS } from '../../components/Productivity/utils';

const CategoryChart = ({ data }) => {
  const chartData = createChartData(data);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow">
      <h3 className="font-medium mb-3 sm:mb-4 text-gray-800 dark:text-white text-sm sm:text-base">Distribución por categoría</h3>
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="70%"
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Cantidad']}
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  color: 'var(--tooltip-text, #000)', 
                  border: 'none', 
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No hay datos suficientes para mostrar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
