require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require('hardhat-gas-reporter');


const providerUrl = process.env.MAINNET_PROVIDER_URL;
const developmentMnemonic = process.env.DEV_ETH_MNEMONIC;

//for kovan testnet
const privateKey = process.env.PRIVATE_KEY;

if (!providerUrl) {
  console.error('Missing JSON RPC provider URL as environment variable `MAINNET_PROVIDER_URL`\n');
  process.exit(1);
}

if (!developmentMnemonic) {
  console.error('Missing development Ethereum account mnemonic\n');
  process.exit(1);
}

if (!privateKey) {
  console.error('Missing development Ethereum account private key\n');
  process.exit(1);
}



module.exports = {
  defaultNetwork: "kovan",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // ropsten: {
    //   url: "https://ropsten.infura.io/v3/projectid",
    //   accounts: [process.env.a2key]
    // },
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/projectid",
    //   accounts: [process.env.a2key]
    // },
    kovan: {
          url: providerUrl,
          accounts: [`0x${privateKey}`]
    },
    
  },
  solidity: "0.8.4",
};
