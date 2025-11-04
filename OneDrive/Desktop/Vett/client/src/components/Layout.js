import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ShoppingCart, Package, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/stock', icon: Package, label: 'Stock' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-800 to-slate-700 text-white transition-all duration-300 z-50 shadow-2xl ${sidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-3xl">🐄</div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white">DRVET</h1>
                <p className="text-xs text-white/80 italic mt-1">पशुसेवा हीच ईश्वरसेवा</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-lg mb-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold border-l-4 border-secondary'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
