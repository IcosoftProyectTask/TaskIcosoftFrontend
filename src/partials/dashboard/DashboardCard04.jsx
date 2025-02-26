// Libraries
import React from 'react';

// Components
import BarChart from '../../components/charts/BarChart01';
import { getComparisonByYear } from "../../service/Graficas";
import { useQuery } from "@tanstack/react-query";

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

function DashboardCard04() {

  const { data: backendData, isLoading } = useQuery({
    queryKey: ["getGraphicByYear"],
    queryFn: getComparisonByYear,
  });

  console.log(backendData)

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  const currentYearIncome = backendData.map(item => item.currentYearIncome);
  const previousYearIncome = backendData.map(item => item.previousYearIncome);

  const chartData = {
    labels: [
      '12-01-2024', '01-01-2024', '02-03-2024',
      '03-02-2024', '04-01-2024', '01-01-2025',
    ],
    datasets: [
      {
        label: 'Año actual',
        data: currentYearIncome, 
        backgroundColor: tailwindConfig().theme.colors.red[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.red[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },

      {
        label: 'Año anterior',
        data: previousYearIncome,
        backgroundColor: tailwindConfig().theme.colors.blue[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.blue[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-white">Actual vs Anterior</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard04;