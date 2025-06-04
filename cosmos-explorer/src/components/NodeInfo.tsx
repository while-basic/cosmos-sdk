/*
 * ----------------------------------------------------------------------------
 *  File:        NodeInfo.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Node info component for displaying blockchain node information
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React from 'react';
import { Info, Server, Network } from 'lucide-react';

const NodeInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Node Information</h1>
        <p className="text-gray-600">Blockchain node details and network information</p>
      </div>
      
      <div className="card text-center py-12">
        <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Node Info Coming Soon</h3>
        <p className="text-gray-600">
          This feature will display detailed node information including version, uptime, and peers.
        </p>
      </div>
    </div>
  );
};

export default NodeInfo; 