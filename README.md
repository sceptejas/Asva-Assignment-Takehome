# Smart Contract Deployment & Frontend Setup Guide

## Overview
### Note: Remember to replace placeholder addresses with your actual deployed contract addresses in ABI.js file before running the frontend application using vite!

This guide covers deploying two smart contracts (Token and Staking) using Remix IDE and setting up a Vite frontend application to interact with them.

## Smart Contracts Overview

### 1. MyToken Contract (ERC20)
- **Purpose**: Custom ERC20 token with minting and burning capabilities
- **Features**: 
  - Initial supply minting to deployer
  - Owner-only minting function
  - Public burning function
  - Balance checking utility

### 2. StakingContract
- **Purpose**: Allows users to stake the custom token
- **Features**:
  - Stake tokens and earn from a pool
  - Unstake tokens anytime
  - Emergency withdrawal for owner
  - Comprehensive balance tracking

## Deployment Method Comparison

### When to Use Remix:
- **Quick testing**: Fast deployment and testing
- **Testing Smart Contracts without frontend**: Visual interface helps understand concepts
- **No local setup required**: Works entirely in browser

### When to Use Hardhat:
- **Professional development**: Industry standard for production
- **Automated testing**: Comprehensive test suites
- **Advanced features**: Custom tasks, plugins, scripting

### Recommendation:
- **Start with Remix** for initial prototyping
- **Move to Hardhat** for serious development and production deployment

---

## Part 1: Contract Deployment with Remix

