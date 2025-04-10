// src/components/dashboard/StatsCards.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { BarChart2, CircleSlash, Timer, CheckCircle2 } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

const StatCard = ({ title, value, icon, iconColor }) => (
  <div className="col-span-12 sm:col-span-6 xl:col-span-3">
    <Card className="dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium dark:text-white">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold dark:text-white">{value}</div>
      </CardContent>
    </Card>
  </div>
);

const StatsCards = () => {
  const { getTaskStats } = useTaskContext();
  const stats = getTaskStats();

  return (
    <>
      <StatCard 
        title="Total Tareas" 
        value={stats.total} 
        icon={<BarChart2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />} 
      />
      <StatCard 
        title="Pendientes" 
        value={stats.pendientes} 
        icon={<CircleSlash className="h-4 w-4 text-red-600 dark:text-red-400" />} 
      />
      <StatCard 
        title="En Progreso" 
        value={stats.enProgreso} 
        icon={<Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />} 
      />
      <StatCard 
        title="Completadas" 
        value={stats.completadas} 
        icon={<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />} 
      />
    </>
  );
};

export default StatsCards;