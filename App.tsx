
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { apiService } from './services/apiService';
import { HomeView } from './views/Home';
import { StoreView } from './views/Store';
import { DataView } from './views/BuyData';
import { TrackView } from './views/TrackTransaction';
import { AgentView } from './views/AgentDashboard';
import { AdminView } from './views/AdminDashboard';
import { AppState } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isUrlAdmin, setIsUrlAdmin] = useState(false);
  const [state, setState] = useState<AppState>({
    products: [],
    dataPlans: [],
    agents: [],
    transactions: [],
    currentAgent: null,
    isAdmin: false
  });

  // URL-based routing for Admin
  useEffect(() => {
    const handlePathChange = () => {
      if (window.location.pathname === '/admin') {
        setIsUrlAdmin(true);
      } else {
        setIsUrlAdmin(false);
      }
    };

    handlePathChange();
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Fetch data from API/Neon
  const refreshData = async () => {
    const [products, plans, transactions, agents] = await Promise.all([
      apiService.getProducts(),
      apiService.getDataPlans(),
      apiService.getTransactions(),
      apiService.getAgents()
    ]);
    setState(prev => ({ ...prev, products, dataPlans: plans, transactions, agents }));
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // Poll every 10s for updates
    return () => clearInterval(interval);
  }, []);

  if (isUrlAdmin) {
    return (
      <div className="bg-white min-h-screen">
        <AdminView 
          state={state} 
          onStateChange={(newState) => {
            setState(newState);
            refreshData(); // Immediate sync on changes
          }} 
          onBack={() => {
            window.history.pushState({}, '', '/');
            setIsUrlAdmin(false);
          }} 
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} />;
      case 'store': return <StoreView />;
      case 'data': return <DataView />;
      case 'track': return <TrackView />;
      case 'agent': return <AgentView state={state} onStateChange={setState} onOpenAdmin={() => {}} />;
      default: return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
