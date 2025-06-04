/*
 * ----------------------------------------------------------------------------
 *  File:        ConnectionStatus.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Component to display blockchain connection status
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error?: string;
  onReconnect: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  error, 
  onReconnect 
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <Wifi className="w-5 h-5 text-green-400" />
            <span className="status-online">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 text-red-400" />
            <span className="status-offline">Disconnected</span>
          </>
        )}
      </div>
      
      {!isConnected && (
        <button
          onClick={onReconnect}
          className="flex items-center space-x-1 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md text-sm transition-colors duration-200"
          title="Reconnect to blockchain"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus; 