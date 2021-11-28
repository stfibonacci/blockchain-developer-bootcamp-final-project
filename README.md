# Course React Dapp

## Overview
 
Free education is desirable but not realistic. We need to find a system that will give quality education to all students equally. Most of the students dont have access to quality education because of their income level. Educators and creators need to be incentivized for their high-quality content. In order to create accessible education, it must be sustainable. The power of decentralized finance can help us develop strategies to solve this issue.

## Usage

Heroku Address : https://course-dapp.herokuapp.com/
Netlify Address : https://course-dapp.netlify.app/

Course is a decentralized app for making high-quality education accessible to everyone.

The educators can create a course by deploying `Course.sol` contract or call `createCourse()` function from the `CourseFactory.sol` contract to deploy cheap Course clone. 
They need to choose stable coin for payment , compound vault for deposits and setting a course fee and duration.

Students can enroll by paying the course fee. These funds will be locked during the course and they will be transfered to Compound vault.The funds will generate yield until the course ends.
Studens can withdraw the course fee at the end of the course. They will get full refund the course fee and the educators will get rewards from Compound vault.

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
npm install -g npx
```

3. Start the local test node in a second command line window or tab. Run the code from the root directory.

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

7. Run the app on `http://localhost:3000`

```sh
npm start
```

## Run on Kovan

1. Get an [Infura](https://infura.io/) or [Alchemy](https://alchemy.com) account to access the blockchain.

2. Get your private key from Metamask [here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)


3. Create `.env` file and set your environment variables.

```sh
PROVIDER_URL=https://kovan.infura.io/v3/<YOUR INFURA API KEY HERE>;
PRIVATE_KEY =  <YOUR PRIVATE KEY HERE> ;
```
4. Get Kovan Eth. You will need it for deploying the contract to Kovan Testnet.

- https://faucet.paradigm.xyz/

- https://faucet.kovan.network/

- https://gitter.im/kovan-testnet/faucet

- https://faucets.chain.link


5. Deploy the contract to the Kovan testnet and save the Course contract address. 

```sh
npx hardhat run scripts/deploy.js --network kovan
```

6. Go to `src/Addresses.js` and change the `courseAddress` with the new deployed address.(Step 5)

7. Run the app on `http://localhost:3000`

```sh
npm start
```

8. Get Kovan Dai to test the app

- https://faucet.paradigm.xyz/

- You can swap some of Kovan Eth for Dai from https://app.uniswap.org/#/swap

- You can borrow DAI from OASIS https://oasis.app/?network=kovan


9. You need the initialize the contract with required parameters as a creator. This will set the course fee , duration and owner.

- course fee (e.g. , 2 )
- course duration (e.g. 4 )
- your address as an owner (e.g. 0x0067... )
- Click `Initialize`
- The other parameters are hard coded to app.js file.(e.g. _underlyingAddress , _cTokenAddress ,  _enrollmentIsOpen)

10. You can switch to another account to test the enrollment as a student.

- Approve the course fee (e.g. , 2 )
- Enroll by paying course fee (e.g. , 2 )

 Contract DAI balance will be updated and funds will be locked until the course ends (e.g. 4 weeks)

11. Switch back to owner account to start the course.Only owner can call this function.

- Click `Start Course`

 Funds will be sent to Compound Vault and stay there until the course ends and earn interest.Contract cDai balance will be updated.

 12. You can end the course now.

 - Click `End Course`

 This will withdraw funds from Compound Vault and send the rewards to the creator.Students can withdraw their course fee now.

 13. Switch back to student account to get refund.

 - Click `Refund`

## TODO

- Update Frontend
- Create Marketplace for deployed courses
- Add more tests
- Add eth vault
- Add Yearn Finance Vaults
- Maybe token 

## Links

1- Screencast

https://www.loom.com/share/887a8d832d4844528d28865f31896d94

2- Address for certification NFT 

0x931d6b98834d195a359A46cBAC0EcA692E7138c3