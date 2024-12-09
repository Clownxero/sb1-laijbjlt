import { motion } from 'framer-motion';
import { Clock, Hash } from 'lucide-react';
import type { ServiceOrder } from '../types';

interface WaitingOrdersBarProps {
  orders: ServiceOrder[];
  onOrderSelect: (order: ServiceOrder) => void;
}

export function WaitingOrdersBar({ orders, onOrderSelect }: WaitingOrdersBarProps) {
  const waitingOrders = orders
    .filter(order => order.status === 'waiting')
    .slice(0, 4);

  if (waitingOrders.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Waiting for Response
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {waitingOrders.map((order) => (
          <motion.div
            key={order.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOrderSelect(order)}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 cursor-pointer border border-white/20 
            shadow-[0_0_15px_rgba(255,255,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,0,0.5)]
            transition-all duration-300"
          >
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-yellow-300" />
                <span className="text-yellow-100 text-sm font-medium">
                  {order.id.replace(/^0{3}/, '')}
                </span>
              </div>
              <h4 className="font-medium mb-2">{order.customerName}</h4>
              <p className="text-sm text-white/70">{order.phone}</p>
              <p className="text-sm text-white/70 mt-2">{order.booking}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}