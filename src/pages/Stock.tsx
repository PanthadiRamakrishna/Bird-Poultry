import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Stock = () => {
  const { stock, fetchStock } = useStore(); // Fetching saveStock from the store
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stockHistory, setStockHistory] = useState<any[]>([]); // Assume stock history is an array of data points

  useEffect(() => {
    const loadStockData = async () => {
      try {
        setLoading(true);
        await fetchStock(); // This will update state using the store
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        setError('Failed to fetch stock data');
        setLoading(false);
      }
    };
    loadStockData();
  }, [fetchStock]);

  // Mock stock history data (replace this with actual data from your backend)
  useEffect(() => {
    setStockHistory([
      { date: '2024-01-01', broiler: 200, layer: 150 },
      { date: '2024-01-02', broiler: 210, layer: 140 },
      { date: '2024-01-03', broiler: 220, layer: 130 },
      { date: '2024-01-04', broiler: 230, layer: 120 },
      { date: '2024-01-05', broiler: 240, layer: 110 },
    ]);
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: stockHistory.map((entry) => entry.date), // X-axis: Dates
    datasets: [
      {
        label: 'Broiler Stock',
        data: stockHistory.map((entry) => entry.broiler), // Y-axis: Broiler stock
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Layer Stock',
        data: stockHistory.map((entry) => entry.layer), // Y-axis: Layer stock
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Stock History',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Birds',
        },
        beginAtZero: true,
      },
    },
  };

  // Helper function for stock details with empty value handling
  const renderStockDetails = (
    title: string,
    birds?: number,
    weight?: number,
    showAverage: boolean = true
  ) => {
    const hasBirds = birds !== undefined && birds > 0;
    const hasWeight = weight !== undefined && weight > 0;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
        <div className="space-y-4">
          {hasBirds && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Total Birds</span>
              <span className="font-semibold">{birds}</span>
            </div>
          )}
          {hasWeight && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Total Weight</span>
              <span className="font-semibold">{weight} kg</span>
            </div>
          )}
          {showAverage && hasBirds && hasWeight && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Weight per Bird</span>
              <span className="font-semibold">
                {(weight / birds).toFixed(2)} kg
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderStockDetails('Broiler Stock', stock?.broiler?.birds, stock?.broiler?.weight)}
        {renderStockDetails('Layer Stock', stock?.layer?.birds, stock?.layer?.weight)}
      </div>

      {/* Stock History Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Stock History</h2>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Stock;
