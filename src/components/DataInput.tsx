import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseServiceOrderText } from '../utils/parser';
import { extractZipCode, findVendorByZip } from '../utils/zipLookup';
import type { ServiceOrder } from '../types';

interface DataInputProps {
  onDataParsed: (data: ServiceOrder) => void;
}

export function DataInput({ onDataParsed }: DataInputProps) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const parsedData = parseServiceOrderText(inputText);
      const zipCode = extractZipCode(parsedData.address);
      const vendorInfo = zipCode ? await findVendorByZip(zipCode) : null;

      const serviceOrder: ServiceOrder = {
        ...parsedData,
        status: 'none',
        id: parsedData.serviceOrder,
        vendorInfo
      };

      onDataParsed(serviceOrder);
      setInputText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse service order');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-6 p-4"
    >
      <div className="fractal-card">
        <div className="p-6 border-b border-blue-50">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FileText className="h-6 w-6 text-blue-600" />
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-900">Service Order Data Entry</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="eggshell-bg rounded-xl overflow-hidden">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste service order text here..."
              className="w-full h-48 p-4 bg-transparent border-0 focus:ring-2 focus:ring-blue-500 
              resize-none placeholder-gray-400"
            />
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          <motion.div 
            className="mt-4 flex justify-end"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className="btn-embossed bg-blue-600 hover:bg-blue-700"
            >
              Parse Data
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}