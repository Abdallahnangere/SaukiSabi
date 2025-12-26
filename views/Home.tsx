
import React, { useState } from 'react';
import { ShoppingBag, Zap, ShieldCheck, ChevronRight, ExternalLink, Activity, Mail, Phone, MessageSquare } from 'lucide-react';
import { CONTACTS, IMAGES } from '../constants';
import { AppleSheet } from '../components/AppleSheet';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] px-6 pt-10 pb-12 overflow-hidden animate-slide-up">
      {/* Header Section */}
      <section className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <p className="label-caps !text-[#0071e3]">Sauki Mart Premium</p>
          <h2 className="title-lg">Connectivity.</h2>
          <p className="text-[#86868b] text-sm font-medium tracking-tight">Reimagined for the modern world.</p>
        </div>
        <button 
          onClick={() => setShowContact(true)}
          className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 group active:bg-gray-50 transition-all"
        >
          <ExternalLink size={18} className="text-[#0071e3]" />
        </button>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 mb-8">
        {/* Hardware Card - Spans 2 rows */}
        <button 
          onClick={() => onNavigate('store')}
          className="row-span-2 relative overflow-hidden bg-[#1d1d1f] rounded-[2.5rem] p-8 text-left shadow-2xl group transition-transform active:scale-95"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#0071e3]/20 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-[#0071e3] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-[#0071e3]/40">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <p className="label-caps !text-[#0071e3]">Hardware</p>
              <h3 className="text-3xl font-black text-white leading-tight tracking-tighter">Shop<br/>Devices</h3>
              <div className="pt-2 flex items-center text-[#86868b] text-[10px] font-black uppercase tracking-widest">
                <span>View Store</span>
                <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </div>
        </button>

        {/* Instant Data Card */}
        <button 
          onClick={() => onNavigate('data')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-7 text-left shadow-sm group transition-transform active:scale-95"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center text-[#1d1d1f] shadow-lg shadow-yellow-500/10">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <p className="label-caps !text-yellow-600 mb-1">Instant</p>
              <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter leading-none">Buy Data</h3>
            </div>
          </div>
        </button>

        {/* Track Card */}
        <button 
          onClick={() => onNavigate('track')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-7 text-left shadow-sm group transition-transform active:scale-95"
        >
           <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#86868b] border border-gray-100">
              <Activity size={22} />
            </div>
            <div>
               <p className="label-caps mb-1">Status</p>
               <h3 className="text-xl font-black text-[#1d1d1f] tracking-tighter">History</h3>
            </div>
          </div>
        </button>
      </div>

      {/* Partner Footer */}
      <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/80 shadow-sm">
        <div className="flex items-center space-x-5 opacity-40 grayscale">
          <img src={IMAGES.SMEDAN} alt="SMEDAN" className="h-6 object-contain" />
          <img src={IMAGES.COAT} alt="Coat" className="h-6 object-contain" />
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#1d1d1f] font-black uppercase tracking-widest leading-none">Gov. Partner</p>
          <p className="text-[8px] text-[#86868b] font-bold uppercase mt-1 tracking-widest">Verified Links</p>
        </div>
      </div>

      {/* Contact Sheet */}
      <AppleSheet isOpen={showContact} onClose={() => setShowContact(false)} title="Support">
        <div className="space-y-8">
          <p className="text-[#86868b] text-sm font-medium">Access our official verified support channels.</p>
          
          <div className="space-y-4">
            <a href={`mailto:${CONTACTS.EMAIL}`} className="flex items-center p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group no-underline text-inherit">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0071e3] shadow-sm mr-5 group-active:scale-90 transition-transform">
                <Mail size={22} />
              </div>
              <div className="flex-1">
                <p className="label-caps mb-1">Email</p>
                <p className="text-sm font-black text-[#1d1d1f]">{CONTACTS.EMAIL}</p>
              </div>
            </a>

            {[
              { phone: CONTACTS.PHONE1, wa: CONTACTS.WHATSAPP1, label: 'Main Line' },
              { phone: CONTACTS.PHONE2, wa: CONTACTS.WHATSAPP2, label: 'Alternative' }
            ].map((link, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 flex items-center border-b border-gray-50">
                  <div className="w-12 h-12 bg-blue-50/50 rounded-2xl flex items-center justify-center text-[#0071e3] mr-5">
                    <Phone size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="label-caps mb-1">{link.label}</p>
                    <p className="text-sm font-black text-[#1d1d1f]">{link.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <a href={`tel:${link.phone}`} className="flex items-center justify-center space-x-2 py-4 bg-gray-50 hover:bg-gray-100 text-[#1d1d1f] font-black text-xs border-r border-gray-100 no-underline">
                    <Phone size={14} /> <span>CALL</span>
                  </a>
                  <a href={link.wa} target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 py-4 bg-[#25D366]/10 text-[#25D366] font-black text-xs no-underline">
                    <MessageSquare size={14} /> <span>CHAT</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex items-center justify-center space-x-2 text-[#86868b] opacity-50">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Support</span>
          </div>
        </div>
      </AppleSheet>
    </div>
  );
};
