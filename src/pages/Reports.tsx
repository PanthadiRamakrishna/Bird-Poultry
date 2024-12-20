import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';

export const Reports = () => {
  const { purchases, sales } = useStore();

  // Calculate summary statistics
  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const profit = totalSales - totalPurchases;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      {/* Summary Cards */}
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
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Net Profit</h2>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(profit)}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Birds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...purchases, ...sales]
                .sort((a, b) => {
                  const dateA = new Date(a.date); // Convert to Date object
                  const dateB = new Date(b.date); // Convert to Date object
                  return dateB.getTime() - dateA.getTime(); // Sort by date
                })
                .map((transaction, index) => (
                  <tr key={`${transaction._id}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()} {/* Format the date */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {'customerName' in transaction ? 'Sale' : 'Purchase'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.numberOfBirds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency('totalAmount' in transaction ? transaction.totalAmount : transaction.totalPrice)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
