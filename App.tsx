import React, { useState, useEffect } from 'react';
import CustomerMenu from './components/CustomerMenu';
import AdminDashboard from './components/AdminDashboard';
import Registration from './components/Registration';
import { storageService } from './services/storageService';
import { MenuItem, RestaurantInfo, WaiterRequest, CartItem, Order } from './types';
import { UtensilsCrossed, ChevronRight, Lock, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'customer' | 'admin' | 'register'>('landing');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [info, setInfo] = useState<RestaurantInfo>(storageService.getRestaurantInfo());
  const [loading, setLoading] = useState(true);
  const [tableId, setTableId] = useState<string | null>(null);
  
  // State for waiter requests and orders (Shared)
  const [waiterRequests, setWaiterRequests] = useState<WaiterRequest[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Simulate loading splash screen
  useEffect(() => {
    // Check for table param in URL immediately
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
        setTableId(tableParam);
        // If table is present, go straight to customer view after splash
        setTimeout(() => {
            setView('customer');
            setLoading(false);
        }, 2000);
    } else {
        setTimeout(() => setLoading(false), 2000);
    }

    const loadedMenu = storageService.getMenu();
    setMenu(loadedMenu);
  }, []);

  const handleRequestWaiter = (type: 'call_waiter' | 'bill') => {
      if (!tableId) return;
      const newRequest: WaiterRequest = {
          id: Date.now().toString(),
          tableId,
          timestamp: Date.now(),
          status: 'pending',
          type
      };
      setWaiterRequests(prev => [newRequest, ...prev]);
  };

  const handleResolveRequest = (reqId: string) => {
      setWaiterRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handlePlaceOrder = (items: CartItem[], total: number, customerName: string) => {
      if (!tableId) return;
      const newOrder: Order = {
          id: Date.now().toString(),
          tableId,
          customerName,
          items,
          total,
          status: 'pending',
          timestamp: Date.now()
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]); // Clear cart
      alert(`Obrigado ${customerName}! Seu pedido foi enviado para a cozinha.`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleRegistrationComplete = (newInfo: RestaurantInfo) => {
      setInfo(newInfo);
      storageService.saveRestaurantInfo(newInfo);
      // Optional: Clear default menu if you want a fresh start, or keep it as example
      setView('admin');
  };

  const handleUpdateInfo = (newInfo: RestaurantInfo) => {
      setInfo(newInfo);
      storageService.saveRestaurantInfo(newInfo);
  };

  const handleExitTable = () => {
      const message = tableId ? "Deseja encerrar o atendimento nesta mesa e sair?" : "Deseja voltar para o início?";
      if(window.confirm(message)) {
          setTableId(null);
          setView('landing');
          // Clear URL params without refresh
          window.history.pushState({}, '', window.location.pathname);
      }
  };

  // Track customer views
  useEffect(() => {
      if (view === 'customer') {
          storageService.incrementViews();
      }
  }, [view]);

  // Splash Screen Component
  if (loading) {
      return (
          <div className="fixed inset-0 bg-primary-600 flex flex-col items-center justify-center z-50">
              <div className="bg-white p-4 rounded-full shadow-xl mb-4 animate-bounce">
                <UtensilsCrossed className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-white text-2xl font-bold tracking-tight">MenuFácil</h1>
              <div className="mt-8">
                  <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-white origin-left animate-[grow_1.5s_ease-in-out_infinite]"></div>
                  </div>
              </div>
          </div>
      );
  }

  if (view === 'register') {
      return (
          <Registration 
            onComplete={handleRegistrationComplete}
            onCancel={() => setView('landing')}
          />
      );
  }

  if (view === 'landing') {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
              {/* Abstract Background Shapes */}
              <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-primary-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-orange-100 rounded-full blur-3xl opacity-60"></div>

              <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-500/30 transform rotate-3">
                    <UtensilsCrossed className="text-white w-10 h-10" />
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">MenuFácil</h1>
                  <p className="text-gray-500 mb-12 text-center max-w-xs leading-relaxed">
                      A experiência gastronómica moderna para o seu restaurante.
                  </p>

                  <div className="w-full max-w-sm space-y-4">
                       <button 
                        onClick={() => setView('register')}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 rounded-xl font-bold shadow-xl shadow-primary-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 group border border-transparent"
                      >
                         <PlusCircle className="w-5 h-5" />
                         <span>Criar Menu Grátis</span>
                      </button>

                      <button 
                        onClick={() => setView('customer')}
                        className="w-full bg-white text-gray-900 p-4 rounded-xl font-semibold shadow-lg shadow-gray-100 border border-gray-100 active:scale-95 transition-all flex items-center justify-between group"
                      >
                         <span>Ver Menu Demo</span>
                         <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                      </button>
                      
                      <button 
                        onClick={() => setView('admin')}
                        className="w-full bg-transparent text-gray-500 p-3 rounded-xl font-medium hover:text-gray-900 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                      >
                         <Lock className="w-3 h-3" /> Acesso Admin (Demo)
                      </button>
                  </div>
              </div>
              
              <div className="p-6 text-center z-10">
                  <p className="text-gray-400 text-xs font-medium tracking-wide">
                      POWERED BY MENUFÁCIL
                  </p>
              </div>
          </div>
      )
  }

  if (view === 'admin') {
      return (
        <AdminDashboard 
            menu={menu} 
            setMenu={setMenu} 
            info={info} 
            onUpdateInfo={handleUpdateInfo}
            onLogout={() => setView('landing')}
            requests={waiterRequests}
            onResolveRequest={handleResolveRequest}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      );
  }

  return (
    <CustomerMenu 
        menu={menu} 
        info={info} 
        tableId={tableId}
        onRequestWaiter={handleRequestWaiter}
        cart={cart}
        setCart={setCart}
        onPlaceOrder={handlePlaceOrder}
        onExit={handleExitTable}
    />
  );
};

export default App;