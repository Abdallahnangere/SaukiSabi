
import React from 'react';
import { CheckCircle2, Download, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Transaction } from '../types';
import { IMAGES, CONTACTS } from '../constants';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ transaction, onClose }) => {
  const handleDownload = () => {
    // In a real app, this would trigger a PDF/Image generation
    alert("Receipt downloaded to your device.");
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 space-y-8 border border-gray-100 shadow-2xl animate-in zoom-in duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tighter text-[#1d1d1f]">SAUKI MART</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Receipt</p>
        </div>
        <img src={IMAGES.SMEDAN} className="h-6 opacity-50" alt="SMEDAN" />
      </div>

      <div className="flex flex-col items-center py-6 space-y-2 border-y border-gray-50">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2">
          <CheckCircle2 size={32} />
        </div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Payment Confirmed</p>
        <h3 className="text-4xl font-black text-[#1d1d1f]">₦{transaction.amount.toLocaleString()}</h3>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Recipient</span>
          <span className="text-[#1d1d1f] font-bold">{transaction.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Description</span>
          <span className="text-[#1d1d1f] font-bold">{transaction.details}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Reference</span>
          <span className="text-[#1d1d1f] font-mono font-bold text-xs">{transaction.reference}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Date</span>
          <span className="text-[#1d1d1f] font-bold">{new Date(transaction.timestamp).toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 text-gray-500">
          <Mail size={14} className="text-blue-500" />
          <span className="text-xs font-bold">{CONTACTS.EMAIL}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-500">
          <Phone size={14} className="text-blue-500" />
          <span className="text-xs font-bold">{CONTACTS.PHONE1}</span>
        </div>
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <ShieldCheck size={14} className="text-green-500" />
          <span className="text-[10px] font-bold text-gray-400 uppercase">Government Certified Business</span>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleDownload}
          className="w-full bg-[#0071e3] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <Download size={18} />
          <span>Save Receipt</span>
        </button>
        <button
          onClick={onClose}
          className="w-full text-gray-400 font-bold py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};
