import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Store, 
  Warehouse, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-gray-100'
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { currentUser, setCurrentUser } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white p-4">
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-blue-600">Poultry Manager</h1>
              <p className="text-sm text-gray-500">Welcome, {currentUser?.name}</p>
            </div>

            <nav className="space-y-2 flex-1">
              <NavItem
                href="/"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                isActive={location.pathname === '/'}
              />
              {currentUser?.role === 'admin' && (
                <NavItem
                  href="/purchases"
                  icon={<ShoppingCart size={20} />}
                  label="Purchases"
                  isActive={location.pathname === '/purchases'}
                />
              )}
              <NavItem
                href="/sales"
                icon={<Store size={20} />}
                label="Sales"
                isActive={location.pathname === '/sales'}
              />
              <NavItem
                href="/stock"
                icon={<Warehouse size={20} />}
                label="Stock"
                isActive={location.pathname === '/stock'}
              />
              {currentUser?.role === 'admin' && (
                <NavItem
                  href="/reports"
                  icon={<BarChart3 size={20} />}
                  label="Reports"
                  isActive={location.pathname === '/reports'}
                />
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors mt-auto"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}