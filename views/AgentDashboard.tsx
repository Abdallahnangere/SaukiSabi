
import React, { useState } from 'react';
import { AppState, Agent } from '../types';
import { AppleSheet } from '../components/AppleSheet';
import { UserPlus, Wallet, RefreshCw, Send, ShieldCheck, Settings, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AgentViewProps {
  state: AppState;
  onStateChange: (state: AppState) => void;
  refresh: () => void;
}

export const AgentView: React.FC<AgentViewProps> = ({ state, onStateChange, refresh }) => {
  const [view, setView] = useState<'landing' | 'onboard' | 'pending' | 'dashboard'>('landing');
  const [form, setForm] = useState({ fullName: '', phone: '', pin: '' });
  const [login, setLogin] = useState({ phone: '', pin: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.fullName || !form.phone || !form.pin) return alert('All fields required');
    setLoading(true);
    try {
      const newAgent: Agent = {
        id: `agent_${Date.now()}`,
        fullName: form.fullName,
        phone: form.phone,
        pin: form.pin,
        status: 'PENDING',
        walletBalance: 0
      };
      await apiService.saveAgent(newAgent);
      setView('pending');
      refresh();
    } catch (e) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const agent = state.agents.find(a => a.phone === login.phone && a.pin === login.pin);
    if (!agent) return alert("Invalid credentials");
    if (agent.status === 'PENDING') return setView('pending');
    if (agent.status === 'DECLINED') return alert("Account declined. Contact support.");
    
    onStateChange({ ...state, currentAgent: agent });
    setView('dashboard');
  };

  if (view === 'dashboard' && state.currentAgent) {
    return (
      <div className="px-6 pt-10 space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter text-[#1d1d1f]">Dashboard</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Agent ID: {state.currentAgent.id.split('_')[1]}</p>
          </div>
          <button onClick={() => setView('landing')} className="p-3 bg-gray-100 rounded-full text-gray-500 active:scale-90"><Settings size={18} /></button>
        </div>

        <div className="bg-[#1d1d1f] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Wallet Balance</p>
                <h3 className="text-5xl font-black tracking-tighter">₦{state.currentAgent.walletBalance.toLocaleString()}</h3>
              </div>
              <button onClick={refresh} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md active:rotate-180 transition-transform"><RefreshCw size={20} /></button>
            </div>
            <button className="w-full bg-[#0071e3] text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl active:scale-95 transition-transform">
              <Send size={18} /> <span>SELL DATA NOW</span>
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        </div>

        {state.currentAgent.virtualAccount ? (
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
            <p className="label-caps !text-[#0071e3]">Wallet Funding</p>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-[10px] text-gray-400 font-black uppercase">Bank</span>
                <span className="text-sm font-black">{state.currentAgent.virtualAccount.bankName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-[10px] text-gray-400 font-black uppercase">Account</span>
                <span className="text-xl font-black font-mono tracking-tighter">{state.currentAgent.virtualAccount.accountNumber}</span>
              </div>
            </div>
            <p className="text-[9px] text-center text-gray-400 font-bold px-4">Instant funding. Your balance updates immediately after transfer.</p>
          </div>
        ) : (
          <div className="p-10 bg-blue-50/30 rounded-[2.5rem] border-2 border-dashed border-blue-100 text-center">
            <p className="text-xs font-black text-[#0071e3] uppercase tracking-widest">Account Under Setup</p>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">Your funding account will appear here shortly after approval.</p>
          </div>
        )}
      </div>
    );
  }

  if (view === 'pending') {
    return (
      <div className="px-10 py-32 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0071e3] shadow-inner"><ShieldCheck size={48} /></div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tighter text-[#1d1d1f]">Reviewing Application</h2>
          <p className="text-[#86868b] text-sm font-medium leading-relaxed">Our admin team is currently verifying your details. This usually takes less than 2 hours.</p>
        </div>
        <button onClick={() => setView('landing')} className="text-[#0071e3] font-black uppercase text-[10px] tracking-widest hover:underline">Return to Login</button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 space-y-12 animate-in slide-up">
      <div className="space-y-2">
        <p className="label-caps !text-[#0071e3]">Partner Program</p>
        <h2 className="title-lg">Agent Hub.</h2>
        <p className="text-[#86868b] text-sm font-medium">Log in or apply to start selling.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 space-y-8">
        <h3 className="text-xl font-black text-[#1d1d1f] tracking-tight">Partner Login</h3>
        <div className="space-y-4">
          <input type="tel" placeholder="Phone Number" value={login.phone} onChange={e => setLogin({...login, phone: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-lg font-black outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all" />
          <input type="password" placeholder="4-digit PIN" maxLength={4} value={login.pin} onChange={e => setLogin({...login, pin: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-lg font-black outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all" />
        </div>
        <button onClick={handleLogin} className="w-full bg-[#0071e3] text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform">Access Dashboard</button>
      </div>

      <button onClick={() => setView('onboard')} className="w-full flex items-center justify-center space-x-2 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] py-4 group hover:text-[#0071e3] transition-colors">
        <UserPlus size={16} /> <span>Apply as New Agent</span>
      </button>

      <AppleSheet isOpen={view === 'onboard'} onClose={() => setView('landing')} title="Application">
        <div className="space-y-8">
          <p className="text-sm text-[#86868b] font-medium">Join the premium data network.</p>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-lg font-black outline-none" />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-lg font-black outline-none" />
            <input type="password" placeholder="Set 4-digit PIN" maxLength={4} value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-lg font-black outline-none" />
          </div>
          <button onClick={handleRegister} disabled={loading} className="w-full bg-[#1d1d1f] text-white py-6 rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-transform flex items-center justify-center">
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Submit Registration'}
          </button>
        </div>
      </AppleSheet>
    </div>
  );
};
