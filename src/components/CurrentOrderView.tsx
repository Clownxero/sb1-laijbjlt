import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MapPin, Package, Hash, FileText, Save, Clock, Check, Copy, Building2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractZipCode, findVendorByZip } from '../utils/zipLookup';
import type { ServiceOrder, VendorInfo } from '../types';

interface CurrentOrderViewProps {
  order: ServiceOrder;
  onStatusChange: (status: ServiceOrder['status'] | ServiceOrder) => void;
  onClear: () => void;
}

export function CurrentOrderView({ order, onStatusChange, onClear }: CurrentOrderViewProps) {
  const [workingNotes, setWorkingNotes] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [showCopied, setShowCopied] = useState<'phone' | 'order' | 'orderPart' | 'locationZip' | null>(null);
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(order.vendorInfo || null);

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutes(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = async (type: 'phone' | 'order' | 'orderPart' | 'locationZip') => {
    try {
      let textToCopy = '';
      switch (type) {
        case 'phone':
          textToCopy = order.phone;
          break;
        case 'order':
          textToCopy = order.id.replace(/^0{3}/, ''); // Remove leading zeros
          break;
        case 'orderPart':
          textToCopy = order.id.split('-')[1]; // Get only the part after the dash
          break;
        case 'locationZip':
          textToCopy = vendorInfo?.locationZip.replace('LOC', '') || '';
          break;
      }
      await navigator.clipboard.writeText(textToCopy);
      setShowCopied(type);
      setTimeout(() => setShowCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSaveNotes = () => {
    if (workingNotes.trim()) {
      const updatedOrder = {
        ...order,
        notes: order.notes 
          ? `${order.notes}\n\n${workingNotes}` 
          : workingNotes
      };
      onStatusChange(updatedOrder);
      setWorkingNotes('');
    }
  };

  const handleCheckVendor = async () => {
    const zipCode = extractZipCode(order.address);
    if (zipCode) {
      try {
        const newVendorInfo = await findVendorByZip(zipCode);
        setVendorInfo(newVendorInfo);
        if (newVendorInfo) {
          onStatusChange({ ...order, vendorInfo: newVendorInfo });
        }
      } catch (error) {
        console.error('Error finding vendor by zip code:', error);
      }
    }
  };

  const handleStatusChange = (status: ServiceOrder['status']) => {
    onStatusChange({ ...order, status });
  };

  const StatusButton = ({ status, label, color }: { 
    status: ServiceOrder['status'], 
    label: string, 
    color: string 
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleStatusChange(status)}
      className={`btn-embossed w-full mb-3 ${color}`}
    >
      {label}
    </motion.button>
  );

  // Split the order ID into its parts
  const [prefix, suffix] = order.id.split('-');
  const formattedPrefix = prefix.replace(/^0{3}/, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="fractal-card shadow-[0_0_20px_rgba(0,149,255,0.3)] hover:shadow-[0_0_30px_rgba(0,149,255,0.5)] transition-shadow duration-300">
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{order.customerName}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy('order')}
                    className="text-lg font-bold text-gray-700 hover:text-blue-600 transition-colors relative group"
                  >
                    {formattedPrefix}
                    <AnimatePresence>
                      {showCopied === 'order' && (
                        <motion.span
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <span className="text-gray-400">-</span>
                  <button
                    onClick={() => handleCopy('orderPart')}
                    className="text-lg font-bold text-gray-700 hover:text-blue-600 transition-colors relative group"
                  >
                    {suffix}
                    <AnimatePresence>
                      {showCopied === 'orderPart' && (
                        <motion.span
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-50 
                  ${minutes >= 16 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                  <Clock className="h-4 w-4" />
                  <span>{minutes} min</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'parts-ordered' ? 'bg-green-100 text-green-800' :
                  order.status === 'needs-tech' ? 'bg-red-100 text-red-800' :
                  order.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <button
                  onClick={() => handleCopy('phone')}
                  className="flex items-center text-lg font-bold text-gray-700 hover:text-blue-600 transition-colors relative group"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{order.phone}</span>
                  <Copy className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100" />
                  <AnimatePresence>
                    {showCopied === 'phone' && (
                      <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{order.booking}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{order.address}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Package className="h-5 w-5 mr-2" />
                  <span>{order.modelNumber}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Hash className="h-5 w-5 mr-2" />
                  <span>{order.procId}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="eggshell-bg p-4 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Notes
                </label>
                <div className="relative">
                  <textarea
                    value={workingNotes}
                    onChange={(e) => setWorkingNotes(e.target.value)}
                    className="notes-input pr-24"
                    placeholder="Add your notes here..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveNotes}
                    disabled={!workingNotes.trim()}
                    className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg 
                    flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-l border-gray-100">
            <StatusButton
              status="parts-ordered"
              label="Parts Ordered"
              color="bg-green-600 hover:bg-green-700"
            />
            <StatusButton
              status="needs-tech"
              label="Need Tech"
              color="bg-red-600 hover:bg-red-700"
            />
            <StatusButton
              status="waiting"
              label="Waiting"
              color="bg-yellow-600 hover:bg-yellow-700"
            />

            <div className="mt-4 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckVendor}
                className="btn-embossed w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Check Vendor
              </motion.button>

              {vendorInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center mb-3">
                    <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Vendor Info</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="text-gray-500">Vendor</div>
                      <div className="font-medium text-gray-900">{vendorInfo.vendor}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Location</div>
                      <div className="font-medium text-gray-900">{vendorInfo.location}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Location Zip</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy('locationZip')}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 relative"
                        >
                          {vendorInfo.locationZip}
                          <Copy className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                          <AnimatePresence>
                            {showCopied === 'locationZip' && (
                              <motion.span
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded"
                              >
                                Copied!
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}