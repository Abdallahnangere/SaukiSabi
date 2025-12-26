
import React, { useState } from 'react';
import { AppState, Agent, TransactionType, TransactionStatus } from '../types';
import { AppleSheet } from '../components/AppleSheet';
import { UserPlus, Wallet, RefreshCw, Send, CheckCircle2, ShieldCheck, Settings, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AgentViewProps {
  state: AppState;
  onStateChange: (state: AppState) => void;
  onOpenAdmin: () => void;
}

export const AgentView: React.FC<AgentViewProps> = ({ state, onStateChange, onOpenAdmin }) => {
  const [view, setView] = useState<'landing' | 'onboard' | 'dashboard' | 'pending'>('landing');
  const [form, setForm] = useState({ fullName: '', phone: '', pin: '' });
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOnboard = async () => {
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
    } catch (e) {
      alert("Application failed to send. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const agent = state.agents.find(a => a.phone === loginPhone && a.pin === loginPin);
    if (!agent) return alert('Invalid phone or PIN');
    if (agent.status === 'PENDING') return setView('pending');
    if (agent.status === 'DECLINED') return alert('Your account was declined. Contact support.');
    
    onStateChange({ ...state, currentAgent: agent });
    setView('dashboard');
  };

  const handleCreateVirtualAccount = async () => {
    if (!state.currentAgent) return;
    setLoading(true);
    try {
      const updatedAgent = {
        ...state.currentAgent,
        virtualAccount: {
          bankName: 'Sterling Bank',
          accountNumber: '00' + Math.floor(10000000 + Math.random() * 90000000).toString(),
          accountName: `SAUKI / ${state.currentAgent.fullName}`
        }
      };
      await apiService.saveAgent(updatedAgent);
      onStateChange({ ...state, currentAgent: updatedAgent });
    } catch (e) {
      alert("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (view === 'dashboard' && state.currentAgent) {
    return (
      <div className="px-6 mt-6 space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">Agent Dashboard</h2>
            <p className="text-gray-500">Welcome, {state.currentAgent.fullName}</p>
          </div>
          <button onClick={() => setView('landing')} className="p-2 bg-gray-100 rounded-full text-gray-500">
             <Settings size={20} />
          </button>
        </div>

        {/* Wallet Card */}
        <div className="bg-[#1d1d1f] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                <h3 className="text-4xl font-bold tracking-tight">₦{state.currentAgent.walletBalance.toLocaleString()}</h3>
              </div>
              <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <button className="flex-1 bg-[#0071e3] text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg">
                <Send size={16} /> <span>Sell Data</span>
              </button>
              <button className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-bold text-sm backdrop-blur-md">
                History
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -mr-32 -mt-32 blur-[80px]" />
        </div>

        {/* Static Funding Account */}
        {state.currentAgent.virtualAccount ? (
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold flex items-center text-[#1d1d1f]">
              <Wallet className="mr-2 text-blue-500" size={18} /> Funding Account
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-400 font-bold uppercase">Bank Name</span>
                <span className="text-sm font-bold">{state.currentAgent.virtualAccount.bankName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-400 font-bold uppercase">Account Number</span>
                <span className="text-lg font-bold font-mono tracking-wider">{state.currentAgent.virtualAccount.accountNumber}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-center pt-2">Funds sent to this account reflect in your wallet instantly.</p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleCreateVirtualAccount}
            disabled={loading}
            className="w-full bg-white rounded-[2rem] p-8 border-2 border-dashed border-gray-200 text-gray-400 flex flex-col items-center space-y-3"
          >
            {loading ? <Loader2 className="animate-spin" size={32} /> : <Wallet size={32} />}
            <span className="font-bold">{loading ? 'Creating...' : 'Create Funding Account'}</span>
          </button>
        )}
      </div>
    );
  }

  if (view === 'pending') {
    return (
      <div className="px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500">
          <ShieldCheck size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#1d1d1f]">Approval Pending</h2>
          <p className="text-gray-500">Your application has been received. Our team will review and approve your account within 24 hours.</p>
        </div>
        <button onClick={() => setView('landing')} className="text-blue-500 font-bold">Back to Login</button>
      </div>
    );
  }

  return (
    <div className="px-6 mt-6 space-y-12 pb-24 h-full overflow-y-auto no-scrollbar">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Agents</h2>
        <p className="text-gray-500">Sell data and earn commissions.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#1d1d1f]">Agent Login</h3>
          <div className="space-y-4">
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={loginPhone}
              onChange={e => setLoginPhone(e.target.value)}
              className="w-full bg-gray-50 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
            <input 
              type="password" 
              placeholder="4-digit PIN" 
              value={loginPin}
              onChange={e => setLoginPin(e.target.value)}
              maxLength={4}
              className="w-full bg-gray-50 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-[#0071e3] text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            Login
          </button>
        </div>

        <button 
          onClick={() => setView('onboard')}
          className="w-full flex items-center justify-center space-x-2 text-gray-500 font-bold py-4"
        >
          <UserPlus size={18} />
          <span>Apply to be an Agent</span>
        </button>
      </div>

      <AppleSheet 
        isOpen={view === 'onboard'} 
        onClose={() => setView('landing')} 
        title="Agent Onboarding"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">Start your journey with Sauki Mart today.</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={form.fullName}
              onChange={e => setForm({...form, fullName: e.target.value})}
              className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none" 
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none" 
            />
            <input 
              type="password" 
              placeholder="Create 4-digit PIN" 
              maxLength={4}
              value={form.pin}
              onChange={e => setForm({...form, pin: e.target.value})}
              className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none" 
            />
          </div>
          <button 
            onClick={handleOnboard}
            disabled={loading}
            className="w-full bg-[#1d1d1f] text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </AppleSheet>
    </div>
  );
};
