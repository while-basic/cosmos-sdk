/*
 * ----------------------------------------------------------------------------
 *  File:        AccountLookup.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Account lookup component for searching account information
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React from 'react';
import { Search, Wallet, User } from 'lucide-react';

const AccountLookup: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Lookup</h1>
        <p className="text-gray-600">Search for account balances and transaction history</p>
      </div>
      
      <div className="card text-center py-12">
        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Account Search Coming Soon</h3>
        <p className="text-gray-600">
          This feature will allow you to search accounts by address and view balances.
        </p>
      </div>
    </div>
  );
};

export default AccountLookup; 