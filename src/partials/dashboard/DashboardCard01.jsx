//Libraries
import React from 'react';

//Components
import LineChart from '../../components/charts/LineChart01';
import { chartAreaGradient } from '../../components/charts/ChartjsConfig';
import { getGraficaCurrent } from "../../service/Graficas"
import { useQuery } from "@tanstack/react-query";

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard01() {

  const { data: backendData, isLoading } = useQuery({
    queryKey: ["getGraphic"],
    queryFn: getGraficaCurrent,
  });
  
  if (isLoading) {
    return <div>Cargando datos...</div>; 
  }
  

  const monthToNumber = (month) => {
    const months = {
      January: "01", February: "02", March: "03", April: "04",
      May: "05", June: "06", July: "07", August: "08",
      September: "09", October: "10", November: "11", December: "12"
    };
    return months[month];
  };

  const labels = backendData.map(item => `${monthToNumber(item.month)}-01-${item.year}`);
  const data = backendData.map(item => item.totalIncome);
  const totalSales = backendData.reduce((sum, item) => sum + item.totalIncome, 0);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Ingresos anuales</h2>
          {/* Menu button */}
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Ingresos</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2"> ₡{totalSales.toLocaleString()}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard01;
