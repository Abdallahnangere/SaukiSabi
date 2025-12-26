
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
  const [activeTab, setActiveTab] = useState<'plans' | 'agents' | 'health'>('health');
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
      setError("Health Probe Failed. This usually means your API routes are not reachable or environment variables are missing.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const runSeed = async () => {
    if (!confirm("This will create the necessary tables in your database. Continue?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.seedDatabase();
      alert(res.message || "Database seeded successfully!");
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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col max-w-md mx-auto border-x border-gray-200 shadow-2xl overflow-hidden">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 bg-gray-50 rounded-full text-gray-500 active:scale-90 transition-transform"><ChevronLeft size={20} /></button>
          <h2 className="text-xl font-black tracking-tighter">Admin Control</h2>
        </div>
        <button onClick={onBack} className="text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center bg-red-50 px-3 py-2 rounded-xl">
          <LogOut size={14} className="mr-1" /> EXIT
        </button>
      </header>

      {error && (
        <div className="m-4 p-5 bg-red-50 border border-red-100 rounded-[2rem] flex items-start space-x-3 text-red-600 animate-in slide-in-from-top duration-500">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-red-700">System Alert</p>
            <p className="text-xs font-bold leading-relaxed">{error}</p>
            <button onClick={() => setError(null)} className="mt-3 text-[10px] font-black uppercase underline">Dismiss</button>
          </div>
        </div>
      )}

      <nav className="p-4 grid grid-cols-3 gap-2 bg-white/50 backdrop-blur-md border-b border-gray-100">
        {[
          { id: 'health', icon: Activity, label: 'System' },
          { id: 'plans', icon: Wifi, label: 'Plans' },
          { id: 'agents', icon: Users, label: 'Agents' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-[#0071e3] text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'health' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black tracking-tight">Connectivity</h3>
                <button onClick={runHealthCheck} disabled={loading} className="p-2 bg-gray-50 rounded-full text-[#0071e3] active:rotate-180 transition-transform">
                  <Activity size={18} className={loading ? 'animate-pulse' : ''} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Database (Neon)', value: healthData?.config?.database, status: healthData?.config?.database === 'Connected' },
                  { label: 'Payments (Flutterwave)', value: healthData?.config?.flutterwave, status: healthData?.config?.flutterwave === 'Ready' },
                  { label: 'Delivery (Amigo)', value: healthData?.config?.amigo, status: healthData?.config?.amigo === 'Ready' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <div className="flex items-center space-x-2">
                       <span className={`text-[10px] font-black uppercase ${item.status ? 'text-green-600' : 'text-red-500'}`}>{item.value || 'Checking...'}</span>
                       {item.status ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
              
              {!healthData?.config?.database.includes('Connected') && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-700 leading-relaxed">
                    It looks like your database isn't initialized. Click the "Seed System" button below to create the required tables.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[#1d1d1f] rounded-[2.5rem] p-10 text-white space-y-6 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tighter flex items-center">
                  <Database size={24} className="mr-3 text-blue-400" /> 
                  Infrastructure
                </h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-2">
                  Verify and repair the backend architecture. This safely ensures all tables (Transactions, Agents, Products) are ready for use.
                </p>
                <button 
                  onClick={runSeed} 
                  disabled={loading} 
                  className="w-full bg-[#0071e3] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] mt-6 shadow-xl active:scale-95 transition-transform disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Seed System Core'}
                </button>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <button onClick={() => setIsAdding(true)} className="w-full bg-blue-50 text-[#0071e3] border-2 border-dashed border-blue-100 py-8 rounded-[2.5rem] font-black flex items-center justify-center group active:bg-blue-100 transition-colors">
              <Plus size={24} className="mr-2 group-hover:scale-125 transition-transform" /> 
              CREATE NEW PLAN
            </button>
            {state.dataPlans.map(plan => (
              <div key={plan.id} className="bg-white p-6 rounded-[2rem] flex justify-between items-center shadow-sm border border-gray-50 hover:border-[#0071e3]/20 transition-all">
                <div>
                  <h4 className="font-black text-sm text-[#1d1d1f] tracking-tight">{plan.network} - {plan.size}</h4>
                  <p className="text-[10px] font-black text-[#0071e3] uppercase tracking-widest mt-1">₦{plan.price.toLocaleString()} (ID: {plan.planId})</p>
                </div>
                <button onClick={() => apiService.deleteDataPlan(plan.id)} className="text-red-200 hover:text-red-500 p-3 bg-red-50/0 hover:bg-red-50 rounded-full transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {state.dataPlans.length === 0 && (
              <div className="text-center py-20 text-gray-300 font-black uppercase tracking-widest text-[10px]">No plans found. Add one above.</div>
            )}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-4">
              <p className="label-caps !text-[#0071e3]">Pending Approval</p>
              {state.agents.filter(a => a.status === 'PENDING').map(agent => (
                <div key={agent.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100 space-y-6 animate-slide-up">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black text-[#1d1d1f] tracking-tight">{agent.fullName}</h4>
                      <p className="text-[11px] font-bold text-gray-400 mt-1">{agent.phone}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-500 text-[9px] font-black tracking-widest uppercase">New</span>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => handleAgentStatus(agent, 'APPROVED')} className="flex-1 bg-green-500 text-white py-4 rounded-2xl text-[10px] font-black tracking-widest active:scale-95 transition-all shadow-lg shadow-green-500/20">APPROVE</button>
                    <button onClick={() => handleAgentStatus(agent, 'DECLINED')} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl text-[10px] font-black tracking-widest active:scale-95 transition-all">DECLINE</button>
                  </div>
                </div>
              ))}
              {state.agents.filter(a => a.status === 'PENDING').length === 0 && (
                <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Queue is empty</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <p className="label-caps !text-[#1d1d1f]">Verified Partners</p>
              {state.agents.filter(a => a.status === 'APPROVED').map(agent => (
                <div key={agent.id} className="bg-white p-5 rounded-2xl flex justify-between items-center border border-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 font-black text-xs">{agent.fullName.charAt(0)}</div>
                    <div>
                      <h4 className="font-black text-xs text-[#1d1d1f]">{agent.fullName}</h4>
                      <p className="text-[9px] font-bold text-gray-400">{agent.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#0071e3]">₦{agent.walletBalance.toLocaleString()}</p>
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-[3rem] p-10 space-y-8 animate-slide-up shadow-2xl">
             <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
            <h3 className="text-3xl font-black tracking-tighter text-[#1d1d1f]">Add Data Plan</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {['MTN', 'AIRTEL', 'GLO'].map(net => (
                  <button 
                    key={net}
                    onClick={() => setPlanForm({...planForm, network: net as Network})}
                    className={`py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${planForm.network === net ? 'bg-[#0071e3] text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                  >
                    {net}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Size (e.g. 1GB)" className="w-full p-6 bg-gray-50 rounded-2xl font-black text-lg outline-none border-2 border-transparent focus:border-[#0071e3]/20 transition-all" onChange={e => setPlanForm({...planForm, size: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Price (₦)" className="w-full p-6 bg-gray-50 rounded-2xl font-black text-lg outline-none border-2 border-transparent focus:border-[#0071e3]/20 transition-all" onChange={e => setPlanForm({...planForm, price: Number(e.target.value)})} />
                <input type="number" placeholder="Gateway ID" className="w-full p-6 bg-gray-50 rounded-2xl font-black text-lg outline-none border-2 border-transparent focus:border-[#0071e3]/20 transition-all" onChange={e => setPlanForm({...planForm, planId: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-6 bg-gray-100 rounded-[2rem] font-black uppercase text-[10px] tracking-widest text-gray-500 active:scale-95 transition-transform">Cancel</button>
              <button onClick={handleSavePlan} disabled={loading} className="flex-1 py-6 bg-[#0071e3] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Save Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
