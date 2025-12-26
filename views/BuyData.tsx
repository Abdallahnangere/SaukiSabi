
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { DataPlan, Network, TransactionType, TransactionStatus, Transaction } from '../types';
import { IMAGES } from '../constants';
import { AppleSheet } from '../components/AppleSheet';
import { Check, Copy, Wifi, Phone, Signal, ChevronRight, Loader2 } from 'lucide-react';
import { flutterwaveApi, amigoApi } from '../services/api';
import { Receipt } from '../components/Receipt';

export const DataView: React.FC = () => {
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'network' | 'plan' | 'recipient' | 'pay' | 'confirming' | 'success'>('network');
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    apiService.getDataPlans().then(setPlans);
  }, []);

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setStep('plan');
  };

  const handlePlanSelect = (plan: DataPlan) => {
    setSelectedPlan(plan);
    setStep('recipient');
  };

  const handleInitiatePayment = async () => {
    if (!phone || phone.length < 11) return alert('Enter a valid 11-digit number');
    setLoading(true);
    try {
      const txRef = `SM-DATA-${Date.now()}`;
      const pInfo = await flutterwaveApi.generateVirtualAccount(selectedPlan!.price, `${phone}@saukimart.com`, 'Customer', txRef);
      setPaymentInfo(pInfo);
      
      const tx: Transaction = {
        id: `tx_${Date.now()}`,
        reference: txRef,
        type: TransactionType.DATA,
        amount: selectedPlan!.price,
        status: TransactionStatus.PENDING,
        timestamp: Date.now(),
        phone: phone,
        details: `${selectedNetwork} ${selectedPlan!.size} Data`,
        paymentDetails: {
          accountNumber: pInfo.account_number,
          accountName: pInfo.account_name,
          bankName: pInfo.bank_name
        }
      };
      await apiService.saveTransaction(tx);
      setLastTransaction(tx);
      setStep('pay');
    } catch (e: any) {
      alert(e.message || 'Payment setup failed');
    } finally {
      setLoading(false);
    }
  };

  const networks = [
    { id: 'MTN' as Network, image: IMAGES.MTN, color: 'bg-yellow-400/10' },
    { id: 'AIRTEL' as Network, image: IMAGES.AIRTEL, color: 'bg-red-400/10' },
    { id: 'GLO' as Network, image: IMAGES.GLO, color: 'bg-green-400/10' }
  ];

  return (
    <div className="px-6 pt-8 space-y-8 animate-in fade-in duration-500 pb-20 overflow-y-auto h-full">
      <div className="space-y-1">
        <h2 className="text-4xl font-black tracking-tighter text-[#1d1d1f]">Instant Data</h2>
        <p className="text-gray-400 font-medium tracking-tight">Select network to see available plans.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {networks.map((net) => (
          <button
            key={net.id}
            onClick={() => handleNetworkSelect(net.id)}
            className={`flex items-center justify-between p-7 rounded-[2.5rem] border-2 border-transparent bg-white shadow-sm active:scale-[0.98] transition-all group`}
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl p-3 flex items-center justify-center">
                <img src={net.image} alt={net.id} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-black text-[#1d1d1f]">{net.id}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-gray-300 group-active:text-[#0071e3]`}>
              <ChevronRight size={24} />
            </div>
          </button>
        ))}
      </div>

      <AppleSheet 
        isOpen={step !== 'network'} 
        onClose={() => setStep('network')}
        title={step === 'plan' ? `${selectedNetwork} Catalog` : step === 'recipient' ? 'Recipient' : 'Payment'}
      >
        <div className="space-y-8">
          {step === 'plan' && (
            <div className="grid gap-3">
              {plans.filter(p => p.network === selectedNetwork).map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan)}
                  className="w-full flex items-center justify-between p-6 rounded-[1.8rem] bg-gray-50/50 border border-gray-100 hover:border-blue-500 active:scale-[0.98] transition-all"
                >
                  <div className="text-left">
                    <h4 className="font-black text-[#1d1d1f] text-xl">{plan.size}</h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{plan.validity}</p>
                  </div>
                  <p className="text-2xl font-black text-[#0071e3]">₦{plan.price}</p>
                </button>
              ))}
              {plans.filter(p => p.network === selectedNetwork).length === 0 && (
                <p className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">No plans available for this network.</p>
              )}
            </div>
          )}

          {step === 'recipient' && (
            <div className="space-y-8 pt-4">
              <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50 text-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Package Selected</p>
                <h4 className="text-2xl font-black text-blue-900">{selectedPlan?.size} @ ₦{selectedPlan?.price}</h4>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Recipient Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={22} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="080 0000 0000"
                    className="w-full bg-gray-50 border-0 rounded-[1.5rem] p-6 pl-14 text-xl font-black focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleInitiatePayment}
                disabled={loading}
                className="w-full bg-[#0071e3] text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-[0.98]"
              >
                {loading ? 'Initializing...' : 'Confirm & Pay'}
              </button>
            </div>
          )}

          {step === 'pay' && paymentInfo && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-black tracking-widest uppercase">Pay Exactly</p>
                <h3 className="text-5xl font-black text-[#1d1d1f]">₦{paymentInfo.amount}</h3>
              </div>
              <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-6 border border-gray-100">
                <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Account Number</p>
                    <p className="text-3xl font-black tracking-tighter">{paymentInfo.account_number}</p>
                  </div>
                  <button onClick={() => {navigator.clipboard.writeText(paymentInfo.account_number); setIsCopied(true); setTimeout(()=>setIsCopied(false),2000)}} className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    {isCopied ? <Check size={24} /> : <Copy size={24} />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <p className="text-[10px] text-gray-400 font-black uppercase">Bank</p>
                    <p className="text-sm font-black">{paymentInfo.bank_name}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <p className="text-[10px] text-gray-400 font-black uppercase">Recipient</p>
                    <p className="text-sm font-black truncate">{paymentInfo.account_name}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setStep('confirming')} className="w-full bg-[#1d1d1f] text-white py-6 rounded-[1.5rem] font-black text-xl active:scale-[0.98]">I Have Paid</button>
            </div>
          )}

          {step === 'confirming' && (
            <div className="py-20 flex flex-col items-center space-y-10">
              <Loader2 size={64} className="text-blue-500 animate-spin" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black">Verifying Payment</h3>
                <p className="text-gray-400 font-medium">Please wait while we confirm your transfer.</p>
              </div>
              <button onClick={() => setStep('success')} className="text-[#0071e3] font-bold">Refresh Status</button>
            </div>
          )}

          {step === 'success' && lastTransaction && (
            <Receipt transaction={lastTransaction} onClose={() => setStep('network')} />
          )}
        </div>
      </AppleSheet>
    </div>
  );
};
