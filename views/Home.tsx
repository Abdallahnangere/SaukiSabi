
import React, { useState } from 'react';
import { ShoppingBag, Zap, ShieldCheck, ChevronRight, Activity, Mail, Phone, MessageSquare, Headphones, MessageCircle, Info } from 'lucide-react';
import { CONTACTS, IMAGES } from '../constants';
import { AppleSheet } from '../components/AppleSheet';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] px-7 pt-12 pb-12 overflow-hidden animate-slide-up">
      {/* Branded Header Section */}
      <section className="flex justify-between items-start mb-10">
        <div className="space-y-3">
          <img src={IMAGES.LOGO} alt="SAUKI MART" className="h-10 object-contain drop-shadow-sm" />
          <div>
            <h2 className="title-lg">Connect.</h2>
            <p className="text-apple-gray text-[13px] font-semibold tracking-tight mt-1">Premium Nigerian Telecom Partner.</p>
          </div>
        </div>
        
        {/* Support Pill */}
        <button 
          onClick={() => setShowContact(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white rounded-full shadow-sm border border-gray-100 active:scale-95 transition-all hover:bg-gray-50 group"
        >
          <div className="w-7 h-7 bg-apple-blue rounded-full flex items-center justify-center text-white shadow-lg shadow-apple-blue/20">
            <Headphones size={14} strokeWidth={3} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-apple-black">Help</span>
        </button>
      </section>

      {/* Help Center Visualization Banner */}
      <section 
        onClick={() => setShowContact(true)}
        className="mb-8 p-1.5 bg-white rounded-full border border-gray-100 shadow-sm flex items-center cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="flex -space-x-2.5 ml-1">
          <div className="w-10 h-10 rounded-full bg-blue-50 border-[3px] border-white flex items-center justify-center text-apple-blue shadow-sm">
            <MessageCircle size={16} strokeWidth={2.5} />
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 border-[3px] border-white flex items-center justify-center text-green-500 shadow-sm">
            <Phone size={16} strokeWidth={2.5} />
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 border-[3px] border-white flex items-center justify-center text-orange-500 shadow-sm">
            <Mail size={16} strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex-1 px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-apple-black">Contact Center</p>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">Live Agent Support</p>
          </div>
        </div>
        <div className="mr-2 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
          <ChevronRight size={18} strokeWidth={2.5} />
        </div>
      </section>

      {/* High-Impact Service Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-5 flex-1 mb-10">
        {/* Hardware Card */}
        <button 
          onClick={() => onNavigate('store')}
          className="row-span-2 relative overflow-hidden bg-apple-black rounded-[2.5rem] p-8 text-left shadow-2xl group active:scale-95 transition-transform"
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-apple-blue/25 rounded-full -mr-28 -mt-28 blur-[80px]" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-16 h-16 bg-apple-blue rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl shadow-apple-blue/50">
              <ShoppingBag size={30} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <p className="label-caps !text-apple-blue">Catalogue</p>
              <h3 className="text-[2rem] font-black text-white leading-none tracking-tighter">Premium<br/>Devices</h3>
              <div className="pt-3 flex items-center text-apple-gray text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                <span>Browse Store</span>
                <ChevronRight size={12} className="ml-1" />
              </div>
            </div>
          </div>
        </button>

        {/* Data Card */}
        <button 
          onClick={() => onNavigate('data')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-7 text-left shadow-sm group active:scale-95 transition-all hover:border-yellow-200"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-mtn-yellow rounded-2xl flex items-center justify-center text-apple-black shadow-lg shadow-mtn-yellow/20">
              <Zap size={24} fill="currentColor" strokeWidth={2.5} />
            </div>
            <div>
              <p className="label-caps !text-yellow-600 mb-1">Instant</p>
              <h3 className="text-xl font-black text-apple-black tracking-tighter">Buy Data</h3>
            </div>
          </div>
        </button>

        {/* History Card */}
        <button 
          onClick={() => onNavigate('track')}
          className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-7 text-left shadow-sm active:scale-95 transition-all hover:border-blue-200"
        >
           <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-apple-blue border border-gray-100">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
               <p className="label-caps mb-1">Status</p>
               <h3 className="text-xl font-black text-apple-black tracking-tighter">Records</h3>
            </div>
          </div>
        </button>
      </div>

      {/* Gov/Partner Glass Footer */}
      <div className="flex items-center justify-between glass-card rounded-[2.5rem] p-6 shadow-xl">
        <div className="flex items-center space-x-5 opacity-40 grayscale hover:grayscale-0 transition-all cursor-help">
          <img src={IMAGES.SMEDAN} alt="SMEDAN" className="h-6 object-contain" />
          <img src={IMAGES.COAT} alt="Coat" className="h-6 object-contain" />
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-1 text-apple-blue">
            <ShieldCheck size={12} strokeWidth={3} />
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Partner</p>
          </div>
          <p className="text-[8px] text-apple-gray font-bold uppercase mt-1 tracking-widest">Secure Network</p>
        </div>
      </div>

      {/* Contact Sheet */}
      <AppleSheet isOpen={showContact} onClose={() => setShowContact(false)} title="Contact Center">
        <div className="space-y-8">
          <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex items-start space-x-4">
             <Info className="text-apple-blue shrink-0 mt-1" size={18} />
             <p className="text-apple-blue text-[13px] font-semibold leading-relaxed">
               For urgent hardware delivery inquiries or bulk data purchases, please use our WhatsApp channels.
             </p>
          </div>
          
          <div className="space-y-5">
            <a href={`mailto:${CONTACTS.EMAIL}`} className="flex items-center p-7 bg-white rounded-[2.5rem] border border-gray-100 group no-underline text-inherit shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-apple-blue rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-apple-blue/20 mr-6 group-active:scale-90 transition-transform">
                <Mail size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="label-caps mb-1">Official Email</p>
                <p className="text-base font-black text-apple-black tracking-tight">{CONTACTS.EMAIL}</p>
              </div>
            </a>

            {[
              { phone: CONTACTS.PHONE1, wa: CONTACTS.WHATSAPP1, label: 'Technical Desk' },
              { phone: CONTACTS.PHONE2, wa: CONTACTS.WHATSAPP2, label: 'Sales Support' }
            ].map((link, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="p-7 flex items-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.2rem] flex items-center justify-center text-apple-black border border-gray-100 mr-6">
                    <Phone size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="label-caps mb-1">{link.label}</p>
                    <p className="text-lg font-black text-apple-black tracking-tighter">{link.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 p-2 gap-2 bg-gray-50/50 border-t border-gray-50">
                  <a href={`tel:${link.phone}`} className="flex items-center justify-center space-x-2 py-4 bg-white rounded-2xl text-apple-black font-black text-[11px] tracking-widest no-underline border border-gray-100 shadow-sm active:scale-95 transition-all">
                    <Phone size={14} /> <span>CALL</span>
                  </a>
                  <a href={link.wa} target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 py-4 bg-[#25D366] text-white rounded-2xl font-black text-[11px] tracking-widest no-underline shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                    <MessageSquare size={14} /> <span>WHATSAPP</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col items-center space-y-2 opacity-30">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={18} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sauki Mart 2025</span>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">Verified Secure End-to-End</p>
          </div>
        </div>
      </AppleSheet>
    </div>
  );
};
