import React, { useState } from 'react';
import { MenuItem, Category, RestaurantInfo, WaiterRequest, Order } from '../types';
import { CATEGORIES } from '../constants';
import { storageService } from '../services/storageService';
import { generateDishDescription } from '../services/geminiService';
import { Plus, Edit2, Trash2, Eye, LayoutGrid, QrCode, Sparkles, Loader2, Save, X, BellRing, CheckCircle, LogOut, Receipt, Clock, ChefHat, Settings, Wifi, MapPin, Store } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface AdminDashboardProps {
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  info: RestaurantInfo;
  onUpdateInfo: (info: RestaurantInfo) => void;
  onLogout: () => void;
  requests: WaiterRequest[];
  onResolveRequest: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    menu, setMenu, info, onUpdateInfo, onLogout, requests, onResolveRequest, orders, onUpdateOrderStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'orders' | 'menu' | 'qrcode' | 'settings'>('menu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<RestaurantInfo>(info);
  
  // QR Code State
  const [tableNum, setTableNum] = useState('1');

  // Stats
  const viewsToday = storageService.getTodayViews();
  const activeItems = menu.filter(i => i.available).length;

  // Form State
  const [formData, setFormData] = useState<Partial<MenuItem>>({
      category: 'Pratos Principais',
      available: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEdit = (item: MenuItem) => {
      setEditingItem(item);
      setFormData(item);
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Tem certeza que deseja apagar este prato?')) {
          const newMenu = menu.filter(item => item.id !== id);
          setMenu(newMenu);
          storageService.saveMenu(newMenu);
      }
  };

  const handleToggleAvailability = (id: string) => {
      const newMenu = menu.map(item => {
          if (item.id === id) return { ...item, available: !item.available };
          return item;
      });
      setMenu(newMenu);
      storageService.saveMenu(newMenu);
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
        alert("Por favor, digite o nome do prato primeiro.");
        return;
    }
    setIsGenerating(true);
    const desc = await generateDishDescription(formData.name, formData.category || 'Pratos Principais');
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      
      let newMenu = [...menu];
      
      if (editingItem) {
          // Update
          newMenu = newMenu.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as MenuItem : item);
      } else {
          // Create
          const newItem: MenuItem = {
              ...formData as MenuItem,
              id: Date.now().toString(),
              imageUrl: formData.imageUrl || `https://picsum.photos/600/400?random=${Date.now()}` // Fallback image
          };
          newMenu.push(newItem);
      }

      setMenu(newMenu);
      storageService.saveMenu(newMenu);
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ category: 'Pratos Principais', available: true });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateInfo(settingsForm);
      alert('Informações atualizadas com sucesso!');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);
  };

  // Derived Values
  const pendingRequests = requests.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        {/* Admin Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
            <div className="flex items-center text-white">
                <div className="bg-primary-600 p-1.5 rounded-lg mr-3">
                     <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-none">MenuFácil</h1>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{info.name || 'Administrador'}</span>
                </div>
            </div>
            <button 
                className="flex items-center text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 bg-gray-800/50 px-4 py-2 rounded-xl border border-red-900/30 transition-all" 
                onClick={onLogout}
            >
                <LogOut className="w-3.5 h-3.5 mr-1.5" /> SAIR
            </button>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-[72px] z-20 px-4 pt-4 pb-0 overflow-x-auto no-scrollbar">
            <div className="flex space-x-6">
                 <button 
                    onClick={() => setActiveTab('menu')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center flex-shrink-0 ${activeTab === 'menu' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Cardápio
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center flex-shrink-0 ${activeTab === 'orders' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Pedidos
                    {pendingOrders > 0 && (
                        <span className="ml-2 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {pendingOrders}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('live')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center flex-shrink-0 ${activeTab === 'live' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Chamados
                    {pendingRequests > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                            {pendingRequests}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('qrcode')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center flex-shrink-0 ${activeTab === 'qrcode' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    QR Codes
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center flex-shrink-0 ${activeTab === 'settings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Ajustes
                </button>
            </div>
        </div>

        {/* Main Content */}
        <main className="px-4 py-6 max-w-3xl mx-auto">
            
            {/* Stats Overview (Only on Menu tab) */}
            {activeTab === 'menu' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-28">
                        <div className="bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 mb-2">
                             <Eye className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{viewsToday}</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Visualizações Hoje</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-28">
                        <div className="bg-green-50 w-8 h-8 rounded-lg flex items-center justify-center text-green-600 mb-2">
                             <LayoutGrid className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{activeItems}</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pratos Ativos</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'live' && (
                 <div className="space-y-4">
                     <h2 className="text-lg font-bold text-gray-900 mb-4">Solicitações de Mesas</h2>
                     {requests.length === 0 ? (
                         <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                             <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                 <BellRing className="w-6 h-6 text-gray-300" />
                             </div>
                             <p className="text-gray-500 text-sm">Nenhum chamado no momento.</p>
                         </div>
                     ) : (
                         requests.map(req => (
                             <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-primary-500 flex justify-between items-center animate-slide-up">
                                 <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg font-bold text-gray-900">Mesa {req.tableId}</span>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {new Date(req.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                     </div>
                                     <p className="text-gray-600 text-sm font-medium flex items-center">
                                         {req.type === 'call_waiter' ? '🙋‍♂️ Chamando Garçom' : '📄 Pediu a Conta'}
                                     </p>
                                 </div>
                                 <button 
                                    onClick={() => onResolveRequest(req.id)}
                                    className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                                 >
                                     <CheckCircle className="w-6 h-6" />
                                 </button>
                             </div>
                         ))
                     )}
                 </div>
            )}

            {activeTab === 'orders' && (
                 <div className="space-y-6">
                     <h2 className="text-lg font-bold text-gray-900">Pedidos de Cozinha</h2>
                     {orders.length === 0 ? (
                         <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                             <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                 <Receipt className="w-6 h-6 text-gray-300" />
                             </div>
                             <p className="text-gray-500 text-sm">Nenhum pedido recebido ainda.</p>
                         </div>
                     ) : (
                         [...orders].sort((a,b) => b.timestamp - a.timestamp).map(order => (
                             <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                                 <div className={`p-4 flex justify-between items-center ${order.status === 'pending' ? 'bg-orange-50' : order.status === 'preparing' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                     <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-gray-900">Mesa {order.tableId}</span>
                                            {order.status === 'pending' && <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Novo</span>}
                                            {order.status === 'preparing' && <span className="bg-blue-200 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Preparando</span>}
                                            {order.status === 'ready' && <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pronto</span>}
                                        </div>
                                        <div className="flex flex-col mt-1">
                                            {order.customerName && (
                                                <p className="text-sm font-bold text-primary-700">👤 {order.customerName}</p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • #{order.id.slice(-4)}
                                            </p>
                                        </div>
                                     </div>
                                     <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                                 </div>
                                 <div className="p-4 border-t border-gray-100 bg-white">
                                     <ul className="space-y-2 mb-4">
                                         {order.items.map((item, idx) => (
                                             <li key={idx} className="flex justify-between items-start text-sm">
                                                 <div className="flex gap-2">
                                                     <span className="font-bold text-gray-900">{item.quantity}x</span>
                                                     <span className="text-gray-700">{item.name}</span>
                                                 </div>
                                                 {item.observation && (
                                                     <p className="text-xs text-gray-500 italic mt-0.5 ml-6 bg-gray-50 p-1 rounded">" {item.observation} "</p>
                                                 )}
                                             </li>
                                         ))}
                                     </ul>
                                     
                                     <div className="flex gap-2 mt-4">
                                         {order.status === 'pending' && (
                                             <button 
                                                onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                                                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex justify-center items-center"
                                             >
                                                <ChefHat className="w-4 h-4 mr-2" /> Aceitar Pedido
                                             </button>
                                         )}
                                         {order.status === 'preparing' && (
                                             <button 
                                                onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                                                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors flex justify-center items-center"
                                             >
                                                <CheckCircle className="w-4 h-4 mr-2" /> Marcar Pronto
                                             </button>
                                         )}
                                          {order.status === 'ready' && (
                                             <button 
                                                onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                                                className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                                             >
                                                Concluir / Entregue
                                             </button>
                                         )}
                                     </div>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
            )}

            {activeTab === 'menu' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Seus Pratos</h2>
                        <button 
                            onClick={() => {
                                setEditingItem(null);
                                setFormData({ category: 'Pratos Principais', available: true, price: 0 });
                                setIsModalOpen(true);
                            }}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-semibold transition-all shadow-lg active:scale-95"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Novo Prato
                        </button>
                    </div>

                    <div className="space-y-3">
                        {menu.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                    <img src={item.imageUrl} alt="" className={`w-full h-full object-cover ${!item.available ? 'grayscale opacity-50' : ''}`} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center">
                                        <h3 className="font-semibold text-gray-900 truncate text-sm">{item.name}</h3>
                                        {!item.available && <span className="ml-2 text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">Esgotado</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">{formatCurrency(item.price)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleToggleAvailability(item.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.available ? 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500' : 'bg-green-50 text-green-600'}`}
                                        title={item.available ? "Marcar Esgotado" : "Ativar Prato"}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                    </button>
                                    <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'qrcode' && (
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="bg-white w-full p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número da Mesa</label>
                        <div className="flex gap-2 mb-6">
                            <input 
                                type="number" 
                                value={tableNum} 
                                onChange={(e) => setTableNum(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="1"
                            />
                            <div className="px-4 py-2 bg-gray-100 rounded-xl text-gray-500 font-mono text-sm flex items-center">
                                ?table={tableNum}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-white p-3 rounded-xl border-2 border-gray-900 shadow-xl mb-4">
                                <QRCodeSVG 
                                    value={`${window.location.href.split('?')[0]}?table=${tableNum}`}
                                    size={220}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>
                            <p className="text-sm font-bold text-gray-900">Mesa {tableNum}</p>
                            <p className="text-xs text-gray-500">Scanear para testar</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => window.print()}
                        className="w-full flex items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        <QrCode className="w-5 h-5 mr-2" /> Imprimir Etiqueta
                    </button>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                         <div className="bg-primary-50 p-2 rounded-lg">
                            <Settings className="w-5 h-5 text-primary-600" />
                         </div>
                         <h2 className="text-lg font-bold text-gray-900">Configurações do Restaurante</h2>
                    </div>
                    
                    <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                <Store className="w-3 h-3 mr-2" /> Identidade
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Restaurante</label>
                                <input 
                                    type="text" 
                                    value={settingsForm.name}
                                    onChange={e => setSettingsForm({...settingsForm, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                                <input 
                                    type="text" 
                                    value={settingsForm.slogan || ''}
                                    onChange={e => setSettingsForm({...settingsForm, slogan: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                <MapPin className="w-3 h-3 mr-2" /> Localização & Contato
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                                <input 
                                    type="text" 
                                    value={settingsForm.address}
                                    onChange={e => setSettingsForm({...settingsForm, address: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <input 
                                    type="text" 
                                    value={settingsForm.phone}
                                    onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                         <div className="space-y-4 pt-2">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                <Wifi className="w-3 h-3 mr-2" /> WiFi para Clientes
                            </h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Rede</label>
                                    <input 
                                        type="text" 
                                        value={settingsForm.wifiName || ''}
                                        onChange={e => setSettingsForm({...settingsForm, wifiName: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                    <input 
                                        type="text" 
                                        value={settingsForm.wifiPassword || ''}
                                        onChange={e => setSettingsForm({...settingsForm, wifiPassword: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button 
                                type="submit"
                                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center shadow-lg"
                            >
                                <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>

        {/* Edit Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto animate-slide-up no-scrollbar">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-lg font-bold text-gray-900">{editingItem ? 'Editar Prato' : 'Novo Prato'}</h2>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <form onSubmit={handleSave} className="p-6 space-y-5">
                        {/* Image Preview (Mock) */}
                        <div className="w-full h-44 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 cursor-pointer transition-all">
                            {formData.imageUrl && !formData.imageUrl.includes('random') ? (
                                <img src={formData.imageUrl} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                            ) : (
                                <>
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                                        <Plus className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">Adicionar Foto</span>
                                </>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Prato</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name || ''} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                placeholder="Ex: Mufete Completo"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoria</label>
                                <select 
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Preço (Kz)</label>
                                <input 
                                    required
                                    type="number" 
                                    value={formData.price || ''} 
                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                         <div>
                             <div className="flex justify-between items-center mb-1.5">
                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</label>
                                 <button 
                                     type="button"
                                     onClick={handleGenerateDescription}
                                     disabled={isGenerating || !formData.name}
                                     className="text-[10px] flex items-center bg-primary-50 text-primary-700 px-2 py-1 rounded-md font-bold disabled:opacity-50 hover:bg-primary-100 transition-colors"
                                 >
                                     {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Sparkles className="w-3 h-3 mr-1"/>}
                                     {isGenerating ? 'Criando...' : 'Gerar IA'}
                                 </button>
                             </div>
                             <textarea 
                                 required
                                 rows={3}
                                 value={formData.description || ''}
                                 onChange={e => setFormData({...formData, description: e.target.value})}
                                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm leading-relaxed"
                                 placeholder="Descreva os ingredientes..."
                             />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-3">
                             <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tempo (min)</label>
                                <input 
                                    type="number" 
                                    value={formData.prepTime || ''} 
                                    onChange={e => setFormData({...formData, prepTime: Number(e.target.value)})}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="20"
                                />
                             </div>
                             <div className="col-span-1 flex flex-col justify-end">
                                 <label className="flex items-center space-x-2 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-50 h-[50px]">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isVegetarian || false} 
                                        onChange={e => setFormData({...formData, isVegetarian: e.target.checked})}
                                        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Vegetariano</span>
                                </label>
                             </div>
                         </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-xl shadow-gray-200 flex justify-center items-center transition-transform active:scale-95"
                            >
                                <Save className="w-4 h-4 mr-2" /> Salvar Prato
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;