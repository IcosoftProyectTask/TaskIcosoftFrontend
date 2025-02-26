// Libraries
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";

// Components
import Tooltip from '../../components/Tooltip';
import { chartAreaGradient } from '../../components/charts/ChartjsConfig';
import RealtimeChart from '../../components/charts/RealtimeChart';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

// API
import { getRealTime } from "../../service/QueryAPI";


function DashboardCard05() {
  const { data } = useQuery({
    queryKey: ["getRealTime"],
    queryFn: getRealTime,
    refetchInterval: 5000, 
  });

  // State to accumulate historical data points
  const [slicedData, setSlicedData] = useState([]);
  const [slicedLabels, setSlicedLabels] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Set up an interval to increment the counter every 2 seconds
    const interval = setInterval(() => {
      setCounter(prevCounter => prevCounter + 1);
    }, 5000);

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    if (data) {
      const newValue = data.total;

      // Append the new value to the historical data array
      setSlicedData(prevData => [...prevData.slice(-34), newValue]); // Keep only the latest 35 points

      // Generate a new timestamp for the data point
      const now = new Date();
      setSlicedLabels(prevLabels => [...prevLabels.slice(-34), now]); // Keep only the latest 35 labels
    }
  }, [counter, data]);

  const chartData = {
    labels: slicedLabels,
    datasets: [
      {
        data: slicedData,
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
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
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-white">Ventas en tiempo real</h2>
        <Tooltip className="ml-2">
          <div className="text-xs text-center whitespace-nowrap">Ventas Totales</div>
        </Tooltip>
      </header>
      {/* Chart built with Chart.js 3 */}
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard05;
