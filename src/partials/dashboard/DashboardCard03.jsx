// Libraries
import React from 'react';

// Components
import LineChart from '../../components/charts/LineChart01';
import { chartAreaGradient } from '../../components/charts/ChartjsConfig';
import { useQuery } from "@tanstack/react-query";
import { getCountLastDays } from "../../service/Graficas";

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard03() {
  const { data: backendData, isLoading } = useQuery({
    queryKey: ["getCountLastDays"],
    queryFn: getCountLastDays,
  });

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  // Convertir fechas al formato MM-DD-YYYY
  const formattedLabels = backendData.map(item => {
    const date = new Date(item.date);
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  });

  // Obtener los valores de count
  const countData = backendData.map(item => item.count);

  // Calcular el total de registros
  const totalCount = backendData.reduce((sum, item) => sum + item.count, 0);

  // Configuración de datos para la gráfica
  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        data: countData,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0)` },
            { stop: 1, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.2)` }
          ]);
        },
        borderColor: tailwindConfig().theme.colors.blue[500],
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: tailwindConfig().theme.colors.blue[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.blue[700],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Registros por día</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Total Registros</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{totalCount.toLocaleString()}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] max-h-[200px]">
        <LineChart data={chartData} width={389} height={200} />
      </div>
    </div>
  );
}

export default DashboardCard03;
