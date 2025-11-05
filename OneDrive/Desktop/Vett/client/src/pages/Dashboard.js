import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ShoppingCart, Package, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Stock Items',
      value: stats?.totalStockItems || 0,
      icon: Package,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base">Welcome to DRVET Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center gap-4">
                <div className={`${card.bgColor} ${card.color} p-3 rounded-xl`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">{card.value}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{card.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Order Status */}
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Order Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
              <AlertCircle className="text-orange-500" size={20} />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{stats?.pendingOrders || 0}</h3>
                <p className="text-sm text-gray-600">Pending Orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <TrendingUp className="text-green-500" size={20} />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{stats?.completedOrders || 0}</h3>
                <p className="text-sm text-gray-600">Completed Orders</p>
              </div>
            </div>
            {stats?.lowStockItems > 0 && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                <AlertCircle className="text-red-500" size={20} />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.lowStockItems}</h3>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.customerName || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">₹{order.totalAmount?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

