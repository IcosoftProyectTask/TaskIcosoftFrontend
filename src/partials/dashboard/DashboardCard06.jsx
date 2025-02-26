// Importar la librería de gráficos
import DoughnutChart from '../../components/charts/DoughnutChart';

// Importar utilidades
import { tailwindConfig } from '../../utils/Utils';
import { getCheckIns } from "../../service/Graficas"
import { useQuery } from "@tanstack/react-query";

function DashboardCard06() {
  // Datos de la API adaptados
    const { data: apiData, isLoading } = useQuery({
      queryKey: ["getCheck"],
      queryFn: getCheckIns,
    });
    
    if (isLoading) {
      return <div>Cargando datos...</div>; 
    }

  const totalCheckIns = apiData[0].monthlyStats.reduce((acc, stat) => acc + stat.checkInCount, 0);
  const totalNoCheckIns = apiData[0].monthlyStats.reduce((acc, stat) => acc + stat.noCheckInCount, 0);

  const chartData = {
    labels: ['Asistencias', 'Sin asistir'],
    datasets: [
      {
        label: 'Cantidad',
        data: [totalCheckIns, totalNoCheckIns],
        backgroundColor: [
          tailwindConfig().theme.colors.green[500],
          tailwindConfig().theme.colors.red[500],
        ],
        hoverBackgroundColor: [
          tailwindConfig().theme.colors.green[600],
          tailwindConfig().theme.colors.red[600],
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-white">Asistencia</h2>
      </header>
      {/* Gráfico con Chart.js 3 */}
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardCard06;