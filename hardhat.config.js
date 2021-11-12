require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require('hardhat-gas-reporter');


// const providerUrl = process.env.PROVIDER_URL;
// const developmentMnemonic = process.env.DEV_MNEMONIC;

//for kovan testnet
const privateKey = process.env.PRIVATE_KEY;


module.exports = {
  defaultNetwork: "hardhat",
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
