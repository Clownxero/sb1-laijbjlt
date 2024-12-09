import { Phone, Clock } from 'lucide-react';
import type { ServiceOrder } from '../types';

interface ActiveCallCardProps {
  order: ServiceOrder;
  onClick: () => void;
}

export function ActiveCallCard({ order, onClick }: ActiveCallCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{order.customerName}</h3>
          <p className="text-sm text-gray-500">{order.id}</p>
        </div>
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Waiting
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {order.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {order.booking}
        </div>
      </div>
    </div>
  );
}