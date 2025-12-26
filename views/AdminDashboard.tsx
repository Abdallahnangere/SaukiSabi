
import React, { useState } from 'react';
import { AppState, TransactionStatus, DataPlan, Network, Product, Agent } from '../types';
import { apiService } from '../services/apiService';
import { ChevronLeft, Plus, Trash2, Edit2, ShieldAlert, Check, X, LogOut, Package, Wifi, Users, ListFilter, UserCheck, UserX } from 'lucide-react';

interface AdminViewProps {
  state: AppState;
  onStateChange: (state: AppState) => void;
  onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ state, onStateChange, onBack }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'products' | 'agents' | 'tx'>('plans');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Forms
  const [planForm, setPlanForm] = useState<Partial<DataPlan>>({ network: 'MTN', size: '', price: 0, planId: 0 });
  const [prodForm, setProdForm] = useState<Partial<Product>>({ name: '', price: 0, description: '', inStock: true });

  const handleSavePlan = async () => {
    setLoading(true);
    try {
      const plan = { ...planForm, id: `plan_${Date.now()}`, validity: '30 Days' } as DataPlan;
      await apiService.saveDataPlan(plan);
      setIsAdding(false);
      // We don't onBack here, we just stay in admin and let the parent refresh
    } catch (e) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      const prod = { ...prodForm, id: `prod_${Date.now()}`, specifications: [], imageUrl: '/router.png' } as Product;
      await apiService.updateProduct(prod);
      setIsAdding(false);
    } catch (e) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAgentStatus = async (agent: Agent, status: 'APPROVED' | 'DECLINED') => {
    setLoading(true);
    try {
      await apiService.saveAgent({ ...agent, status });
    } catch (e) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <header className="bg-white border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 bg-gray-50 rounded-full text-gray-500"><ChevronLeft size={20} /></button>
          <h2 className="text-2xl font-black tracking-tighter">Sauki Management</h2>
        </div>
        <button onClick={onBack} className="text-red-500 font-black text-xs uppercase tracking-widest flex items-center">
          <LogOut size={16} className="mr-1" /> EXIT
        </button>
      </header>

      <nav className="p-4 grid grid-cols-4 gap-2 bg-white">
        {[
          { id: 'plans', icon: Wifi, label: 'Plans' },
          { id: 'products', icon: Package, label: 'Items' },
          { id: 'agents', icon: Users, label: 'Agents' },
          { id: 'tx', icon: ListFilter, label: 'Sales' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-[#0071e3] text-white shadow-lg' : 'text-gray-400'}`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-black uppercase mt-1 tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <button onClick={() => setIsAdding(true)} className="w-full bg-blue-50 text-[#0071e3] border-2 border-dashed border-blue-200 py-6 rounded-[2rem] font-black flex items-center justify-center">
              <Plus size={24} className="mr-2" /> NEW DATA PLAN
            </button>
            {state.dataPlans.map(plan => (
              <div key={plan.id} className="bg-white p-6 rounded-[1.8rem] flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-black text-lg text-[#1d1d1f]">{plan.size} - {plan.network}</h4>
                  <p className="text-xs font-bold text-[#0071e3]">₦{plan.price} (Amigo ID: {plan.planId})</p>
                </div>
                <button className="text-red-500 p-2 active:scale-90"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users size={16} className="text-[#0071e3]" />
              <p className="label-caps">Agent Applications</p>
            </div>
            {state.agents.map(agent => (
              <div key={agent.id} className="bg-white p-6 rounded-[1.8rem] shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-[#1d1d1f] text-lg">{agent.fullName}</h4>
                    <p className="text-xs font-bold text-gray-400">{agent.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${
                    agent.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                    agent.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                {agent.status === 'PENDING' && (
                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => handleAgentStatus(agent, 'APPROVED')}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center space-x-2"
                    >
                      <UserCheck size={14} /> <span>APPROVE</span>
                    </button>
                    <button 
                      onClick={() => handleAgentStatus(agent, 'DECLINED')}
                      className="flex-1 bg-red-50 text-red-500 py-3 rounded-xl text-xs font-black flex items-center justify-center space-x-2"
                    >
                      <UserX size={14} /> <span>DECLINE</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            {state.agents.length === 0 && (
              <div className="text-center py-20 text-gray-300 font-black uppercase tracking-widest text-xs">No agents found.</div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
             <button onClick={() => setIsAdding(true)} className="w-full bg-[#1d1d1f] text-white py-6 rounded-[2rem] font-black flex items-center justify-center">
              <Plus size={24} className="mr-2" /> ADD PRODUCT
            </button>
            {state.products.map(prod => (
              <div key={prod.id} className="bg-white p-6 rounded-[1.8rem] flex items-center space-x-6 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2"><img src={prod.imageUrl} className="w-full h-full object-contain" /></div>
                <div className="flex-1">
                  <h4 className="font-black text-[#1d1d1f]">{prod.name}</h4>
                  <p className="text-sm font-black text-[#0071e3]">₦{prod.price.toLocaleString()}</p>
                </div>
                <button className="text-gray-300"><Edit2 size={20} /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tx' && (
          <div className="space-y-4">
            {state.transactions.map(tx => (
              <div key={tx.id} className="bg-white p-6 rounded-[1.8rem] shadow-sm flex justify-between items-center">
                 <div>
                    <h4 className="font-black text-[#1d1d1f]">{tx.details}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{tx.phone} • {new Date(tx.timestamp).toLocaleDateString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-[#0071e3]">₦{tx.amount.toLocaleString()}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-green-500">{tx.status}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end">
          <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-8 animate-in slide-in-from-bottom duration-500">
            <h3 className="text-3xl font-black tracking-tighter">{activeTab === 'plans' ? 'Add Data Plan' : 'Add Product'}</h3>
            
            {activeTab === 'plans' ? (
              <div className="space-y-4">
                <select className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none" onChange={e => setPlanForm({...planForm, network: e.target.value as Network})}>
                  <option>MTN</option><option>AIRTEL</option><option>GLO</option>
                </select>
                <input type="text" placeholder="Size (e.g. 1.5GB)" className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={e => setPlanForm({...planForm, size: e.target.value})} />
                <input type="number" placeholder="Price (Naira)" className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={e => setPlanForm({...planForm, price: Number(e.target.value)})} />
                <input type="number" placeholder="Amigo Plan ID" className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={e => setPlanForm({...planForm, planId: Number(e.target.value)})} />
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" placeholder="Product Name" className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                <input type="number" placeholder="Price" className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} />
                <textarea placeholder="Description" className="w-full p-5 bg-gray-50 rounded-2xl font-bold h-32" onChange={e => setProdForm({...prodForm, description: e.target.value})} />
              </div>
            )}

            <div className="flex space-x-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-5 bg-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest">Cancel</button>
              <button 
                onClick={activeTab === 'plans' ? handleSavePlan : handleSaveProduct} 
                disabled={loading}
                className="flex-1 py-5 bg-[#0071e3] text-white rounded-2xl font-black uppercase text-xs tracking-widest disabled:opacity-50"
              >
                {loading ? 'SAVING...' : 'Save Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
