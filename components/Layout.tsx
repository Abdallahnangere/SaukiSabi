
import React from 'react';
import { Home, ShoppingBag, Wifi, User, History } from 'lucide-react';

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
    { id: 'track', icon: History, label: 'Track' },
    { id: 'agent', icon: User, label: 'Agent' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#f5f5f7] relative overflow-hidden font-sans border-x border-gray-200 shadow-2xl">
      {/* Content Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar pb-32">
        {children}
      </main>

      {/* Premium Floating Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto apple-blur safe-bottom z-[100] h-24 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-full px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 w-1/5 relative py-3 group transition-all duration-300 ${
                  isActive ? 'text-[#0071e3]' : 'text-[#86868b]'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0071e3] rounded-full shadow-[0_0_10px_rgba(0,113,227,0.5)]" />
                )}
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#0071e3]/5' : 'bg-transparent'}`}>
                   <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}
                  />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
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
