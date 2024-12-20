import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';

export const Dashboard = () => {
  const { purchases, sales, stock, fetchStock } = useStore();
  const [loadingStock, setLoadingStock] = useState<boolean>(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);

  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  const recentSales = sales.slice(-5).reverse();

  // Fetch stock data on mount
  useEffect(() => {
    const loadStockData = async () => {
      try {
        setLoadingStock(true);
        await fetchStock();
        setLoadingStock(false);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        setErrorStock('Failed to fetch stock data');
        setLoadingStock(false);
      }
    };
    loadStockData();
  }, [fetchStock]);

  // Render stock details
  const renderStockDetails = (
    title: string,
    birds: number,
    weight: number | undefined,
    showAverage: boolean = true
  ) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-600">Total Birds</span>
          <span className="font-semibold">{birds || 0}</span>
        </div>
        {weight !== undefined && (
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Total Weight</span>
            <span className="font-semibold">{weight ? `${weight} kg` : '0 kg'}</span>
          </div>
        )}
        {showAverage && weight !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Weight per Bird</span>
            <span className="font-semibold">
              {birds > 0 ? (weight / birds).toFixed(2) : '0'} kg
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

    
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Purchases</h2>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPurchases)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h2>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalSales)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Profit</h2>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalSales - totalPurchases)}</p>
        </div>
      </div>

        {/* Stock Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Broiler and Layer Stock Details */}
        {renderStockDetails('Broiler Stock', stock?.broiler?.birds || 0, stock?.broiler?.weight)}
        {renderStockDetails('Layer Stock', stock?.layer?.birds || 0, undefined, false)}
      </div>

      {/* Loading and Error for Stock */}
      {loadingStock && <p className="text-gray-500">Loading stock data...</p>}
      {errorStock && <p className="text-red-500">{errorStock}</p>}


      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div key={sale._id} className="border-b pb-2">
              <p className="font-medium">Sale to {sale.customerName}</p>
              <p className="text-sm text-gray-500">
                {sale.type} - {sale.numberOfBirds} birds - {formatCurrency(sale.totalAmount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
