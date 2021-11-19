# Course React Dapp

## Overview
 
Free education is desirable but not realistic. We need to find a system that will give quality education to all students equally. Most of the kids dont have access to quality education because of their income level. Educators and creators need to be incentivized for their high-quality content. In order to create accessible education, it must be sustainable. The power of decentralized finance can help us develop strategies to solve this issue.

## Usage

Course is a decentralized app for making high-quality education accessible to everyone.
The educators can create a course by deploying this contract. 
They need to choose stable coin for payment , compound vault for deposits and setting a course fee and duration.
Students can enroll by paying the course fee. These funds will be locked during the course and they will be transfered to Compound vault.The funds will generate yield until the course ends.
Studens can withdraw the course fee at the end of the course. They can fully refund the course fee and the only rewards will be sent to course creator.

## Build and Run locally

0. Install [Node.js](https://nodejs.org/)

1. Clone the repo

```sh
git clone https://github.com/stfibonacci/course-dapp.git
```

2. Install the dependencies

```sh
cd course-dapp
npm install

# or

yarn
```

3. Start the local test node in another tab

```sh
npx hardhat node
```

4. Compile the contract

```sh
npx hardhat compile
```
5. Test the contract

```sh
npx hardhat test
```

6. Deploy the contract

```sh
npx hardhat run scripts/deploy.js --network localhost
```

7. Run the app

```sh
npm start
```

## Run on Kovan

1. Get an [Infura](https://infura.io/) or [Alchemy](https://alchemy.com) account.

2. Get your private key from Metamask

3. Set your environment variables

```sh
PROVIDER_URL=https://eth-kovan.alchemyapi.io/v2/<YOUR INFURA API KEY HERE>;
const privateKey = <YOUR PRIVATE KEY HERE> ;
```
4. Get Kovan Eth for deployment

https://faucet.kovan.network/

https://gitter.im/kovan-testnet/faucet

https://faucets.chain.link


2. Deploy the contract to the Kovan testnet

```sh
npx hardhat run scripts/deploy.js --network Kovan
```

2. Get Kovan Dai to test the app

You can swap some of Kovan Eth for Dai

https://app.uniswap.org/#/swap

You can borrow DAI from OASIS 

https://oasis.app/?network=kovan



