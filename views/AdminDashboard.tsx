
import React, { useState, useEffect } from 'react';
import { AppState, DataPlan, Network, Product, Agent } from '../types';
import { apiService } from '../services/apiService';
import { ChevronLeft, Plus, Trash2, LogOut, Package, Wifi, Users, ListFilter, UserCheck, UserX, Loader2, AlertCircle, Activity, Database, CheckCircle, XCircle } from 'lucide-react';

interface AdminViewProps {
  state: AppState;
  onStateChange: (state: AppState) => void;
  onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ state, onStateChange, onBack }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'agents' | 'health'>('plans');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  
  const [planForm, setPlanForm] = useState<Partial<DataPlan>>({ network: 'MTN', size: '', price: 0, planId: 0 });

  const runHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getHealth();
      setHealthData(data);
    } catch (e: any) {
      setError("Health Probe Failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const runSeed = async () => {
    if (!confirm("Injecting MTN 1001 and Test Catalog. Continue?")) return;
    setLoading(true);
    try {
      await apiService.seedDatabase();
      alert("Authoritative Seed Successful");
      runHealthCheck();
    } catch (e: any) {
      setError("Seed Failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!planForm.size || !planForm.price) return alert("Fill required fields");
    setLoading(true);
    try {
      const plan = { ...planForm, id: `plan_${Date.now()}`, validity: '30 Days' } as DataPlan;
      await apiService.saveDataPlan(plan);
      setIsAdding(false);
      setPlanForm({ network: 'MTN', size: '', price: 0, planId: 0 });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentStatus = async (agent: Agent, status: 'APPROVED' | 'DECLINED') => {
    setLoading(true);
    try {
      const payload = { 
        id: agent.id, 
        status,
        virtualAccount: status === 'APPROVED' ? {
            bankName: 'Sterling Bank',
            accountNumber: '9' + Math.floor(100000000 + Math.random() * 900000000).toString(),
            accountName: `SAUKI / ${agent.fullName}`
        } : null
      };
      await apiService.updateAgent(payload);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col max-w-md mx-auto border-x border-gray-200">
      <header className="bg-white border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 bg-gray-50 rounded-full text-gray-500"><ChevronLeft size={20} /></button>
          <h2 className="text-xl font-black tracking-tighter">Admin Control</h2>
        </div>
        <button onClick={onBack} className="text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center">
          <LogOut size={14} className="mr-1" /> EXIT
        </button>
      </header>

      {error && (
        <div className="m-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-600 animate-in slide-in-from-top">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="text-[10px] font-bold leading-relaxed flex-1">
            <p className="uppercase tracking-widest mb-1 text-red-700">Authoritative Error</p>
            <p>{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-[10px] font-black uppercase">Dismiss</button>
        </div>
      )}

      <nav className="p-4 grid grid-cols-3 gap-2 bg-white border-b border-gray-50">
        {[
          { id: 'health', icon: Activity, label: 'System' },
          { id: 'plans', icon: Wifi, label: 'Plans' },
          { id: 'agents', icon: Users, label: 'Agents' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-[#0071e3] text-white shadow-lg' : 'text-gray-400'}`}
          >
            <tab.icon size={18} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-black tracking-tight">System Diagnostic</h3>
              <button onClick={runHealthCheck} disabled={loading} className="w-full bg-blue-50 text-[#0071e3] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center">
                {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Activity size={16} className="mr-2" />}
                Run Health Probe
              </button>

              {healthData && (
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Database</span>
                    {healthData.database === 'connected' ? <CheckCircle className="text-green-500" size={16} /> : <XCircle className="text-red-500" size={16} />}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Latency</span>
                    <span className="text-xs font-bold text-[#0071e3]">{healthData.latency}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#1d1d1f] rounded-[2rem] p-8 text-white space-y-4">
              <h3 className="text-xl font-black tracking-tight flex items-center"><Database size={20} className="mr-2 text-blue-400" /> Maintenance</h3>
              <p className="text-[10px] text-gray-400 font-medium">Inject authoritative MTN 1001 Plan and Catalog items into empty database.</p>
              <button onClick={runSeed} disabled={loading} className="w-full bg-blue-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                Seed System Core
              </button>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-4">
            <button onClick={() => setIsAdding(true)} className="w-full bg-blue-50 text-[#0071e3] border-2 border-dashed border-blue-100 py-6 rounded-[2rem] font-black flex items-center justify-center group active:bg-blue-100 transition-colors">
              <Plus size={20} className="mr-2" /> CREATE NEW PLAN
            </button>
            {state.dataPlans.map(plan => (
              <div key={plan.id} className="bg-white p-6 rounded-[2rem] flex justify-between items-center shadow-sm border border-gray-50">
                <div>
                  <h4 className="font-black text-sm text-[#1d1d1f]">{plan.network} - {plan.size}</h4>
                  <p className="text-[10px] font-bold text-[#0071e3]">₦{plan.price} (Amigo: {plan.planId})</p>
                </div>
                <button onClick={() => apiService.deleteDataPlan(plan.id)} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-4">
            <p className="label-caps !text-[#0071e3]">Review Required</p>
            {state.agents.filter(a => a.status === 'PENDING').map(agent => (
              <div key={agent.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-[#1d1d1f]">{agent.fullName}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{agent.phone}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-orange-50 text-orange-500 text-[8px] font-black tracking-widest">PENDING</span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleAgentStatus(agent, 'APPROVED')} className="flex-1 bg-green-500 text-white py-3 rounded-xl text-[10px] font-black active:scale-95 transition-all">APPROVE</button>
                  <button onClick={() => handleAgentStatus(agent, 'DECLINED')} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-[10px] font-black active:scale-95 transition-all">DECLINE</button>
                </div>
              </div>
            ))}
            
            <p className="label-caps mt-8">Active Partners</p>
            {state.agents.filter(a => a.status === 'APPROVED').map(agent => (
              <div key={agent.id} className="bg-white p-5 rounded-[1.5rem] flex justify-between items-center border border-gray-50">
                <div>
                  <h4 className="font-black text-xs text-[#1d1d1f]">{agent.fullName}</h4>
                  <p className="text-[9px] font-bold text-gray-400">{agent.phone}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-[8px] font-black bg-green-50 text-green-600 uppercase">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end">
          <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-8 animate-slide-up">
            <h3 className="text-2xl font-black tracking-tighter">New Authoritative Plan</h3>
            <div className="space-y-4">
              <select className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-none text-sm" onChange={e => setPlanForm({...planForm, network: e.target.value as Network})}>
                <option>MTN</option><option>AIRTEL</option><option>GLO</option>
              </select>
              <input type="text" placeholder="Size (e.g. 1GB)" className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none" onChange={e => setPlanForm({...planForm, size: e.target.value})} />
              <input type="number" placeholder="Price (Naira)" className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none" onChange={e => setPlanForm({...planForm, price: Number(e.target.value)})} />
              <input type="number" placeholder="Amigo Plan ID" className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none" onChange={e => setPlanForm({...planForm, planId: Number(e.target.value)})} />
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-5 bg-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
              <button onClick={handleSavePlan} disabled={loading} className="flex-1 py-5 bg-[#0071e3] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-50 flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Save Data Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
