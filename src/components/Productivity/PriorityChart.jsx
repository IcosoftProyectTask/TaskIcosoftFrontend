
// components/PriorityChart.jsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { getHoursDifference } from '../../components/Productivity/utils';

const PriorityChart = ({ data }) => {
  // Calcular tiempo de resolución por prioridad
  const resolutionTimeByPriority = useMemo(() => {
    const priorities = ['ALTA', 'MEDIA', 'BAJA'];
    return priorities.map(priority => {
      const filteredTasks = data.filter(t => 
        t.PriorityName === priority && t.Status === "Completado" && t.StartTask && t.EndTask
      );
      
      const avgTime = filteredTasks.length > 0
        ? filteredTasks.reduce((sum, t) => {
            const hours = getHoursDifference(t.StartTask, t.EndTask);
            return sum + (hours ? parseFloat(hours) : 0);
          }, 0) / filteredTasks.length
        : 0;
        
      return { 
        name: priority, 
        value: avgTime,
        count: filteredTasks.length
      };
    }).filter(item => !isNaN(item.value));
  }, [data]);
  
  const barColors = ['#FF8042', '#FFBB28', '#00C49F'];
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow">
      <h3 className="font-medium mb-3 sm:mb-4 text-gray-800 dark:text-white text-sm sm:text-base">Tiempo de resolución por prioridad (horas)</h3>
      <div className="h-64">
        {resolutionTimeByPriority.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={resolutionTimeByPriority}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke, #E5E7EB)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--axis-stroke, #6B7280)"
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis 
                stroke="var(--axis-stroke, #6B7280)"
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />
              <Tooltip 
                formatter={(value) => [value.toFixed(2), 'Horas promedio']}
                labelFormatter={(name) => `Prioridad: ${name}`}
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  color: 'var(--tooltip-text, #000)', 
                  border: 'none', 
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }} 
              />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                name="Horas promedio"
                radius={[4, 4, 0, 0]}
              >
                {resolutionTimeByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index]} />
                ))}
              </Bar>
            </BarChart>
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

export default PriorityChart;