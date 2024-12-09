import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';
import { Download, Trash2, Info, Database, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { VendorManagement } from './VendorManagement';

export function SettingsPage() {
  const { orderHistory, clearHistory } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'general' | 'vendors'>('general');

  const handleExportCSV = () => {
    const headers = [
      'Service Order',
      'Customer Name',
      'Address',
      'Phone',
      'Model Number',
      'PROCID',
      'Original Booking',
      'Timestamp',
      'Notes',
      'Status'
    ];

    const csvContent = [
      headers.join(','),
      ...orderHistory.map(order => [
        order.id,
        `"${order.customerName.replace(/"/g, '""')}"`,
        `"${order.address.replace(/"/g, '""')}"`,
        order.phone,
        `"${order.modelNumber.replace(/"/g, '""')}"`,
        order.procId,
        `"${order.booking.replace(/"/g, '""')}"`,
        format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        `"${order.notes.replace(/"/g, '""')}"`,
        order.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `service-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'general'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Settings className="h-5 w-5 mr-2" />
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'vendors'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Database className="h-5 w-5 mr-2" />
          Vendor Management
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="fractal-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-blue-100 rounded-lg"
            >
              <Info className="h-6 w-6 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Export Data</h3>
              <p className="text-sm text-blue-700 mb-4">
                Download your service orders as a CSV file that can be opened in Excel, Google Sheets, or any spreadsheet software.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCSV}
                className="btn-embossed bg-blue-600 hover:bg-blue-700 flex items-center"
                disabled={orderHistory.length === 0}
              >
                <Download className="h-5 w-5 mr-2" />
                Export to CSV
              </motion.button>
            </div>

            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Clear Data</h3>
              <p className="text-sm text-red-700 mb-4">
                Remove all stored service orders. This action cannot be undone.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    await clearHistory();
                  }
                }}
                className="btn-embossed bg-red-600 hover:bg-red-700 flex items-center"
                disabled={orderHistory.length === 0}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Clear All Data
              </motion.button>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <h3 className="font-medium mb-2">How it works:</h3>
            <ol className="list-decimal pl-4 space-y-2">
              <li>All service orders are automatically saved in your browser's database</li>
              <li>Export to CSV anytime to use the data in your preferred spreadsheet software</li>
              <li>Data persists between sessions but is limited to this browser</li>
              <li>Regular exports are recommended to keep your data backed up</li>
            </ol>
          </div>
        </div>
      ) : (
        <VendorManagement />
      )}
    </motion.div>
  );
}