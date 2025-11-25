import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, Category, RestaurantInfo, CartItem } from '../types';
import { CATEGORIES } from '../constants';
import { Search, Clock, Wifi, MapPin, Bell, Receipt, X, UtensilsCrossed, Plus, Minus, ShoppingBag, Trash2, LogOut, User } from 'lucide-react';

interface CustomerMenuProps {
  menu: MenuItem[];
  info: RestaurantInfo;
  tableId: string | null;
  onRequestWaiter: (type: 'call_waiter' | 'bill') => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onPlaceOrder: (items: CartItem[], total: number, customerName: string) => void;
  onExit: () => void;
}

const CustomerMenu: React.FC<CustomerMenuProps> = ({ 
    menu, info, tableId, onRequestWaiter, cart, setCart, onPlaceOrder, onExit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Item detail state
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');

  // Customer Name State
  const [customerName, setCustomerName] = useState('');

  // Reset item state when opening new item
  useEffect(() => {
      if (selectedItem) {
        setQuantity(1);
        setObservation('');
      }
  }, [selectedItem]);

  // Reset waiter call status after 30 seconds
  useEffect(() => {
      if (waiterCalled) {
          const timer = setTimeout(() => setWaiterCalled(false), 30000);
          return () => clearTimeout(timer);
      }
  }, [waiterCalled]);

  const handleCall = (type: 'call_waiter' | 'bill') => {
      if(window.confirm(type === 'call_waiter' ? 'Chamar o garçom para a mesa?' : 'Pedir a conta?')) {
        onRequestWaiter(type);
        setWaiterCalled(true);
        alert(type === 'call_waiter' ? 'Garçom chamado!' : 'Conta solicitada!');
      }
  };

  const addToCart = () => {
      if (!selectedItem) return;
      const newItem: CartItem = {
          ...selectedItem,
          quantity,
          observation: observation.trim()
      };
      setCart([...cart, newItem]);
      setSelectedItem(null);
  };

  const removeFromCart = (index: number) => {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, selectedCategory, searchTerm]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(val);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Hero / Header */}
      <div className="bg-white pb-2 shadow-sm rounded-b-3xl relative z-10">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-500 w-full rounded-b-[2rem] absolute top-0 left-0 z-0"></div>
        
        <div className="px-5 pt-16 relative z-10">
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 mt-2 relative">
                {/* Exit Button - Top Right of Card */}
                <button 
                    onClick={onExit}
                    className="absolute top-4 right-4 bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors shadow-sm active:scale-95"
                    title={tableId ? "Sair da Mesa" : "Voltar ao Início"}
                >
                    <LogOut className="w-4 h-4" />
                </button>

                <h1 className="text-xl font-bold text-gray-900 leading-tight pr-10">{info.name}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-2 mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                    <span className="truncate">{info.address}</span>
                </div>

                <div className="flex gap-2">
                    {tableId && (
                        <div className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-primary-100">
                            Mesa {tableId}
                        </div>
                    )}
                    <div className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center border border-gray-100">
                        <Wifi className="w-3 h-3 mr-1.5" />
                        {info.wifiName || 'Sem WiFi'}
                    </div>
                </div>
            </div>
        </div>

        {/* Search */}
        <div className="px-5 mt-6 mb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="O que deseja comer hoje?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-0 rounded-xl text-sm transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-0 bg-gray-50/95 backdrop-blur-md z-20 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100/50">
        <div className="flex overflow-x-auto px-5 gap-3 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === 'Todos' 
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105' 
                : 'bg-white text-gray-600 border border-gray-100 shadow-sm'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105' 
                  : 'bg-white text-gray-600 border border-gray-100 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="px-5 space-y-4 mt-4">
        {filteredItems.length === 0 ? (
           <div className="text-center py-16">
             <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-gray-500 font-medium">Nenhum prato encontrado.</p>
           </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className={`flex p-3 rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 active:scale-[0.98] transition-all cursor-pointer ${!item.available ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="w-28 h-28 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                 {item.imageUrl ? (
                    <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <UtensilsCrossed className="w-8 h-8" />
                    </div>
                )}
                 {item.prepTime && (
                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center shadow-sm">
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        {item.prepTime}m
                    </div>
                )}
              </div>

              <div className="flex-grow pl-4 flex flex-col justify-between py-1">
                <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-1.5">{item.name}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed font-light">{item.description}</p>
                </div>
                
                <div className="flex items-end justify-between mt-2">
                    <span className="font-bold text-gray-900 text-base">{formatCurrency(item.price)}</span>
                    {!item.available && (
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wide">Esgotado</span>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Actions */}
      {tableId && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-5 flex flex-col gap-3 items-center pointer-events-none">
            {/* View Cart Button if Items exist */}
            {cart.length > 0 && !isCartOpen && (
                 <button 
                    onClick={() => setIsCartOpen(true)}
                    className="w-full max-w-sm bg-gray-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-gray-900/30 flex items-center justify-between px-6 animate-slide-up pointer-events-auto"
                 >
                    <div className="flex items-center">
                        <div className="bg-white/20 px-2 py-1 rounded-md text-xs mr-3 font-mono">{cartItemCount}</div>
                        <span>Ver Pedido</span>
                    </div>
                    <span>{formatCurrency(cartTotal)}</span>
                 </button>
            )}

            {/* Waiter Actions */}
            <div className="flex gap-4 w-full max-w-sm pointer-events-auto">
                <button 
                    onClick={() => handleCall('call_waiter')}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center transition-all ${waiterCalled ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}
                >
                    <Bell className={`w-4 h-4 mr-2 ${waiterCalled ? 'text-white' : 'text-gray-900'}`} />
                    {waiterCalled ? 'Chamando...' : 'Chamar Garçom'}
                </button>
                <button 
                    onClick={() => handleCall('bill')}
                    className="w-14 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold shadow-lg flex items-center justify-center active:scale-95 transition-all hover:bg-gray-50"
                >
                    <Receipt className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedItem(null)}
          ></div>
          
          <div className="bg-white w-full max-w-lg mx-auto h-[90vh] rounded-t-[2rem] relative flex flex-col shadow-2xl animate-slide-up overflow-hidden">
            
            {/* Image Header */}
            <div className="relative h-64 w-full flex-shrink-0">
                 <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none"></div>
                 <img 
                    src={selectedItem.imageUrl || 'https://picsum.photos/600/400'} 
                    className="w-full h-full object-cover"
                    alt={selectedItem.name}
                 />
                 <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-5 right-5 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/30 transition-colors z-20"
                 >
                    <X className="w-6 h-6" />
                 </button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto bg-white -mt-6 rounded-t-[2rem] relative z-10 no-scrollbar">
                <div className="flex justify-between items-start mb-4">
                    <div className="pr-4">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1 block">{selectedItem.category}</span>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedItem.name}</h2>
                    </div>
                    <div className="text-xl font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg whitespace-nowrap">
                        {formatCurrency(selectedItem.price)}
                    </div>
                </div>
                
                <p className="text-gray-500 leading-relaxed text-base mb-8 font-light">
                    {selectedItem.description}
                </p>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {selectedItem.prepTime && (
                         <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100/50">
                            <Clock className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Preparo</p>
                                <p className="text-sm font-bold text-gray-900">{selectedItem.prepTime} min</p>
                            </div>
                        </div>
                    )}
                    {selectedItem.isVegetarian && (
                             <div className="flex items-center p-3 rounded-xl bg-green-50/50 border border-green-100/50">
                                <span className="text-lg mr-3">🌱</span>
                                <div>
                                    <p className="text-xs text-green-600 font-medium">Dieta</p>
                                    <p className="text-sm font-bold text-green-800">Vegetariano</p>
                                </div>
                            </div>
                        )}
                         {selectedItem.isSpicy && (
                             <div className="flex items-center p-3 rounded-xl bg-red-50/50 border border-red-100/50">
                                <span className="text-lg mr-3">🌶️</span>
                                <div>
                                    <p className="text-xs text-red-600 font-medium">Sabor</p>
                                    <p className="text-sm font-bold text-red-800">Picante</p>
                                </div>
                            </div>
                        )}
                </div>

                {/* Cart Form */}
                {tableId && selectedItem.available && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observações</label>
                            <textarea 
                                rows={2}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Ex: Sem cebola, molho à parte..."
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-gray-50 bg-white pb-10">
                {tableId && selectedItem.available ? (
                    <div className="flex gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl px-2">
                             <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-600 hover:text-gray-900"><Minus className="w-5 h-5" /></button>
                             <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                             <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-gray-600 hover:text-gray-900"><Plus className="w-5 h-5" /></button>
                        </div>
                        <button 
                            onClick={addToCart}
                            className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-center shadow-xl shadow-gray-200 active:scale-95 transition-transform flex items-center justify-center"
                        >
                            <span>Adicionar</span>
                            <span className="bg-white/20 ml-3 px-2 py-0.5 rounded text-sm">{formatCurrency(selectedItem.price * quantity)}</span>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold"
                    >
                        Fechar
                    </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
           <div className="fixed inset-0 z-50 flex items-end justify-center">
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={() => setIsCartOpen(false)}
              ></div>
              
              <div className="bg-white w-full max-w-lg mx-auto h-[85vh] rounded-t-[2rem] relative flex flex-col shadow-2xl animate-slide-up">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900">Seu Pedido</h2>
                      <button onClick={() => setIsCartOpen(false)} className="bg-gray-50 p-2 rounded-full text-gray-500"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                      {cart.length === 0 ? (
                          <div className="text-center py-10">
                              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500">Seu carrinho está vazio</p>
                          </div>
                      ) : (
                          cart.map((item, idx) => (
                              <div key={idx} className="flex gap-4">
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                      <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                          <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                                          <span className="font-medium text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">Qtd: {item.quantity}</p>
                                      {item.observation && (
                                          <p className="text-xs text-gray-400 italic mt-1 bg-gray-50 p-1 rounded">Obs: {item.observation}</p>
                                      )}
                                  </div>
                                  <button onClick={() => removeFromCart(idx)} className="text-gray-400 hover:text-red-500 self-center p-2">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))
                      )}
                  </div>

                  <div className="p-6 border-t border-gray-50 bg-white pb-10">
                      {/* Customer Name Input */}
                      {cart.length > 0 && (
                          <div className="mb-4">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Seu Nome (Para a Cozinha)</label>
                              <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <input 
                                      type="text"
                                      value={customerName}
                                      onChange={(e) => setCustomerName(e.target.value)}
                                      placeholder="Ex: João Silva"
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                  />
                              </div>
                          </div>
                      )}

                      <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-500">Total</span>
                          <span className="text-2xl font-bold text-gray-900">{formatCurrency(cartTotal)}</span>
                      </div>
                      <button 
                        onClick={() => {
                            if(!customerName.trim()) {
                                alert("Por favor, digite seu nome antes de enviar o pedido.");
                                return;
                            }
                            onPlaceOrder(cart, cartTotal, customerName);
                            setIsCartOpen(false);
                            setCustomerName(''); // Reset name after order
                        }}
                        disabled={cart.length === 0}
                        className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold shadow-xl shadow-primary-500/30 active:scale-95 transition-transform flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <ShoppingBag className="w-5 h-5 mr-2" /> Confirmar Pedido
                      </button>
                  </div>
              </div>
           </div>
      )}
    </div>
  );
};

export default CustomerMenu;