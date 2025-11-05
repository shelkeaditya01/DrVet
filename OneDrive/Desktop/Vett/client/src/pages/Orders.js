import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ stockId: '', quantity: 1 }],
    totalAmount: 0,
    status: 'pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, customersRes, stockRes] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/customers'),
        axios.get('/api/stock')
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setStock(stockRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach(item => {
      const stockItem = stock.find(s => s.id === item.stockId);
      if (stockItem) {
        total += stockItem.price * item.quantity;
      }
    });
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalAmount = calculateTotal(formData.items);
      const orderData = {
        ...formData,
        totalAmount,
        customerName: customers.find(c => c.id === formData.customerId)?.name || ''
      };
      await axios.post('/api/orders', orderData);
      fetchData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.error || 'Error creating order');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/orders/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    }
  };

  const addOrderItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { stockId: '', quantity: 1 }]
    });
  };

  const removeOrderItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateOrderItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      items: [{ stockId: '', quantity: 1 }],
      totalAmount: 0,
      status: 'pending'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Orders</h1>
          <p className="text-gray-600 text-sm md:text-base">Manage customer orders</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          New Order
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input w-full md:w-48"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Order #</th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-medium text-gray-800">{order.orderNumber}</td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600">{order.customerName || 'N/A'}</td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-medium text-gray-800">₹{order.totalAmount?.toLocaleString() || 0}</td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedOrder ? 'Order Details' : 'New Order'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {selectedOrder ? (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold capitalize">{selectedOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">₹{selectedOrder.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
                {selectedOrder.items && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Items</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => {
                        const stockItem = stock.find(s => s.id === item.stockId);
                        return stockItem ? (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">{stockItem.productName}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity} × ₹{stockItem.price} = ₹{item.quantity * stockItem.price}</p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
                  <select
                    required
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="input"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Order Items *</label>
                    <button
                      type="button"
                      onClick={addOrderItem}
                      className="text-sm text-primary hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                  {formData.items.map((item, index) => {
                    const stockItem = stock.find(s => s.id === item.stockId);
                    return (
                      <div key={index} className="mb-3 p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                            <select
                              required
                              value={item.stockId}
                              onChange={(e) => updateOrderItem(index, 'stockId', e.target.value)}
                              className="input"
                            >
                              <option value="">Select Product</option>
                              {stock.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.productName} (₹{s.price}, Stock: {s.quantity})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                required
                                min="1"
                                max={stockItem?.quantity || 0}
                                value={item.quantity}
                                onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                className="input"
                              />
                              {formData.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeOrderItem(index)}
                                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            {stockItem && (
                              <p className="text-xs text-gray-500 mt-1">
                                Subtotal: ₹{(item.quantity * stockItem.price).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">₹{calculateTotal(formData.items).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
