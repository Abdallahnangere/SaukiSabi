
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

  useEffect(() => {
    const handlePathChange = () => {
      setIsUrlAdmin(window.location.pathname === '/admin');
    };
    handlePathChange();
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  const refreshData = async () => {
    try {
      const [products, plans, transactions, agents] = await Promise.all([
        apiService.getProducts(),
        apiService.getDataPlans(),
        apiService.getTransactions(),
        apiService.getAgents()
      ]);
      setState(prev => ({ 
        ...prev, 
        products, 
        dataPlans: plans, 
        transactions, 
        agents,
        // Sync current agent if logged in
        currentAgent: prev.currentAgent ? agents.find(a => a.id === prev.currentAgent?.id) || null : null
      }));
    } catch (e) {
      console.error("Refresh sync failed", e);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, []);

  if (isUrlAdmin) {
    return (
      <AdminView 
        state={state} 
        onStateChange={(newState) => {
          setState(newState);
          refreshData();
        }} 
        onBack={() => {
          window.history.pushState({}, '', '/');
          setIsUrlAdmin(false);
        }} 
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} />;
      case 'store': return <StoreView />;
      case 'data': return <DataView />;
      case 'track': return <TrackView />;
      case 'agent': return <AgentView state={state} onStateChange={setState} refresh={refreshData} />;
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
