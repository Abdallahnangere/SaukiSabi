
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Product, TransactionType, TransactionStatus, Transaction } from '../types';
import { AppleSheet } from '../components/AppleSheet';
import { Check, Copy, Package, Truck, ShieldCheck, Download } from 'lucide-react';
import { flutterwaveApi } from '../services/api';
import { Receipt } from '../components/Receipt';

export const StoreView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [step, setStep] = useState<'details' | 'order' | 'pay' | 'success'>('details');
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  
  const [form, setForm] = useState({ name: '', phone: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    apiService.getProducts().then(setProducts);
  }, []);

  const handleBuy = () => setStep('order');

  const handleProceedToPay = async () => {
    if (!form.name || !form.phone || !form.state) return alert('Please fill all fields');
    
    setLoading(true);
    try {
      const txRef = `SM-PROD-${Date.now()}`;
      // Fix: Use initiatePayment instead of generateVirtualAccount as defined in services/api.ts
      const pInfo = await flutterwaveApi.initiatePayment({
        amount: selectedProduct!.price,
        email: `${form.phone}@saukimart.com`,
        name: form.name,
        txRef,
        phone: form.phone,
        details: `${selectedProduct!.name} Order`,
        type: TransactionType.PRODUCT
      });
      
      setPaymentInfo(pInfo);
      
      // Create transaction object for local UI state. 
      // The backend /api/pay already handles the initial database persistence.
      const tx: Transaction = {
        id: `tx_${Date.now()}`,
        reference: txRef,
        type: TransactionType.PRODUCT,
        amount: selectedProduct!.price,
        status: TransactionStatus.PENDING,
        timestamp: Date.now(),
        phone: form.phone,
        details: `${selectedProduct!.name} Order`,
        paymentDetails: {
          accountNumber: pInfo.account_number,
          accountName: pInfo.account_name,
          bank_name: pInfo.bank_name
        }
      } as any; // Cast slightly to match expected structure if needed
      
      // Update local state with the mock transaction
      setLastTransaction({
        ...tx,
        paymentDetails: {
          accountNumber: pInfo.account_number,
          accountName: pInfo.account_name,
          bankName: pInfo.bank_name
        }
      });
      setStep('pay');
    } catch (err: any) {
      alert(err.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDone = () => {
    setLoading(true);
    setTimeout(() => {
      if (lastTransaction) {
        const updated = { ...lastTransaction, status: TransactionStatus.SUCCESSFUL };
        // We save the update here to mark it as successful in the DB
        apiService.saveTransaction(updated);
        setLastTransaction(updated);
      }
      setLoading(false);
      setStep('success');
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="px-6 mt-6 space-y-6 animate-in fade-in duration-700 pb-24 h-full overflow-y-auto">
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tighter text-[#1d1d1f]">Hardware</h2>
        <p className="text-gray-400 font-medium text-xs uppercase tracking-widest">Official MTN Partner</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              setSelectedProduct(product);
              setStep('details');
            }}
            className="flex flex-col text-left group transition-transform active:scale-95"
          >
            <div className="aspect-square rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden mb-2 p-5 flex items-center justify-center">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <h3 className="text-xs font-black text-[#1d1d1f] px-1 line-clamp-1">{product.name}</h3>
            <p className="text-[10px] font-bold text-[#0071e3] px-1">₦{product.price.toLocaleString()}</p>
          </button>
        ))}
        {products.length === 0 && (
          <div className="col-span-2 py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">
            Catalog is empty. Add devices in Admin.
          </div>
        )}
      </div>

      <AppleSheet 
        isOpen={!!selectedProduct} 
        onClose={() => {
          setSelectedProduct(null);
          setStep('details');
        }}
        title={step === 'details' ? 'Device' : step === 'order' ? 'Delivery' : 'Payment'}
      >
        {selectedProduct && (
          <div className="space-y-6">
            {step === 'details' && (
              <div className="space-y-6">
                <div className="aspect-square w-full rounded-[2.5rem] bg-gray-50 flex items-center justify-center p-12">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-contain" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-[#1d1d1f] leading-tight">{selectedProduct.name}</h3>
                  <p className="text-xl font-black text-[#0071e3]">₦{selectedProduct.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{selectedProduct.description}</p>
                </div>
                <button
                  onClick={handleBuy}
                  className="w-full bg-[#0071e3] text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
                >
                  Buy Now
                </button>
              </div>
            )}

            {step === 'order' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Full Name"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-5 text-lg font-bold outline-none" 
                  />
                  <input 
                    type="tel" 
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="Phone Number"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-5 text-lg font-bold outline-none" 
                  />
                  <input 
                    type="text" 
                    value={form.state}
                    onChange={e => setForm({...form, state: e.target.value})}
                    placeholder="State"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-5 text-lg font-bold outline-none" 
                  />
                </div>
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                   <p className="text-[10px] text-blue-600 font-bold leading-relaxed text-center">
                     Hardware delivery is FREE. Expect arrival within 24-48 hours.
                   </p>
                </div>
                <button
                  onClick={handleProceedToPay}
                  disabled={loading}
                  className="w-full bg-[#1d1d1f] text-white py-5 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Generating Account...' : 'Generate Bank Details'}
                </button>
              </div>
            )}

            {step === 'pay' && paymentInfo && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Pay Exactly</p>
                  <h3 className="text-4xl font-black text-[#1d1d1f]">₦{paymentInfo.amount.toLocaleString()}</h3>
                </div>
                
                <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6 border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank</p>
                    <p className="text-lg font-black text-[#1d1d1f]">{paymentInfo.bank_name}</p>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                      <p className="text-2xl font-black text-[#1d1d1f] font-mono">{paymentInfo.account_number}</p>
                    </div>
                    <button onClick={() => copyToClipboard(paymentInfo.account_number)} className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePaymentDone}
                  disabled={loading}
                  className="w-full bg-[#0071e3] text-white py-5 rounded-2xl font-bold text-lg shadow-xl"
                >
                  {loading ? 'Verifying...' : 'I Have Paid'}
                </button>
              </div>
            )}

            {step === 'success' && lastTransaction && (
              <Receipt transaction={lastTransaction} onClose={() => setSelectedProduct(null)} />
            )}
          </div>
        )}
      </AppleSheet>
    </div>
  );
};
