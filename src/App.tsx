import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Purchases } from './pages/Purchases';
import  Sales  from './pages/Sales';
import Receipt from './pages/Receipt'; // Import the Receipt component

import  Stock  from './pages/Stock';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

function App() {
  const { currentUser, fetchPurchases, fetchSales, fetchStock } = useStore();

  useEffect(() => {
    if (currentUser) {
      fetchPurchases();
      fetchSales();
      fetchStock();
    }
  }, [currentUser, fetchPurchases, fetchSales, fetchStock]);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/receipt" element={<Receipt />} /> {/* Add receipt route */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

