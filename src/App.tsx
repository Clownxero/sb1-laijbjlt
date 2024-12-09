import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { DataInput } from './components/DataInput';
import { CurrentOrderView } from './components/CurrentOrderView';
import { WaitingOrdersBar } from './components/WaitingOrdersBar';
import { SettingsPage } from './components/SettingsPage';
import { SearchOrders } from './components/SearchOrders';
import { useOrderStore } from './store/orderStore';
import type { ServiceOrder } from './types';

export default function App() {
  const { currentOrder, setCurrentOrder, addToHistory, orderHistory } = useOrderStore();

  const handleDataParsed = (newOrder: ServiceOrder) => {
    setCurrentOrder(newOrder);
    addToHistory(newOrder);
  };

  const handleStatusChange = (statusOrOrder: ServiceOrder['status'] | ServiceOrder) => {
    if (currentOrder) {
      const updatedOrder = typeof statusOrOrder === 'string'
        ? { ...currentOrder, status: statusOrOrder }
        : statusOrOrder;
      
      setCurrentOrder(updatedOrder);
      addToHistory(updatedOrder);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
        <Header />
        <div className="pb-6">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {currentOrder ? (
                    <CurrentOrderView
                      order={currentOrder}
                      onStatusChange={handleStatusChange}
                      onClear={() => setCurrentOrder(null)}
                    />
                  ) : (
                    <DataInput onDataParsed={handleDataParsed} />
                  )}
                  <WaitingOrdersBar
                    orders={orderHistory}
                    onOrderSelect={setCurrentOrder}
                  />
                </>
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/search" element={<SearchOrders />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}