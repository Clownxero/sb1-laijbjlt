import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';
import type { ServiceOrder } from '../types';

export function SearchOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const { orderHistory, setCurrentOrder } = useOrderStore();

  const filteredOrders = orderHistory.filter((order) =>
    order.id.includes(searchTerm) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm)
  );

  const handleOrderClick = (order: ServiceOrder) => {
    setCurrentOrder(order);
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="fractal-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order number, customer name, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <motion.div layout className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={`${order.id}-${order.status}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleOrderClick(order)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer 
              transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{order.customerName}</h3>
                  <p className="text-sm text-gray-500">{order.id}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'parts-ordered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">{order.phone}</div>
            </motion.div>
          ))}
          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              No orders found matching your search
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}