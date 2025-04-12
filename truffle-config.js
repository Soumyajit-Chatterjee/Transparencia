require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: process.env.MNEMONIC,
        providerOrUrl: process.env.REACT_APP_ALCHEMY_API_URL,
        addressIndex: 0 // Use first account
      }),
      network_id: parseInt(process.env.REACT_APP_NETWORK_ID), // Ensure number type
      confirmations: 2,
      timeoutBlocks: 500,
      networkCheckTimeout: 100000, // 100 seconds (critical!)
      skipDryRun: true,
      disableConfirmationListener: true // Helps with some timeout issues
    }
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  mocha: {
    timeout: 100000 // Test timeout
  }
};