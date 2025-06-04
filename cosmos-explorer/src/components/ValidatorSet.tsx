/*
 * ----------------------------------------------------------------------------
 *  File:        ValidatorSet.tsx
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Validator set component for viewing network validators
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import React from 'react';
import { Users, Shield, Activity } from 'lucide-react';

const ValidatorSet: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Validator Set</h1>
        <p className="text-gray-600">Network validators and staking information</p>
      </div>
      
      <div className="card text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Validators Coming Soon</h3>
        <p className="text-gray-600">
          This feature will display active validators, their voting power, and commission rates.
        </p>
      </div>
    </div>
  );
};

export default ValidatorSet; 