require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require('hardhat-gas-reporter');

//for kovan testnet
const providerUrl = process.env.PROVIDER_URL;
const privateKey = process.env.PRIVATE_KEY;

// const developmentMnemonic = process.env.DEV_MNEMONIC;



module.exports = {
 
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // ropsten: {
    //   url: providerUrl,
    //   accounts: [`0x${privateKey}`]
    // },
    // rinkeby: {
    //   url: providerUrl,
    //   accounts: [`0x${privateKey}`]
    // },
    // kovan: {
    //       url: providerUrl,
    //       accounts: [`0x${privateKey}`]
    // },
    
  },
  solidity: "0.8.4",
};
