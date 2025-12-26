
import React, { useState } from 'react';
import { ShoppingBag, Zap, ShieldCheck, Truck, ChevronRight, Activity, Mail, Phone, ExternalLink, MessageSquare } from 'lucide-react';
import { CONTACTS, IMAGES } from '../constants';
import { AppleSheet } from '../components/AppleSheet';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] px-6 pt-8 pb-8 justify-between overflow-hidden">
      <section className="flex justify-between items-start animate-in fade-in slide-in-from-top duration-1000">
        <div className="space-y-1">
          <p className="text-[#0071e3] font-black text-[11px] uppercase tracking-[0.3em] leading-none">Sauki Mart Links</p>
          <h2 className="text-5xl font-black tracking-tighter text-[#1d1d1f] leading-none">Premium.</h2>
          <p className="text-gray-400 text-sm font-medium tracking-tight">Commerce & Connectivity reimagined.</p>
        </div>
        <button 
          onClick={() => setShowContact(true)}
          className="flex flex-col items-center justify-center px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all group"
        >
          <span className="text-[10px] font-black tracking-widest text-[#0071e3]">CONTACT</span>
          <ExternalLink size={14} className="text-gray-300 mt-1" />
        </button>
      </section>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 my-8">
        <button 
          onClick={() => onNavigate('store')}
          className="row-span-2 relative overflow-hidden bg-[#1d1d1f] rounded-[2.5rem] p-7 text-left shadow-2xl transition-transform active:scale-[0.98] group"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Hardware Gallery</p>
              <h3 className="text-3xl font-black text-white leading-tight tracking-tighter">Shop<br/>MTN</h3>
              <div className="pt-2 flex items-center text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                <span>Browse Now</span>
                <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('data')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-7 text-left shadow-sm transition-transform active:scale-[0.98]"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center text-[#1d1d1f] shadow-lg shadow-yellow-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter leading-none">Instant<br/>Data</h3>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('track')}
          className="relative overflow-hidden bg-[#f5f5f7] border border-gray-200/50 rounded-[2.5rem] p-7 text-left transition-transform active:scale-[0.98]"
        >
           <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-800 shadow-sm border border-gray-100">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter">Track</h3>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md rounded-[2rem] p-5 border border-white/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <img src={IMAGES.SMEDAN} alt="SMEDAN" className="h-7 object-contain opacity-50 grayscale" />
          <img src={IMAGES.COAT} alt="Coat" className="h-7 object-contain opacity-40 grayscale" />
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#1d1d1f] font-black uppercase tracking-widest leading-none">Government Partner</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">SAUKI MART LINKS</p>
        </div>
      </div>

      <AppleSheet isOpen={showContact} onClose={() => setShowContact(false)} title="Contact Us">
        <div className="space-y-6">
          <p className="text-gray-500 text-sm font-medium">Get support via our verified channels.</p>
          
          <div className="space-y-4">
            {/* Email */}
            <a href={`mailto:${CONTACTS.EMAIL}`} className="flex items-center p-5 bg-gray-50 rounded-3xl border border-gray-100 active:scale-95 transition-transform">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm mr-4">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Support</p>
                <p className="text-sm font-black text-[#1d1d1f]">{CONTACTS.EMAIL}</p>
              </div>
            </a>

            {/* Phone Line 1 */}
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-5 flex items-center border-b border-gray-50">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mr-4">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Support Line 1</p>
                  <p className="text-sm font-black text-[#1d1d1f]">{CONTACTS.PHONE1}</p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <a href={`tel:${CONTACTS.PHONE1}`} className="flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 text-[#1d1d1f] font-bold text-xs border-r border-gray-100">
                  <Phone size={14} /> <span>Call</span>
                </a>
                <a href={CONTACTS.WHATSAPP1} target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 py-3 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs">
                  <MessageSquare size={14} /> <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Phone Line 2 */}
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-5 flex items-center border-b border-gray-50">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mr-4">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Support Line 2</p>
                  <p className="text-sm font-black text-[#1d1d1f]">{CONTACTS.PHONE2}</p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <a href={`tel:${CONTACTS.PHONE2}`} className="flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 text-[#1d1d1f] font-bold text-xs border-r border-gray-100">
                  <Phone size={14} /> <span>Call</span>
                </a>
                <a href={CONTACTS.WHATSAPP2} target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 py-3 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs">
                  <MessageSquare size={14} /> <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center space-x-2 grayscale opacity-40">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Support</span>
          </div>
        </div>
      </AppleSheet>
    </div>
  );
};
