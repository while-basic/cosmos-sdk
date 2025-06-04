/*
 * ----------------------------------------------------------------------------
 *  File:        cosmosService.ts
 *  Project:     Celaya Solutions (Cosmos Explorer)
 *  Created by:  Celaya Solutions, 2025
 *  Author:      Christopher Celaya <chris@celayasolutions.com>
 *  Description: Service for interacting with Cosmos SDK blockchain
 *  Version:     1.0.0
 *  License:     BSL (SPDX id BUSL)
 *  Last Update: (June 2025)
 * ----------------------------------------------------------------------------
 */

import { StargateClient, QueryClient, setupBankExtension, setupStakingExtension } from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';
import { toHex } from '@cosmjs/encoding';
import axios from 'axios';

export interface BlockInfo {
  height: number;
  hash: string;
  time: string;
  proposer: string;
  txCount: number;
  validators: number;
}

export interface ValidatorInfo {
  address: string;
  moniker: string;
  votingPower: string;
  status: string;
  commission: string;
}

export interface AccountInfo {
  address: string;
  balance: Array<{
    denom: string;
    amount: string;
  }>;
  accountNumber: number;
  sequence: number;
}

export interface TransactionInfo {
  hash: string;
  height: number;
  success: boolean;
  fee: Array<{
    denom: string;
    amount: string;
  }>;
  gasUsed: number;
  gasWanted: number;
  memo: string;
  timestamp: string;
}

export class CosmosService {
  private client: StargateClient | null = null;
  private tmClient: Tendermint34Client | null = null;
  private readonly rpcEndpoint: string;
  private readonly restEndpoint: string;

  constructor(
    rpcEndpoint: string = 'http://localhost:26657',
    restEndpoint: string = 'http://localhost:1317'
  ) {
    this.rpcEndpoint = rpcEndpoint;
    this.restEndpoint = restEndpoint;
  }

  async connect(): Promise<void> {
    try {
      this.tmClient = await Tendermint34Client.connect(this.rpcEndpoint);
      this.client = await StargateClient.create(this.tmClient);
    } catch (error) {
      console.error('Failed to connect to Cosmos node:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.tmClient) {
      this.tmClient.disconnect();
      this.tmClient = null;
    }
    this.client = null;
  }

  async getChainId(): Promise<string> {
    if (!this.client) throw new Error('Client not connected');
    return await this.client.getChainId();
  }

  async getHeight(): Promise<number> {
    if (!this.client) throw new Error('Client not connected');
    return await this.client.getHeight();
  }

  async getBlock(height?: number): Promise<BlockInfo> {
    if (!this.tmClient) throw new Error('Tendermint client not connected');

    const block = height 
      ? await this.tmClient.block(height)
      : await this.tmClient.block();

    return {
      height: block.block.header.height,
      hash: toHex(block.blockId.hash).toUpperCase(),
      time: block.block.header.time.toISOString(),
      proposer: toHex(block.block.header.proposerAddress).toUpperCase(),
      txCount: block.block.txs.length,
      validators: 1 // Will be updated with actual validator count
    };
  }

  async getLatestBlocks(count: number = 10): Promise<BlockInfo[]> {
    if (!this.tmClient) throw new Error('Tendermint client not connected');

    const currentHeight = await this.getHeight();
    const blocks: BlockInfo[] = [];

    for (let i = 0; i < count && currentHeight - i > 0; i++) {
      try {
        const block = await this.getBlock(currentHeight - i);
        blocks.push(block);
      } catch (error) {
        console.error(`Failed to fetch block ${currentHeight - i}:`, error);
      }
    }

    return blocks;
  }

  async getAccount(address: string): Promise<AccountInfo | null> {
    if (!this.client) throw new Error('Client not connected');

    try {
      const account = await this.client.getAccount(address);
      const balances = await this.client.getAllBalances(address);

      if (!account) return null;

      return {
        address: account.address,
        balance: balances.map(coin => ({ denom: coin.denom, amount: coin.amount })),
        accountNumber: account.accountNumber,
        sequence: account.sequence
      };
    } catch (error) {
      console.error('Failed to get account:', error);
      return null;
    }
  }

  async getValidators(): Promise<ValidatorInfo[]> {
    try {
      const response = await axios.get(`${this.restEndpoint}/cosmos/staking/v1beta1/validators`);
      return response.data.validators.map((validator: any) => ({
        address: validator.operator_address,
        moniker: validator.description.moniker,
        votingPower: validator.tokens,
        status: validator.status === 'BOND_STATUS_BONDED' ? 'Active' : 'Inactive',
        commission: validator.commission.commission_rates.rate
      }));
    } catch (error) {
      console.error('Failed to get validators:', error);
      return [];
    }
  }

  async getNodeInfo(): Promise<any> {
    try {
      const response = await axios.get(`${this.restEndpoint}/cosmos/base/tendermint/v1beta1/node_info`);
      return response.data;
    } catch (error) {
      console.error('Failed to get node info:', error);
      return null;
    }
  }

  async getTransaction(hash: string): Promise<TransactionInfo | null> {
    if (!this.client) throw new Error('Client not connected');

    try {
      const tx = await this.client.getTx(hash);
      if (!tx) return null;

      return {
        hash: tx.hash,
        height: tx.height,
        success: tx.code === 0,
        fee: [], // Fee information not available in this interface
        gasUsed: Number(tx.gasUsed),
        gasWanted: Number(tx.gasWanted),
        memo: '', // Memo not available in this interface
        timestamp: new Date().toISOString() // You'd get this from block data
      };
    } catch (error) {
      console.error('Failed to get transaction:', error);
      return null;
    }
  }

  async searchTransactions(query: string): Promise<TransactionInfo[]> {
    if (!this.client) throw new Error('Client not connected');

    try {
      const txs = await this.client.searchTx([
        { key: 'message.sender', value: query }
      ]);

      return txs.map(tx => ({
        hash: tx.hash,
        height: tx.height,
        success: tx.code === 0,
        fee: [], // Fee information not available in this interface
        gasUsed: Number(tx.gasUsed),
        gasWanted: Number(tx.gasWanted),
        memo: '', // Memo not available in this interface
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to search transactions:', error);
      return [];
    }
  }

  async getSupply(): Promise<Array<{ denom: string; amount: string }>> {
    try {
      const response = await axios.get(`${this.restEndpoint}/cosmos/bank/v1beta1/supply`);
      return response.data.supply || [];
    } catch (error) {
      console.error('Failed to get supply:', error);
      return [];
    }
  }

  isConnected(): boolean {
    return this.client !== null && this.tmClient !== null;
  }
}

export const cosmosService = new CosmosService(); 