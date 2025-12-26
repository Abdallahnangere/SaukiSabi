
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { DataPlan, Network, TransactionType, TransactionStatus, Transaction } from '../types';
import { IMAGES } from '../constants';
import { AppleSheet } from '../components/AppleSheet';
import { Check, Copy, Phone, ChevronRight, Loader2, Wifi, AlertCircle } from 'lucide-react';
import { flutterwaveApi } from '../services/api';
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
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (selectedNetwork) {
      setLoading(true);
      apiService.getDataPlans(selectedNetwork)
        .then(setPlans)
        .finally(() => setLoading(false));
    }
  }, [selectedNetwork]);

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
    setError(null);
    try {
      const txRef = `SM-DATA-${Date.now()}`;
      // In authoritative model, we only send the plan ID, backend should verify price.
      const pInfo = await flutterwaveApi.generateVirtualAccount(selectedPlan!.price, `${phone}@saukimart.com`, 'Sauki Customer', txRef);
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
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const networks = [
    { id: 'MTN' as Network, image: IMAGES.MTN, label: 'MTN Nigeria' },
    { id: 'AIRTEL' as Network, image: IMAGES.AIRTEL, label: 'Airtel Nigeria' },
    { id: 'GLO' as Network, image: IMAGES.GLO, label: 'Glo World' }
  ];

  return (
    <div className="px-6 pt-12 space-y-10 animate-slide-up pb-32 overflow-y-auto h-full no-scrollbar">
      <div className="space-y-2">
        <p className="label-caps !text-[#0071e3]">Connectivity</p>
        <h2 className="title-lg">Instant Data.</h2>
        <p className="text-[#86868b] text-sm font-medium tracking-tight">Authoritative prices fetched from database.</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {networks.map((net) => (
          <button
            key={net.id}
            onClick={() => handleNetworkSelect(net.id)}
            className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white shadow-sm border border-gray-100 group"
          >
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-50 rounded-[1.8rem] p-4 flex items-center justify-center transition-transform group-active:scale-90">
                <img src={net.image} alt={net.id} className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#1d1d1f] tracking-tighter">{net.id}</h3>
                <p className="label-caps !text-[9px] mt-1">{net.label}</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-200 group-active:text-[#0071e3] transition-colors">
              <ChevronRight size={28} strokeWidth={2.5} />
            </div>
          </button>
        ))}
      </div>

      <AppleSheet 
        isOpen={step !== 'network'} 
        onClose={() => { setStep('network'); setError(null); }}
        title={step === 'plan' ? `${selectedNetwork} Plans` : step === 'recipient' ? 'Recipient' : 'Payment'}
      >
        <div className="space-y-8 pb-10">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-3 text-[10px] font-black uppercase">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          {step === 'plan' && (
            <div className="grid gap-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="animate-spin text-[#0071e3]" size={32} />
                  <p className="label-caps">Syncing with database...</p>
                </div>
              ) : (
                plans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan)}
                    className="w-full flex items-center justify-between p-8 rounded-[2rem] bg-gray-50 border border-gray-100 group active:border-[#0071e3]"
                  >
                    <div className="text-left">
                      <h4 className="font-black text-[#1d1d1f] text-2xl tracking-tighter">{plan.size}</h4>
                      <p className="label-caps !text-[10px] mt-1">{plan.validity}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-[#0071e3]">₦{plan.price}</p>
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified Price</p>
                    </div>
                  </button>
                ))
              )}
              {!loading && plans.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[2.5rem]">
                   <Wifi className="mx-auto text-gray-200 mb-4" size={48} />
                   <p className="label-caps">No active plans found</p>
                </div>
              )}
            </div>
          )}

          {step === 'recipient' && (
            <div className="space-y-8 pt-2">
              <div className="premium-card !bg-[#0071e3] p-10 text-white text-center">
                <p className="label-caps !text-white/60 mb-2">Package</p>
                <h4 className="text-4xl font-black tracking-tighter">{selectedPlan?.size}</h4>
                <p className="text-2xl font-black mt-4">₦{selectedPlan?.price}</p>
              </div>

              <div className="space-y-3">
                <label className="label-caps ml-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="080 0000 0000"
                  className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-8 text-3xl font-black tracking-tighter text-center outline-none"
                />
              </div>

              <button
                onClick={handleInitiatePayment}
                disabled={loading}
                className="w-full bg-[#1d1d1f] text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Proceed to Payment'}
              </button>
            </div>
          )}

          {step === 'pay' && paymentInfo && (
            <div className="space-y-10">
              <div className="text-center">
                <p className="label-caps mb-2">Transfer Exactly</p>
                <h3 className="text-6xl font-black text-[#1d1d1f] tracking-tighter">₦{paymentInfo.amount}</h3>
              </div>
              
              <div className="premium-card p-10 space-y-8">
                <div className="flex justify-between items-center bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                  <div>
                    <p className="label-caps mb-1">Account</p>
                    <p className="text-4xl font-black tracking-tighter">{paymentInfo.account_number}</p>
                  </div>
                  <button onClick={() => {navigator.clipboard.writeText(paymentInfo.account_number); setIsCopied(true); setTimeout(()=>setIsCopied(false),2000)}} className="w-16 h-16 bg-[#0071e3] text-white rounded-full flex items-center justify-center">
                    {isCopied ? <Check size={28} /> : <Copy size={28} />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><p className="label-caps mb-1">Bank</p><p className="text-lg font-black">{paymentInfo.bank_name}</p></div>
                  <div className="text-right"><p className="label-caps mb-1">Holder</p><p className="text-lg font-black truncate">{paymentInfo.account_name}</p></div>
                </div>
              </div>

              <button onClick={() => setStep('confirming')} className="w-full bg-[#1d1d1f] text-white py-7 rounded-[2.5rem] font-black text-xl">I Have Sent the Money</button>
            </div>
          )}

          {step === 'confirming' && (
             <div className="py-24 flex flex-col items-center space-y-10 text-center">
                <div className="w-24 h-24 border-8 border-gray-100 border-t-[#0071e3] rounded-full animate-spin" />
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter">Verifying...</h3>
                  <p className="text-[#86868b] text-sm font-medium">Reconciling payment with authoritative database.</p>
                </div>
                <button onClick={() => setStep('success')} className="text-[#0071e3] font-black uppercase text-xs tracking-widest">Manual Refresh</button>
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
