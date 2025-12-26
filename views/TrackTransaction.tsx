
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { Transaction, TransactionStatus } from '../types';
import { Search, Package, Wifi, Clock, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const TrackView: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState<Transaction[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!phone) return;
    const txs = dbService.getUserTransactions(phone);
    setResults(txs);
    setHasSearched(true);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESSFUL: return 'text-green-600 bg-green-50';
      case TransactionStatus.FAILED: return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="px-6 mt-6 space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Track Order</h2>
        <p className="text-gray-500">Enter phone number to see recent orders.</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="e.g. 08012345678"
          className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl p-5 pl-12 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0071e3] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95"
        >
          Track
        </button>
      </div>

      <div className="space-y-4">
        {hasSearched && results.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <Clock className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-gray-500 font-medium">No recent transactions found.</p>
          </div>
        )}

        {results.map((tx) => (
          <div key={tx.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'PRODUCT' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                  {tx.type === 'PRODUCT' ? <Package size={20} /> : <Wifi size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-[#1d1d1f]">{tx.details}</h4>
                  <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(tx.status)}`}>
                {tx.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Amount</p>
                <p className="text-sm font-bold">₦{tx.amount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Reference</p>
                <p className="text-sm font-mono truncate">{tx.reference}</p>
              </div>
            </div>

            {tx.status === TransactionStatus.SUCCESSFUL ? (
              <button className="w-full flex items-center justify-center space-x-2 text-[#0071e3] font-bold text-sm py-2 border-t border-gray-50 mt-2">
                <span>View Receipt</span>
                <ArrowRight size={16} />
              </button>
            ) : tx.status === TransactionStatus.FAILED ? (
              <button className="w-full flex items-center justify-center space-x-2 text-red-600 font-bold text-sm py-2 border-t border-gray-50 mt-2">
                <XCircle size={16} />
                <span>Retry Delivery</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-blue-500 text-xs font-medium py-2 border-t border-gray-50 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Verification in progress...</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
