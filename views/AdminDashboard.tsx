
import React, { useState } from 'react';
import { AppState, TransactionStatus, DataPlan, Network } from '../types';
import { dbService } from '../services/db';
import { ChevronLeft, Download, Plus, Trash2, Edit2, ShieldAlert, Check, X, Search } from 'lucide-react';

interface AdminViewProps {
  state: AppState;
  onStateChange: (state: AppState) => void;
  onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ state, onStateChange, onBack }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'transactions' | 'plans' | 'products'>('agents');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  
  // Local state for new plan form
  const [newPlan, setNewPlan] = useState<Partial<DataPlan>>({
    network: 'MTN',
    size: '',
    validity: '30 Days',
    price: 0,
    planId: 0
  });

  const handleAdminLogin = () => {
    if (password === 'SAUKI_ADMIN_2024') {
      setIsAdminLoggedIn(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleApproveAgent = (id: string) => {
    const agent = state.agents.find(a => a.id === id);
    if (agent) {
      const updatedAgent = { ...agent, status: 'APPROVED' as const };
      dbService.saveAgent(updatedAgent);
      onStateChange({ ...state, agents: dbService.getAgents() });
    }
  };

  const handleDeclineAgent = (id: string) => {
    const agent = state.agents.find(a => a.id === id);
    if (agent) {
      const updatedAgent = { ...agent, status: 'DECLINED' as const };
      dbService.saveAgent(updatedAgent);
      onStateChange({ ...state, agents: dbService.getAgents() });
    }
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      dbService.deleteDataPlan(id);
      onStateChange({ ...state, dataPlans: dbService.getDataPlans() });
    }
  };

  const handleSavePlan = () => {
    if (!newPlan.size || !newPlan.price || !newPlan.planId) return alert('Fill all fields');
    const plan: DataPlan = {
      id: `dp_${Date.now()}`,
      network: newPlan.network as Network,
      size: newPlan.size,
      validity: newPlan.validity!,
      price: Number(newPlan.price),
      planId: Number(newPlan.planId)
    };
    dbService.saveDataPlan(plan);
    setIsAddingPlan(false);
    onStateChange({ ...state, dataPlans: dbService.getDataPlans() });
  };

  const exportTransactions = () => {
    const headers = "ID,Reference,Type,Amount,Status,Phone,Details,Date\n";
    const rows = state.transactions.map(tx => 
      `${tx.id},${tx.reference},${tx.type},${tx.amount},${tx.status},${tx.phone},${tx.details},${new Date(tx.timestamp).toISOString()}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saukri_mart_transactions_${Date.now()}.csv`;
    a.click();
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="px-6 py-20 space-y-8 max-w-sm mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold">Admin Restricted</h2>
          <p className="text-gray-500 text-sm">aaunangere@gmail.com</p>
        </div>
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-lg outline-none focus:ring-2 focus:ring-red-500 shadow-sm" 
          />
          <button 
            onClick={handleAdminLogin}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            Access Dashboard
          </button>
          <button onClick={onBack} className="w-full text-gray-500 font-medium">Exit Admin</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 bg-gray-100 rounded-full text-gray-500"><ChevronLeft size={20} /></button>
          <h2 className="text-2xl font-black tracking-tight">Admin</h2>
        </div>
        <div className="flex space-x-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
        {['agents', 'transactions', 'plans', 'products'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 min-w-[80px] py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#0071e3]' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === 'agents' && (
          <div className="space-y-4">
            {state.agents.map(agent => (
              <div key={agent.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#1d1d1f]">{agent.fullName}</h4>
                    <p className="text-xs text-gray-500">{agent.phone}</p>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full mt-2 inline-block ${agent.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : agent.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {agent.status}
                    </span>
                  </div>
                  {agent.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button onClick={() => handleApproveAgent(agent.id)} className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Check size={18} /></button>
                      <button onClick={() => handleDeclineAgent(agent.id)} className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center"><X size={18} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {state.agents.length === 0 && <div className="text-center py-12 text-gray-400 font-medium">No agents yet.</div>}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume: {state.transactions.length}</span>
              <button onClick={exportTransactions} className="text-xs font-bold text-blue-500 flex items-center"><Download size={14} className="mr-1" /> EXPORT CSV</button>
            </div>
            {state.transactions.map(tx => (
              <div key={tx.id} className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{tx.type}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{new Date(tx.timestamp).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-[#1d1d1f] text-sm">{tx.details}</h4>
                <div className="flex justify-between items-end border-t border-gray-50 pt-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                    <p className="text-sm font-bold">{tx.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
                    <p className="text-sm font-bold text-green-600">₦{tx.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            {!isAddingPlan ? (
              <button 
                onClick={() => setIsAddingPlan(true)}
                className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center border-2 border-dashed border-blue-200 active:scale-95 transition-transform"
              >
                <Plus size={20} className="mr-2" /> Add Data Plan
              </button>
            ) : (
              <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 space-y-4">
                <h3 className="font-bold">New Data Plan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="col-span-2 bg-gray-50 rounded-xl p-3 outline-none"
                    value={newPlan.network}
                    onChange={e => setNewPlan({...newPlan, network: e.target.value as Network})}
                  >
                    <option value="MTN">MTN</option>
                    <option value="AIRTEL">AIRTEL</option>
                    <option value="GLO">GLO</option>
                  </select>
                  <input placeholder="Size (e.g. 1GB)" className="bg-gray-50 rounded-xl p-3" value={newPlan.size} onChange={e => setNewPlan({...newPlan, size: e.target.value})} />
                  <input placeholder="Price" className="bg-gray-50 rounded-xl p-3" type="number" value={newPlan.price || ''} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} />
                  <input placeholder="API ID (Amigo)" className="col-span-2 bg-gray-50 rounded-xl p-3" type="number" value={newPlan.planId || ''} onChange={e => setNewPlan({...newPlan, planId: Number(e.target.value)})} />
                </div>
                <div className="flex space-x-2">
                  <button onClick={handleSavePlan} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Save</button>
                  <button onClick={() => setIsAddingPlan(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {state.dataPlans.map(plan => (
                <div key={plan.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex justify-between items-center shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs ${plan.network === 'MTN' ? 'bg-yellow-500' : plan.network === 'AIRTEL' ? 'bg-red-500' : 'bg-green-600'}`}>
                      {plan.network[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{plan.size}</h4>
                      <p className="text-[10px] text-gray-400 font-bold">₦{plan.price} • ID: {plan.planId}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeletePlan(plan.id)} className="text-red-500 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
             <button className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center border-2 border-dashed border-blue-200">
               <Plus size={20} className="mr-2" /> New Device
             </button>
             {state.products.map(product => (
               <div key={product.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center space-x-4 shadow-sm">
                  <img src={product.imageUrl} className="w-16 h-16 rounded-2xl object-contain bg-gray-50 p-2" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{product.name}</h4>
                    <p className="text-xs text-blue-600 font-bold">₦{product.price.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400"><Edit2 size={16} /></button>
                    <button className="p-2 text-red-500"><Trash2 size={16} /></button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
