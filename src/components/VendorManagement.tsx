import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Building2, MapPin, Save, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { firebaseOperations } from '../utils/firebase-operations';
import type { VendorLocation } from '../types';
import { useVendorStore } from '../store/vendorStore';
import { findVendorByZip } from '../utils/zipLookup';

export function VendorManagement() {
  const [vendors, setVendors] = useState<{ id: string, name: string }[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<VendorLocation | null>(null);
  const [newLocation, setNewLocation] = useState<VendorLocation>({
    name: '',
    locationZip: '',
    serviceZips: []
  });
  const [newZipCode, setNewZipCode] = useState('');
  const [searchZip, setSearchZip] = useState('');
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vendorMap = useVendorStore((state) => state.vendorMap);
  const vendorLocations = useVendorStore((state) => state.vendorLocations);
  const setVendorMap = useVendorStore((state) => state.setVendorMap);
  const setVendorLocations = useVendorStore((state) => state.setVendorLocations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorList = await firebaseOperations.getAllVendors();
        setVendors(vendorList);
        const vendorMap = vendorList.reduce((acc, vendor) => {
          acc[vendor.id] = vendor.name;
          return acc;
        }, {} as Record<string, string>);
        setVendorMap(vendorMap);

        const locationList = await firebaseOperations.getAllLocations();
        const vendorLocations = locationList.reduce((acc, location) => {
          if (!acc[location.vendorId]) {
            acc[location.vendorId] = [];
          }
          acc[location.vendorId].push(location);
          return acc;
        }, {} as Record<string, VendorLocation[]>);
        for (const vendorId in vendorLocations) {
          setVendorLocations(vendorId, vendorLocations[vendorId]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch vendors and locations.');
      }
    };

    fetchData();
  }, [setVendorMap, setVendorLocations]);

  const fetchLocations = async () => {
    try {
      const locationList = await firebaseOperations.getAllLocations();
      const vendorLocations = locationList.reduce((acc, location) => {
        if (!acc[location.vendorId]) {
          acc[location.vendorId] = [];
        }
        acc[location.vendorId].push(location);
        return acc;
      }, {} as Record<string, VendorLocation[]>);
      for (const vendorId in vendorLocations) {
        setVendorLocations(vendorId, vendorLocations[vendorId]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations.');
    }
  };

  const filteredLocations = useMemo(() => 
    selectedVendor ? vendorLocations[selectedVendor] || [] : [],
    [vendorLocations, selectedVendor]
  );

  const handleAddLocation = async () => {
    if (newLocation.name && newLocation.locationZip && selectedVendor) {
      try {
        await firebaseOperations.createLocation({
          ...newLocation,
          vendorId: selectedVendor,
          serviceZips: []
        });
        setNewLocation({ name: '', locationZip: '', serviceZips: [] });
        setIsAddingLocation(false);
        fetchLocations(); // Refresh locations
      } catch (error) {
        console.error('Error adding location:', error);
        setError('Failed to add location.');
      }
    }
  };

  const handleAddZipCode = async () => {
    if (selectedLocation && newZipCode.trim() && /^\d{5}$/.test(newZipCode)) {
      try {
        if (!selectedLocation.serviceZips.includes(newZipCode)) {
          await firebaseOperations.addZipCode(selectedLocation.locationZip, newZipCode);
          setNewZipCode('');
          fetchLocations(); // Refresh locations
        } else {
          setError('ZIP code already exists.');
        }
      } catch (error) {
        console.error('Error adding ZIP code:', error);
        setError('Failed to add ZIP code.');
      }
    }
  };

  const handleRemoveZipCode = async (locationZip: string, zipCode: string) => {
    try {
      await firebaseOperations.removeZipCode(locationZip, zipCode);
      fetchLocations(); // Refresh locations
    } catch (error) {
      console.error('Error removing ZIP code:', error);
      setError('Failed to remove ZIP code.');
    }
  };

  const handleSearchZip = async () => {
    if (searchZip.trim() && /^\d{5}$/.test(searchZip)) {
      const vendorInfo = await findVendorByZip(searchZip);
      if (vendorInfo) {
        setSelectedVendor(vendorInfo.vendor);
        setSelectedLocation({
          name: vendorInfo.location,
          locationZip: vendorInfo.locationZip,
          serviceZips: []
        });
      } else {
        setError('No vendor found for the given ZIP code.');
      }
    } else {
      setError('Invalid ZIP code.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="fractal-card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Building2 className="h-6 w-6 mr-2 text-blue-600" />
          Vendor Management
        </h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendor</label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Vendors</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
            {selectedVendor && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddingLocation(true)}
                className="btn-embossed bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </motion.button>
            )}
          </div>

          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <motion.div
                key={location.locationZip}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedLocation?.locationZip === location.locationZip 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.locationZip}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {location.serviceZips.length} ZIP codes
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isAddingLocation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900">Add New Location</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    placeholder="Location name..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newLocation.locationZip}
                    onChange={(e) => setNewLocation({ ...newLocation, locationZip: e.target.value })}
                    placeholder="Location ZIP (LOCxxxxx)..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddLocation}
                      className="btn-embossed bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Location
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAddingLocation(false)}
                      className="btn-embossed bg-gray-600 hover:bg-gray-700"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedLocation && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedLocation.name} - ZIP Codes
            </h3>

            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newZipCode}
                  onChange={(e) => setNewZipCode(e.target.value)}
                  placeholder="Add ZIP code..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddZipCode}
                  className="btn-embossed bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add ZIP
                </motion.button>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  placeholder="Search ZIP codes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedLocation.serviceZips
                .filter(zip => zip.includes(searchZip))
                .map((zip) => (
                  <div
                    key={zip}
                    className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm flex items-center group"
                  >
                    {zip}
                    <button
                      onClick={() => handleRemoveZipCode(selectedLocation.locationZip, zip)}
                      className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Search Vendor by ZIP Code
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchZip}
              onChange={(e) => setSearchZip(e.target.value)}
              placeholder="Enter ZIP code..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearchZip}
              className="btn-embossed bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}