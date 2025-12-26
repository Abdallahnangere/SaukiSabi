
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { dbService } from './services/db';
import { HomeView } from './views/Home';
import { StoreView } from './views/Store';
import { DataView } from './views/BuyData';
import { TrackView } from './views/TrackTransaction';
import { AgentView } from './views/AgentDashboard';
import { AdminView } from './views/AdminDashboard';
import { AppState } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [state, setState] = useState<AppState>({
    products: dbService.getProducts(),
    dataPlans: dbService.getDataPlans(),
    agents: dbService.getAgents(),
    transactions: dbService.getTransactions(),
    currentAgent: null,
    isAdmin: false
  });

  // Sync with local DB on any change
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        products: dbService.getProducts(),
        dataPlans: dbService.getDataPlans(),
        agents: dbService.getAgents(),
        transactions: dbService.getTransactions()
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />;
      case 'store':
        return <StoreView />;
      case 'data':
        return <DataView />;
      case 'track':
        return <TrackView />;
      case 'agent':
        return <AgentView 
          state={state} 
          onStateChange={setState} 
          onOpenAdmin={() => setActiveTab('admin')} 
        />;
      case 'admin':
        return <AdminView 
          state={state} 
          onStateChange={setState} 
          onBack={() => setActiveTab('agent')} 
        />;
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
