import { Phone, Clock, User } from 'lucide-react';
import type { ServiceOrder } from '../types';

interface ServiceOrderTableProps {
  orders: ServiceOrder[];
  onStatusChange: (id: string, status: ServiceOrder['status']) => void;
}

export function ServiceOrderTable({ orders, onStatusChange }: ServiceOrderTableProps) {
  const getStatusColor = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'parts-ordered': return 'bg-green-100 text-green-800';
      case 'needs-tech': return 'bg-red-100 text-red-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.procId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {order.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.modelNumber}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {order.booking}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => onStatusChange(order.id, 'parts-ordered')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Parts Ordered
                    </button>
                    <button
                      onClick={() => onStatusChange(order.id, 'needs-tech')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Need Tech
                    </button>
                    <button
                      onClick={() => onStatusChange(order.id, 'waiting')}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Waiting
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}