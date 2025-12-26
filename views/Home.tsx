
import React from 'react';
import { ShoppingBag, Zap, ShieldCheck, Truck, MessageCircle, ChevronRight } from 'lucide-react';
import { CONTACTS, IMAGES, COLORS } from '../constants';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] px-6 pt-4 pb-6 justify-between overflow-hidden">
      {/* Premium Header */}
      <section className="flex justify-between items-start animate-in fade-in slide-in-from-top duration-700">
        <div className="space-y-0.5">
          <p className="text-[#0071e3] font-black text-[10px] uppercase tracking-[0.2em] leading-none">Sauki Mart Links</p>
          <h2 className="text-4xl font-black tracking-tighter text-[#1d1d1f] leading-none">Premium.</h2>
          <p className="text-gray-400 text-xs font-medium tracking-tight">E-commerce & Data simplified.</p>
        </div>
        <a 
          href={CONTACTS.WHATSAPP} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-90 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-green-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
          <MessageCircle size={24} className="text-green-500" fill="currentColor" fillOpacity={0.1} />
        </a>
      </section>

      {/* Main Feature Grid (Bento Style) */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 my-6">
        {/* Hardware Store - Large Vertical Card */}
        <button 
          onClick={() => onNavigate('store')}
          className="row-span-2 relative overflow-hidden bg-[#1d1d1f] rounded-[2.5rem] p-6 text-left shadow-2xl transition-transform active:scale-[0.97] group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/30 transition-colors" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">MTN Hardware</p>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tighter">Device<br/>Store</h3>
              <div className="mt-3 flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                <span>Browse</span>
                <ChevronRight size={12} className="ml-1" />
              </div>
            </div>
          </div>
          {/* Subtle Device Silhouette Decoration */}
          <div className="absolute bottom-4 right-4 opacity-10 grayscale invert">
            <img src={IMAGES.ROUTER} alt="" className="w-16 h-16 object-contain" />
          </div>
        </button>

        {/* Data Refill - Square Card */}
        <button 
          onClick={() => onNavigate('data')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-6 text-left shadow-sm transition-transform active:scale-[0.97] group"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center text-[#1d1d1f] shadow-lg shadow-yellow-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Instant</p>
              <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter">Buy Data</h3>
            </div>
          </div>
        </button>

        {/* Agent/Wallet - Square Card */}
        <button 
          onClick={() => onNavigate('agent')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-6 text-left shadow-sm transition-transform active:scale-[0.97] group"
        >
           <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Business</p>
              <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter">Agents</h3>
            </div>
          </div>
        </button>
      </div>

      {/* Trust & Compliance Section - Compact & Integrated */}
      <section className="space-y-5 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex justify-between items-center bg-white/40 backdrop-blur-md rounded-3xl p-4 border border-white/60 shadow-sm">
          <div className="flex flex-col items-center flex-1 space-y-1">
            <Truck size={18} className="text-blue-500" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Free Delivery</span>
          </div>
          <div className="w-[1px] h-6 bg-gray-200" />
          <div className="flex flex-col items-center flex-1 space-y-1">
            <ShieldCheck size={18} className="text-green-500" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified</span>
          </div>
          <div className="w-[1px] h-6 bg-gray-200" />
          <div className="flex flex-col items-center flex-1 space-y-1">
            <Zap size={18} className="text-yellow-500" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Instant API</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center space-x-3">
            <img src={IMAGES.SMEDAN} alt="SMEDAN" className="h-6 object-contain opacity-40 grayscale" />
            <img src={IMAGES.COAT} alt="Coat" className="h-6 object-contain opacity-30 grayscale" />
          </div>
          <div className="text-right">
            <p className="text-[9px] text-[#1d1d1f] font-black uppercase tracking-widest leading-none">Government Registered</p>
            <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">SAUKI MART LINKS • 2024</p>
          </div>
        </div>
      </section>
    </div>
  );
};
