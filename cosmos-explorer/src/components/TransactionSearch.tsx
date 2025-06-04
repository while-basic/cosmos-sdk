/*
 * ----------------------------------------------------------------------------
 *  File:        TransactionSearch.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Transaction search component for finding and viewing transactions
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React from 'react';
import { Activity, FileText, Hash } from 'lucide-react';

const TransactionSearch: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transaction Search</h1>
        <p className="text-gray-600">Search and explore blockchain transactions</p>
      </div>
      
      <div className="card text-center py-12">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Search Coming Soon</h3>
        <p className="text-gray-600">
          This feature will allow you to search transactions by hash, address, or block.
        </p>
      </div>
    </div>
  );
};

export default TransactionSearch; 