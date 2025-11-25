import React, { useState } from 'react';
import { RestaurantInfo } from '../types';
import { Store, Wifi, MapPin, ChevronRight, Check, UtensilsCrossed, ArrowLeft } from 'lucide-react';

interface RegistrationProps {
  onComplete: (info: RestaurantInfo) => void;
  onCancel: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RestaurantInfo>({
    name: '',
    slogan: '',
    category: 'Restaurante',
    phone: '',
    address: '',
    wifiName: '',
    wifiPassword: ''
  });

  const categories = [
    'Restaurante', 'Bar / Esplanada', 'Café / Pastelaria', 'Fast Food', 'Churrascaria'
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  const isStepValid = () => {
    if (step === 1) return formData.name.length > 2;
    if (step === 2) return true;
    if (step === 3) return formData.address.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-100 flex items-center">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-4">
          <h1 className="text-lg font-bold text-gray-900">Criar Menu Grátis</h1>
          <div className="flex gap-1 mt-1">
            <div className={`h-1 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`h-1 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`h-1 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-primary-500' : 'bg-gray-200'}`} />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-lg mx-auto w-full">
        
        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center mb-8">
              <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Qual o nome do seu negócio?</h2>
              <p className="text-gray-500 mt-2">Isso aparecerá no topo do seu menu digital.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome do Estabelecimento</label>
              <input
                autoFocus
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Cantinho do Sabor"
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none text-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slogan (Opcional)</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                placeholder="Ex: O melhor mufete da vila"
                className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Category */}
        {step === 2 && (
          <div className="animate-slide-up space-y-6">
             <div className="text-center mb-8">
              <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Qual a categoria?</h2>
              <p className="text-gray-500 mt-2">Isso ajuda a organizar seu cardápio inicial.</p>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                    formData.category === cat 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{cat}</span>
                  {formData.category === cat && <Check className="w-5 h-5 text-primary-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Location & Wifi */}
        {step === 3 && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center mb-6">
               <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Informações Úteis</h2>
              <p className="text-gray-500 mt-2">Ajude seus clientes a te encontrarem.</p>
            </div>

             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Endereço / Localização</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Ex: Talatona, Rua do Banco"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telefone (WhatsApp)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+244 9..."
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
              />
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
               <h3 className="flex items-center text-blue-800 font-bold mb-3">
                 <Wifi className="w-4 h-4 mr-2" /> WiFi para Clientes (Opcional)
               </h3>
               <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    value={formData.wifiName}
                    onChange={(e) => setFormData({...formData, wifiName: e.target.value})}
                    placeholder="Nome da Rede"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
                   <input
                    type="text"
                    value={formData.wifiPassword}
                    onChange={(e) => setFormData({...formData, wifiPassword: e.target.value})}
                    placeholder="Senha do WiFi"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
               </div>
            </div>
          </div>
        )}

        <div className="flex-1"></div>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all mt-6"
        >
          {step === 3 ? 'Finalizar Cadastro' : 'Continuar'}
          {step < 3 && <ChevronRight className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </div>
  );
};

export default Registration;