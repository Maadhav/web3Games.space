const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();
module.exports = {
  networks: {
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mumbai.g.alchemy.com/v2/-UX8uyzpasNB-8i-mmsHRH9lgKYBD2QJ`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
      skipDryRun: true
    },
    loc_development_development: {
      network_id: "*",
      port: 7545,
      host: "127.0.0.1"
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.5.16",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000
        }
      }
    }
  },
  db: {
    enabled: false
  }
};
