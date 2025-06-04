/*
 * ----------------------------------------------------------------------------
 *  File:        Dashboard.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Main dashboard component showing blockchain overview
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import { cosmosService, BlockInfo, ValidatorInfo } from '../services/cosmosService';
import { Activity, Database, Users, Coins, TrendingUp, Clock } from 'lucide-react';

interface DashboardStats {
  currentHeight: number;
  totalValidators: number;
  totalSupply: Array<{ denom: string; amount: string }>;
  recentBlocks: BlockInfo[];
  chainId: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    currentHeight: 0,
    totalValidators: 0,
    totalSupply: [],
    recentBlocks: [],
    chainId: ''
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [height, chainId, validators, supply, blocks] = await Promise.all([
        cosmosService.getHeight(),
        cosmosService.getChainId(),
        cosmosService.getValidators(),
        cosmosService.getSupply(),
        cosmosService.getLatestBlocks(5)
      ]);

      setStats({
        currentHeight: height,
        totalValidators: validators.length,
        totalSupply: supply,
        recentBlocks: blocks,
        chainId
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatTokenAmount = (amount: string, denom: string): string => {
    const num = parseInt(amount);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M ${denom.toUpperCase()}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K ${denom.toUpperCase()}`;
    }
    return `${num} ${denom.toUpperCase()}`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const time = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    color?: string;
  }> = ({ title, value, icon, trend, color = "primary" }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${color === 'green' ? 'text-green-600' : 'text-primary-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color === 'green' ? 'bg-green-100' : 'bg-primary-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading && stats.currentHeight === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Blockchain overview and recent activity</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Height"
          value={formatNumber(stats.currentHeight)}
          icon={<Database className="w-6 h-6 text-primary-600" />}
          trend="Latest block"
        />
        
        <StatCard
          title="Active Validators"
          value={stats.totalValidators.toString()}
          icon={<Users className="w-6 h-6 text-primary-600" />}
          trend="Securing network"
        />
        
        <StatCard
          title="Total Supply"
          value={
            stats.totalSupply.length > 0 
              ? formatTokenAmount(stats.totalSupply[0].amount, stats.totalSupply[0].denom)
              : "Loading..."
          }
          icon={<Coins className="w-6 h-6 text-primary-600" />}
          trend="Circulating"
        />
        
        <StatCard
          title="Chain ID"
          value={stats.chainId || "Loading..."}
          icon={<Activity className="w-6 h-6 text-green-600" />}
          trend="Active"
          color="green"
        />
      </div>

      {/* Recent Blocks */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Blocks</h2>
          <button
            onClick={loadDashboardData}
            className="btn-secondary text-sm"
          >
            Refresh
          </button>
        </div>
        
        <div className="space-y-4">
          {stats.recentBlocks.length > 0 ? (
            stats.recentBlocks.map((block) => (
              <div
                key={block.height}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Block #{formatNumber(block.height)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {block.txCount} transaction{block.txCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-900 font-mono">
                    {block.hash.substring(0, 8)}...{block.hash.substring(-8)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgo(block.time)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent blocks available
            </div>
          )}
        </div>
      </div>

      {/* Network Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="status-online">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Block Time</span>
              <span className="text-gray-900">~5 seconds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Network</span>
              <span className="text-gray-900">Mainnet</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-sm">
              Search Transactions
            </button>
            <button className="w-full btn-secondary text-sm">
              View All Validators
            </button>
            <button className="w-full btn-secondary text-sm">
              Explore Blocks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 