### Prerequisites
- Web browser with MetaMask installed
- Test ETH in your wallet (for testnet deployment)
- Access to [Remix IDE](https://remix.ethereum.org)

### Step 1: Set Up Remix Environment

1. **Open Remix IDE**: Navigate to https://remix.ethereum.org
2. **Create New Workspace**: 
   - Click on the workspace dropdown
   - Select "Create New Workspace"
   - Choose "Blank" template
   - Name it "TokenStaking"

### Step 2: Install Dependencies

1. **Open Remix Package Manager**:
   - Go to the "File Explorer" tab
   - Click on the "+" icon to create a new file
   - Create a file named `remixd.json` (optional, for package management)

2. **Install OpenZeppelin**:
   - In the File Explorer, right-click and select "New Folder"
   - Create folders: `contracts/` 
   - OpenZeppelin contracts are automatically available in Remix

### Step 3: Create Contract Files

1. **Create Token Contract**:
   - Right-click on `contracts/` folder
   - Select "New File"
   - Name it `MyToken.sol`
   - Copy and paste the Token contract code

2. **Create Staking Contract**:
   - Create another file: `StakingContract.sol`
   - Copy and paste the Staking contract code

### Step 4: Compile Contracts

1. **Navigate to Solidity Compiler**:
   - Click on the Solidity Compiler tab (second icon in left sidebar)
   - Set compiler version to `0.8.19` or higher
   - Enable "Auto compile" for convenience

2. **Compile Both Contracts**:
   - Select `MyToken.sol` and compile
   - Verify no compilation errors
   - Repeat for `StakingContract.sol`

### Step 5: Deploy Contracts

#### Configure Deployment Environment

1. **Navigate to Deploy Tab**: Click on "Deploy & Run Transactions" (third icon)
2. **Select Environment**: 
   - For testing: Choose "Remix VM (Cancun)" for instant testing
   - For testnet: Choose "Injected Provider - MetaMask"
   - For mainnet: Use "Injected Provider - MetaMask" (ensure you're on mainnet)

#### Deploy Token Contract First

1. **Select Contract**: Choose `MyToken` from the contract dropdown
2. **Set Constructor Parameters**:
   ```
   name: "My Custom Token"
   symbol: "MCT"
   initialSupply: 1000000  // 1 million tokens
   ```
3. **Deploy**: Click "Deploy" button
4. **Confirm Transaction**: If using MetaMask, confirm the transaction
5. **Note Contract Address**: Copy the deployed contract address

#### Deploy Staking Contract

1. **Select Contract**: Choose `StakingContract` from dropdown
2. **Set Constructor Parameter**:
   ```
   _stakingToken: [PASTE_TOKEN_CONTRACT_ADDRESS_HERE]
   ```
3. **Deploy**: Click "Deploy" button
4. **Confirm Transaction**: Confirm in MetaMask if applicable
5. **Note Contract Address**: Copy the staking contract address

### Step 6: Verify Deployment

1. **Check Token Contract**:
   - Expand the deployed MyToken contract
   - Call `name()`, `symbol()`, `totalSupply()` to verify
   - Check your balance with `getBalance(YOUR_ADDRESS)`

2. **Check Staking Contract**:
   - Expand the deployed StakingContract
   - Call `getStakingToken()` to verify it points to your token
   - Call `getTotalStaked()` (should return 0 initially)

### Step 7: Test Token Approval (Very Important!)

Before users can stake, they need to approve the staking contract:

1. **In Token Contract**:
   - Call `approve()` function
   - Parameters: `spender: [STAKING_CONTRACT_ADDRESS]`, `amount: [LARGE_NUMBER]`
   - This allows the staking contract to transfer tokens on behalf of users

---

## Part 2: Contract Deployment with Hardhat

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- MetaMask wallet with test ETH

### Step 1: Initialize Hardhat Project

1. **Create New Directory**:
   ```bash
   mkdir token-staking-hardhat
   cd token-staking-hardhat
   ```

2. **Initialize npm Project**:
   ```bash
   npm init -y
   ```

3. **Install Hardhat and Dependencies**:
   ```bash
   npm install --save-dev hardhat
   npm install --save-dev @nomicfoundation/hardhat-toolbox
   npm install @openzeppelin/contracts
   npm install dotenv
   ```

4. **Initialize Hardhat**:
   ```bash
   npx hardhat init
   ```
   - Select "Create a TypeScript project" or "Create a JavaScript project"
   - Accept default settings

### Step 2: Configure Hardhat

1. **Create Environment File** (`.env`):
   ```env
   PRIVATE_KEY=your_wallet_private_key_here
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

2. **Update hardhat.config.js**:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: {
       version: "0.8.19",
       settings: {
         optimizer: {
           enabled: true,
           runs: 200
         }
       }
     },
     networks: {
       hardhat: {
         chainId: 31337
       },
       sepolia: {
         url: process.env.SEPOLIA_RPC_URL,
         accounts: [process.env.PRIVATE_KEY],
         chainId: 11155111
       },
       goerli: {
         url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
         accounts: [process.env.PRIVATE_KEY],
         chainId: 5
       }
     },
     etherscan: {
       apiKey: process.env.ETHERSCAN_API_KEY
     }
   };
   ```

### Step 3: Create Contract Files

1. **Create contracts directory structure**:
   ```
   contracts/
   ├── MyToken.sol
   └── StakingContract.sol
   ```

2. **Add Token Contract** (`contracts/MyToken.sol`):
   ```solidity
   // Copy the MyToken contract code here
   ```

3. **Add Staking Contract** (`contracts/StakingContract.sol`):
   ```solidity
   // Copy the StakingContract code here
   ```

### Step 4: Create Deployment Scripts

1. **Create deploy script** (`scripts/deploy.js`):
   ```javascript
   const { ethers } = require("hardhat");

   async function main() {
     console.log("Starting deployment...");
     
     // Get the deployer account
     const [deployer] = await ethers.getSigners();
     console.log("Deploying contracts with account:", deployer.address);
     console.log("Account balance:", (await deployer.getBalance()).toString());

     // Deploy Token Contract
     const MyToken = await ethers.getContractFactory("MyToken");
     const tokenName = "My Custom Token";
     const tokenSymbol = "MCT";
     const initialSupply = 1000000; // 1 million tokens
     
     console.log("Deploying MyToken...");
     const myToken = await MyToken.deploy(tokenName, tokenSymbol, initialSupply);
     await myToken.deployed();
     
     console.log("MyToken deployed to:", myToken.address);

     // Deploy Staking Contract
     const StakingContract = await ethers.getContractFactory("StakingContract");
     
     console.log("Deploying StakingContract...");
     const stakingContract = await StakingContract.deploy(myToken.address);
     await stakingContract.deployed();
     
     console.log("StakingContract deployed to:", stakingContract.address);

     // Verify deployment
     console.log("\n=== Deployment Summary ===");
     console.log("MyToken Address:", myToken.address);
     console.log("StakingContract Address:", stakingContract.address);
     console.log("Network:", await ethers.provider.getNetwork());
     
     // Save deployment info
     const deploymentInfo = {
       network: (await ethers.provider.getNetwork()).name,
       chainId: (await ethers.provider.getNetwork()).chainId,
       contracts: {
         MyToken: {
           address: myToken.address,
           constructorArgs: [tokenName, tokenSymbol, initialSupply]
         },
         StakingContract: {
           address: stakingContract.address,
           constructorArgs: [myToken.address]
         }
       },
       deployer: deployer.address,
       timestamp: new Date().toISOString()
     };

     const fs = require('fs');
     fs.writeFileSync(
       'deployment-info.json', 
       JSON.stringify(deploymentInfo, null, 2)
     );
     
     console.log("Deployment info saved to deployment-info.json");
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error(error);
       process.exit(1);
     });
   ```

### Step 5: Create Test Files

1. **Create test file** (`test/TokenStaking.test.js`):
   ```javascript
   const { expect } = require("chai");
   const { ethers } = require("hardhat");

   describe("Token and Staking Contracts", function () {
     let myToken, stakingContract, owner, addr1, addr2;

     beforeEach(async function () {
       [owner, addr1, addr2] = await ethers.getSigners();

       // Deploy MyToken
       const MyToken = await ethers.getContractFactory("MyToken");
       myToken = await MyToken.deploy("Test Token", "TST", 1000000);
       await myToken.deployed();

       // Deploy StakingContract
       const StakingContract = await ethers.getContractFactory("StakingContract");
       stakingContract = await StakingContract.deploy(myToken.address);
       await stakingContract.deployed();
     });

     describe("MyToken", function () {
       it("Should have correct name and symbol", async function () {
         expect(await myToken.name()).to.equal("Test Token");
         expect(await myToken.symbol()).to.equal("TST");
       });

       it("Should mint initial supply to deployer", async function () {
         const decimals = await myToken.decimals();
         const expectedBalance = ethers.utils.parseUnits("1000000", decimals);
         expect(await myToken.balanceOf(owner.address)).to.equal(expectedBalance);
       });
     });

     describe("StakingContract", function () {
       it("Should have correct staking token", async function () {
         expect(await stakingContract.getStakingToken()).to.equal(myToken.address);
       });

       it("Should allow staking after approval", async function () {
         const stakeAmount = ethers.utils.parseEther("100");
         
         // Transfer tokens to addr1
         await myToken.transfer(addr1.address, stakeAmount);
         
         // Approve staking contract
         await myToken.connect(addr1).approve(stakingContract.address, stakeAmount);
         
         // Stake tokens
         await stakingContract.connect(addr1).stake(stakeAmount);
         
         expect(await stakingContract.getStakedBalance(addr1.address)).to.equal(stakeAmount);
       });
     });
   });
   ```

### Step 6: Deploy Contracts

1. **Compile Contracts**:
   ```bash
   npx hardhat compile
   ```

2. **Run Tests**:
   ```bash
   npx hardhat test
   ```

3. **Deploy to Local Network**:
   ```bash
   # Start local Hardhat network (in separate terminal)
   npx hardhat node
   
   # Deploy to local network
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. **Deploy to Testnet** (e.g., Sepolia):
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Step 7: Verify Contracts on Etherscan

1. **Verify Token Contract**:
   ```bash
   npx hardhat verify --network sepolia TOKEN_ADDRESS "My Custom Token" "MCT" 1000000
   ```

2. **Verify Staking Contract**:
   ```bash
   npx hardhat verify --network sepolia STAKING_ADDRESS TOKEN_ADDRESS
   ```

### Step 8: Generate Contract ABIs

1. **Extract ABIs script** (`scripts/extract-abis.js`):
   ```javascript
   const fs = require('fs');
   const path = require('path');

   function extractABI() {
     const contractsDir = path.join(__dirname, '..', 'artifacts', 'contracts');
     
     // MyToken ABI
     const tokenArtifact = require(path.join(contractsDir, 'MyToken.sol', 'MyToken.json'));
     const stakingArtifact = require(path.join(contractsDir, 'StakingContract.sol', 'StakingContract.json'));
     
     const abis = {
       MyToken: tokenArtifact.abi,
       StakingContract: stakingArtifact.abi
     };
     
     fs.writeFileSync('contract-abis.json', JSON.stringify(abis, null, 2));
     console.log('ABIs extracted to contract-abis.json');
   }

   extractABI();
   ```

2. **Run ABI extraction**:
   ```bash
   node scripts/extract-abis.js
   ```

### Hardhat Project Structure
```
token-staking-hardhat/
├── contracts/
│   ├── MyToken.sol
│   └── StakingContract.sol
├── scripts/
│   ├── deploy.js
│   └── extract-abis.js
├── test/
│   └── TokenStaking.test.js
├── hardhat.config.js
├── package.json
├── .env
├── deployment-info.json
└── contract-abis.json
```

### Hardhat vs Remix Comparison

| Feature | Hardhat | Remix |
|---------|---------|--------|
| **Environment** | Local development | Browser-based |
| **Testing** | Comprehensive test suite | Manual testing |
| **Deployment** | Scriptable, repeatable | Manual, GUI-based |
| **Version Control** | Git-friendly | Limited |
| **CI/CD** | Easy integration | Not suitable |
| **Learning Curve** | Steeper | Gentler |
| **Professional Use** | Industry standard | Educational/prototyping |

---

## Part 3: Frontend Setup (Vite App)

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Project Structure
Your Vite app should have this structure:
```
my-staking-app/
├── src/
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
```

### Step 1: Environment Setup

1. **Navigate to Project Directory**:
   ```bash
   cd your-vite-app-directory
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
### Step 3: Get Contract Adress and paste it to ABI.js

#### From Remix:
1. **After compilation**
2. **Copy the Contract adress of Token and Staking Ccontract** from the compiled JSON file
3. **Paste in respective variables in ABI.js**
4. **Replicate the same for hardhat**

### Step 4: Run the Application

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Open Browser**: Navigate to the URL shown in terminal (usually `http://localhost:3000`)

### Step 5: Connect Wallet and Test

1. **Connect MetaMask**: Click connect wallet button in your app
2. **Switch Network**: Ensure you're on the same network where contracts are deployed
3. **Test Functions**:
   - Check token balance
   - Approve staking contract
   - Stake some tokens
   - Check staked balance
   - Unstake tokens

---

## Common Issues and Troubleshooting

### Remix Issues

2. **Deployment Failures**:
   - Check you have enough ETH for gas
   - Verify constructor parameters are correct
   - Ensure MetaMask is connected to correct network

### Frontend Issues

2. **Transaction Failures**:
   - ***Check token approval before staking***
   - If facing issues test it aginst already deployed contracts
   - Ensure sufficient balance for operations
   - Verify gas settings in MetaMask

### Network Configuration

For testnets, add these to MetaMask:
- **Sepolia**: ChainID 11155111
- **Goerli**: ChainID 5

---

## Security Considerations

1. **Testnet First**: Always test on testnets before mainnet
3. **Access Controls**: Verify only owner can call restricted functions
4. **Reentrancy Protection**: Both contracts include appropriate safeguards

---

## Support Resources

- [Remix Documentation](https://remix-ide.readthedocs.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

Remember to replace placeholder addresses with your actual deployed contract addresses before running the frontend application!
