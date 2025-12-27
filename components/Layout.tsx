
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
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#f5f5f7] relative overflow-hidden font-sans border-x border-gray-200/50 shadow-[0_0_100px_rgba(0,0,0,0.1)]">
      {/* Content Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar pb-32">
        {children}
      </main>

      {/* Premium Floating Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto apple-blur safe-bottom z-[100] h-20 shadow-[0_-15px_40px_rgba(0,0,0,0.03)] rounded-t-[2.5rem]">
        <div className="flex justify-around items-center h-full px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 w-1/5 relative py-2 group transition-all duration-500 ${
                  isActive ? 'text-apple-blue' : 'text-apple-gray'
                }`}
              >
                <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isActive ? 'bg-apple-blue/10 scale-110' : 'bg-transparent'}`}>
                   <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-all duration-500 ${isActive ? 'scale-105' : 'opacity-60 grayscale'}`}
                  />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
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
