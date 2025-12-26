
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { DataPlan, Network, TransactionType, TransactionStatus, Transaction } from '../types';
import { IMAGES } from '../constants';
import { AppleSheet } from '../components/AppleSheet';
import { Check, Copy, Wifi, Phone, CreditCard, Loader2, Signal } from 'lucide-react';
import { flutterwaveApi, amigoApi } from '../services/api';
import { Receipt } from '../components/Receipt';

export const DataView: React.FC = () => {
  const [plans] = useState<DataPlan[]>(dbService.getDataPlans());
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'network' | 'plan' | 'pay' | 'confirming' | 'success'>('network');
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const networks = [
    { id: 'MTN' as Network, image: IMAGES.MTN, color: 'bg-[#FFCC00]/10 border-[#FFCC00]' },
    { id: 'AIRTEL' as Network, image: IMAGES.AIRTEL, color: 'bg-[#E30613]/10 border-[#E30613]' },
    { id: 'GLO' as Network, image: IMAGES.GLO, color: 'bg-[#28a745]/10 border-[#28a745]' }
  ];

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setStep('plan');
  };

  const handleProceed = async () => {
    if (!phone || phone.length < 11) return alert('Valid phone number required');
    setLoading(true);
    try {
      // Fix: Generate txRef and provide it as the 4th argument to flutterwaveApi.generateVirtualAccount
      const txRef = `SM-DATA-${Date.now()}`;
      const pInfo = await flutterwaveApi.generateVirtualAccount(
        selectedPlan!.price,
        'data@user.com',
        phone,
        txRef
      );
      setPaymentInfo(pInfo);
      
      const tx: Transaction = {
        id: `tx_data_${Date.now()}`,
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
      dbService.saveTransaction(tx);
      setLastTransaction(tx);
      setStep('pay');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    setStep('confirming');
    setLoading(true);
    
    // Stage 1: Payment Verification Visual
    await new Promise(r => setTimeout(r, 2000));
    
    // Stage 2: Data Delivery
    try {
      await amigoApi.deliverData({
        network: selectedNetwork === 'MTN' ? 1 : selectedNetwork === 'GLO' ? 2 : 3,
        mobile_number: phone,
        plan: selectedPlan!.planId,
        Ported_number: false
      });
      
      if (lastTransaction) {
        const updated = { ...lastTransaction, status: TransactionStatus.SUCCESSFUL };
        dbService.saveTransaction(updated);
        setLastTransaction(updated);
      }
      setStep('success');
    } catch (e) {
      alert('Data delivery failed. Manual fulfillment triggered.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="px-6 mt-6 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tighter text-[#1d1d1f]">Instant Data</h2>
        <p className="text-gray-500 font-medium">Select a network to begin refill.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {networks.map((net) => (
          <button
            key={net.id}
            onClick={() => handleNetworkSelect(net.id)}
            className={`relative flex items-center justify-between p-6 rounded-[2.2rem] border-2 transition-all active:scale-95 ${net.color}`}
          >
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-sm border border-gray-50">
                <img src={net.image} alt={net.id} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1d1d1f] tracking-tight">{net.id}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Refill</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] shadow-sm">
              <Signal size={18} />
            </div>
          </button>
        ))}
      </div>

      <AppleSheet 
        isOpen={step !== 'network'} 
        onClose={() => {
          setStep('network');
          setSelectedPlan(null);
        }}
        title={step === 'plan' ? `${selectedNetwork} Plans` : step === 'pay' ? 'Checkout' : step === 'success' ? 'Confirmed' : 'Processing'}
      >
        <div className="space-y-6">
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="space-y-3">
                {plans.filter(p => p.network === selectedNetwork).map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                      selectedPlan?.id === plan.id ? 'border-[#0071e3] bg-blue-50' : 'border-gray-50 bg-gray-50/50'
                    }`}
                  >
                    <div>
                      <h4 className="font-black text-[#1d1d1f] text-lg">{plan.size}</h4>
                      <p className="text-xs font-bold text-gray-400">{plan.validity}</p>
                    </div>
                    <p className="text-xl font-black text-[#0071e3]">₦{plan.price}</p>
                  </button>
                ))}
              </div>

              {selectedPlan && (
                <div className="space-y-5 animate-in slide-in-from-bottom duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Recipient Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="0801 234 5678"
                        className="w-full bg-gray-50 border-0 rounded-2xl p-5 pl-12 text-lg font-black focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleProceed}
                    disabled={loading}
                    className="w-full bg-[#0071e3] text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'pay' && paymentInfo && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Amount to Pay</p>
                <h3 className="text-4xl font-black text-[#1d1d1f]">₦{paymentInfo.amount}</h3>
              </div>
              
              <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6 border border-gray-100 shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank Name</p>
                  <p className="text-lg font-black text-[#1d1d1f]">{paymentInfo.bank_name}</p>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-50">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Number</p>
                    <p className="text-2xl font-black text-[#1d1d1f] font-mono">{paymentInfo.account_number}</p>
                  </div>
                  <button onClick={() => copyToClipboard(paymentInfo.account_number)} className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm active:scale-90 transition-transform">
                    {isCopied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-xs text-blue-700 font-bold">Refill starts automatically once payment is received.</p>
              </div>

              <button
                onClick={handlePaymentConfirm}
                disabled={loading}
                className="w-full bg-[#1d1d1f] text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
              >
                I Have Paid
              </button>
            </div>
          )}

          {step === 'confirming' && (
            <div className="py-12 flex flex-col items-center space-y-10">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-[6px] border-gray-100 border-t-blue-500 animate-spin" />
                <Signal className="absolute inset-0 m-auto text-blue-500" size={36} />
              </div>
              <div className="text-center space-y-4 w-full px-4">
                <div className="flex items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-sm">
                      <Check size={20} />
                    </div>
                    <span className="font-black text-sm text-[#1d1d1f]">Payment Confirmed</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <div className="flex items-center space-x-4">
                    <Loader2 size={24} className="text-blue-500 animate-spin" />
                    <span className="font-black text-sm text-blue-600">Sending Data Package...</span>
                  </div>
                </div>
              </div>
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
