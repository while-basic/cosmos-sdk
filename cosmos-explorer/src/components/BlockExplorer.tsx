/*
 * ----------------------------------------------------------------------------
 *  File:        BlockExplorer.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Block explorer component for browsing blockchain blocks
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import { cosmosService, BlockInfo } from '../services/cosmosService';
import { Search, Database, Clock, Hash, User, FileText, Users } from 'lucide-react';

const BlockExplorer: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadBlocks();
    
    const interval = setInterval(() => {
      loadBlocks();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadBlocks = async () => {
    try {
      const latestBlocks = await cosmosService.getLatestBlocks(20);
      setBlocks(latestBlocks);
    } catch (error) {
      console.error('Failed to load blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const height = parseInt(searchQuery);
      if (!isNaN(height)) {
        const block = await cosmosService.getBlock(height);
        setSelectedBlock(block);
      }
    } catch (error) {
      console.error('Block not found:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const formatHash = (hash: string): string => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Block Explorer</h1>
        <p className="text-gray-600">Browse and search blockchain blocks</p>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by block height..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="input-field"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="btn-primary flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{searchLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Block List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Blocks</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {blocks.map((block) => (
              <div
                key={block.height}
                onClick={() => setSelectedBlock(block)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedBlock?.height === block.height
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Database className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Block #{block.height.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {block.txCount} transactions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900 font-mono">
                      {formatHash(block.hash)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(block.time)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Block Details</h2>
          {selectedBlock ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Height</span>
                  </div>
                  <div className="text-lg font-mono text-primary-600">
                    #{selectedBlock.height.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Hash</span>
                  </div>
                  <div className="text-sm font-mono text-gray-700 break-all">
                    {selectedBlock.hash}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Timestamp</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {formatDate(selectedBlock.time)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Proposer</span>
                  </div>
                  <div className="text-sm font-mono text-gray-700">
                    {selectedBlock.proposer}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Transactions</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {selectedBlock.txCount} transaction{selectedBlock.txCount !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Validators</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {selectedBlock.validators} validator{selectedBlock.validators !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <button className="w-full btn-primary text-sm">
                    View Transactions
                  </button>
                  <button className="w-full btn-secondary text-sm">
                    Export Block Data
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a block to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockExplorer; 