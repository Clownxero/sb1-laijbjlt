import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Search, Settings, Home, Package } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { orderHistory } = useOrderStore();

  const completedOrders = orderHistory.filter(order => order.status === 'parts-ordered').length;

  return (
    <div className="header-gradient backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="py-6 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 metallic-gradient rounded-xl">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Service Order Management
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-xl">
              <Package className="h-5 w-5 text-green-400" />
              <span className="text-green-100 font-semibold">{completedOrders} Parts Ordered</span>
            </div>
          </div>
        </div>
        <div className="px-8 pb-4">
          <nav className="flex space-x-3">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/search"
              className={`nav-link ${isActive('/search') ? 'active' : ''}`}
            >
              <Search className="h-5 w-5 mr-2" />
              Search Orders
            </Link>
            <Link
              to="/settings"
              className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}