//Libraries
import React from 'react';

//Components
import LineChart from '../../components/charts/LineChart01';
import { chartAreaGradient } from '../../components/charts/ChartjsConfig';
import { useQuery } from "@tanstack/react-query";
import { getCurrentMonth } from "../../service/Graficas"


// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard02() {

  const { data: backendData, isLoading } = useQuery({
    queryKey: ["getMonth"],
    queryFn: getCurrentMonth,
  });

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  const formattedLabels = backendData.map(item => {
    const date = new Date(item.date);
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  });

  const totalSales = backendData.reduce((sum, item) => sum + item.totalIncome, 0);
  const incomeData = backendData.map(item => item.totalIncome);

  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        data: incomeData,
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
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.blue[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Ingresos mensuales</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Ingresos</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">₡{totalSales.toLocaleString()}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] max-h-[128px]">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard02;
