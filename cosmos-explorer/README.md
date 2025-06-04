# Cosmos Blockchain Explorer

A modern, responsive frontend application for exploring and interacting with Cosmos SDK blockchains.

## Features

🌟 **Dashboard** - Overview of blockchain stats and recent activity  
🔍 **Block Explorer** - Browse and search blockchain blocks  
👥 **Validator Set** - View network validators and staking info  
💰 **Account Lookup** - Search account balances and history  
📊 **Transaction Search** - Find and explore transactions  
🖥️ **Node Info** - Blockchain node details and network status  

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **CosmJS** for blockchain interaction
- **Lucide React** for icons
- **Axios** for HTTP requests

## Quick Start

### Prerequisites

1. Make sure your Cosmos SDK blockchain is running:
   ```bash
   cd /path/to/cosmos-sdk
   ./build/simd start --home ./testnet/node0/simd
   ```

2. Ensure the RPC endpoint is accessible at `http://localhost:26657`

### Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

## Configuration

The application connects to your local Cosmos SDK node by default:

- **RPC Endpoint**: `http://localhost:26657`
- **REST API**: `http://localhost:1317`

To connect to a different node, modify the endpoints in `src/services/cosmosService.ts`:

```typescript
const cosmosService = new CosmosService(
  'http://your-rpc-endpoint:26657',
  'http://your-rest-endpoint:1317'
);
```

## Features Overview

### 🌟 Dashboard
- Real-time blockchain statistics
- Current block height and chain ID
- Validator count and total supply
- Recent blocks with live updates
- Network health indicators

### 🔍 Block Explorer
- Browse latest blocks with auto-refresh
- Search blocks by height
- Detailed block information including:
  - Block hash and timestamp
  - Proposer address
  - Transaction count
  - Validator signatures

### 👥 Validator Set
- Active validator listings
- Voting power and commission rates
- Validator status monitoring
- Staking statistics

### 💰 Account Lookup
- Search accounts by address
- View account balances
- Transaction history
- Account details and metadata

### 📊 Transaction Search
- Search by transaction hash
- Filter by sender/receiver
- Transaction details and status
- Gas usage and fees

### 🖥️ Node Info
- Node version and build info
- Network peers and connectivity
- Uptime and sync status
- Protocol versions

## Architecture

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── BlockExplorer.tsx # Block browsing
│   ├── Navigation.tsx   # Tab navigation
│   └── ...
├── services/           # Blockchain services
│   └── cosmosService.ts # CosmJS integration
├── App.tsx            # Main application
└── index.css          # Tailwind styles
```

## Development

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## License

Business Source License (BSL) - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: chris@celayasolutions.com

---

Built with ❤️ by Celaya Solutions
