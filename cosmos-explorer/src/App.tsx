/*
 * ----------------------------------------------------------------------------
 *  File:        App.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Main application component for the blockchain explorer
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import { cosmosService } from './services/cosmosService';
import Dashboard from './components/Dashboard';
import BlockExplorer from './components/BlockExplorer';
import ValidatorSet from './components/ValidatorSet';
import AccountLookup from './components/AccountLookup';
import TransactionSearch from './components/TransactionSearch';
import NodeInfo from './components/NodeInfo';
import ConnectionStatus from './components/ConnectionStatus';
import Navigation from './components/Navigation';
import { Activity, Database, Users, Search, Info, Home } from 'lucide-react';

export interface AppState {
  isConnected: boolean;
  chainId: string;
  currentHeight: number;
  connectionError: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [appState, setAppState] = useState<AppState>({
    isConnected: false,
    chainId: '',
    currentHeight: 0,
    connectionError: ''
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'blocks', label: 'Block Explorer', icon: Database }, 
    { id: 'validators', label: 'Validators', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: Search },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'node', label: 'Node Info', icon: Info }
  ];

  useEffect(() => {
    initializeConnection();

    // Set up auto-refresh for connection status
    const interval = setInterval(async () => {
      if (cosmosService.isConnected()) {
        try {
          const height = await cosmosService.getHeight();
          setAppState(prev => ({ ...prev, currentHeight: height }));
        } catch (error) {
          console.error('Failed to update height:', error);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const initializeConnection = async () => {
    try {
      setAppState(prev => ({ ...prev, connectionError: '' }));
      await cosmosService.connect();
      
      const chainId = await cosmosService.getChainId();
      const height = await cosmosService.getHeight();
      
      setAppState({
        isConnected: true,
        chainId,
        currentHeight: height,
        connectionError: ''
      });
    } catch (error) {
      console.error('Connection failed:', error);
      setAppState(prev => ({
        ...prev,
        isConnected: false,
        connectionError: error instanceof Error ? error.message : 'Unknown connection error'
      }));
    }
  };

  const handleReconnect = () => {
    initializeConnection();
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'blocks':
        return <BlockExplorer />;
      case 'validators':
        return <ValidatorSet />;
      case 'accounts':
        return <AccountLookup />;
      case 'transactions':
        return <TransactionSearch />;
      case 'node':
        return <NodeInfo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold">Cosmos Explorer</h1>
              </div>
              <div className="text-sm opacity-90">
                {appState.chainId && (
                  <span>Chain: {appState.chainId} • Height: {appState.currentHeight}</span>
                )}
              </div>
            </div>
            <ConnectionStatus 
              isConnected={appState.isConnected}
              error={appState.connectionError}
              onReconnect={handleReconnect}
            />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {appState.isConnected ? (
            renderActiveTab()
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connection Failed
              </h3>
              <p className="text-gray-600 mb-4">
                {appState.connectionError || 'Unable to connect to the blockchain node'}
              </p>
              <button
                onClick={handleReconnect}
                className="btn-primary"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Cosmos Blockchain Explorer • Built with CosmJS • 
              Powered by Celaya Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
