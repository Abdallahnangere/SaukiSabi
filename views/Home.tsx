
import React from 'react';
import { ShoppingBag, Zap, ShieldCheck, Truck, MessageCircle, ChevronRight, Activity } from 'lucide-react';
import { CONTACTS, IMAGES } from '../constants';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] px-6 pt-8 pb-8 justify-between overflow-hidden">
      {/* Immersive Header */}
      <section className="flex justify-between items-start animate-in fade-in slide-in-from-top duration-1000">
        <div className="space-y-1">
          <p className="text-[#0071e3] font-black text-[11px] uppercase tracking-[0.3em] leading-none">Sauki Mart Links</p>
          <h2 className="text-5xl font-black tracking-tighter text-[#1d1d1f] leading-none">Premium.</h2>
          <p className="text-gray-400 text-sm font-medium tracking-tight">E-commerce & Connectivity reimagined.</p>
        </div>
        <a 
          href={CONTACTS.WHATSAPP} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-white rounded-[1.2rem] shadow-sm border border-gray-100 active:scale-90 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-green-500 rounded-[1.2rem] opacity-0 group-hover:opacity-10 transition-opacity" />
          <MessageCircle size={28} className="text-green-500" fill="currentColor" fillOpacity={0.1} />
        </a>
      </section>

      {/* Premium Bento Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 my-8">
        {/* Hardware Hero - Large Vertical Card */}
        <button 
          onClick={() => onNavigate('store')}
          className="row-span-2 relative overflow-hidden bg-[#1d1d1f] rounded-[2.5rem] p-7 text-left shadow-2xl transition-transform active:scale-[0.98] group"
        >
          {/* Animated Background Element */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-blue-500/30 transition-all duration-700" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">MTN Hardware</p>
              </div>
              <h3 className="text-3xl font-black text-white leading-tight tracking-tighter">Device<br/>Gallery</h3>
              <div className="pt-2 flex items-center text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                <span>Shop Collection</span>
                <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          {/* Subtle Device Silhouette */}
          <div className="absolute bottom-6 right-6 opacity-10 grayscale invert pointer-events-none">
            <img src={IMAGES.ROUTER} alt="" className="w-20 h-20 object-contain rotate-12" />
          </div>
        </button>

        {/* Data Refill - High-Gloss Square */}
        <button 
          onClick={() => onNavigate('data')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-7 text-left shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-transform active:scale-[0.98] group"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center text-[#1d1d1f] shadow-lg shadow-yellow-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Automated</p>
              <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter leading-none">Instant<br/>Data</h3>
            </div>
          </div>
        </button>

        {/* Status/Tracking - Minimal Square */}
        <button 
          onClick={() => onNavigate('track')}
          className="relative overflow-hidden bg-[#f5f5f7] border border-gray-200/50 rounded-[2.5rem] p-7 text-left transition-transform active:scale-[0.98] group"
        >
           <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-800 shadow-sm border border-gray-100">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Tracking</p>
              <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter">Orders</h3>
            </div>
          </div>
        </button>
      </div>

      {/* Integrated Trust & Regulatory Strip */}
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex justify-between items-center px-4">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-blue-50 rounded-xl">
               <Truck size={18} className="text-blue-600" />
            </div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Free Ship</span>
          </div>
          <div className="w-[1px] h-8 bg-gray-200" />
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-green-50 rounded-xl">
               <ShieldCheck size={18} className="text-green-600" />
            </div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secure</span>
          </div>
          <div className="w-[1px] h-8 bg-gray-200" />
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-yellow-50 rounded-xl">
               <Zap size={18} className="text-yellow-600" />
            </div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time</span>
          </div>
        </div>

        {/* Regulatory Badges */}
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md rounded-[2rem] p-5 border border-white/80 shadow-sm">
          <div className="flex items-center space-x-4">
            <img src={IMAGES.SMEDAN} alt="SMEDAN" className="h-7 object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src={IMAGES.COAT} alt="Coat" className="h-7 object-contain opacity-40 grayscale" />
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#1d1d1f] font-black uppercase tracking-widest leading-none">Registered Partner</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">SAUKI MART LINKS</p>
          </div>
        </div>
      </section>
    </div>
  );
};
