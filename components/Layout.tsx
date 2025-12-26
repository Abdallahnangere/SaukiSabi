
import React from 'react';
import { Home, ShoppingBag, Wifi, User, History } from 'lucide-react';
import { IMAGES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Explore' },
    { id: 'store', icon: ShoppingBag, label: 'Store' },
    { id: 'data', icon: Wifi, label: 'Data' },
    { id: 'track', icon: History, label: 'Status' },
    { id: 'agent', icon: User, label: 'Account' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#f5f5f7] relative overflow-hidden font-sans">
      {/* Immersive Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* Premium Apple-style Tab Bar */}
      <nav className="flex-shrink-0 apple-blur bg-white/70 border-t border-gray-100 safe-bottom z-[100] h-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-around items-center h-full pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-500 w-1/5 relative ${
                  isActive ? 'text-[#0071e3]' : 'text-[#86868b]'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-3 w-1 h-1 bg-[#0071e3] rounded-full animate-in fade-in zoom-in" />
                )}
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
                />
                <span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
