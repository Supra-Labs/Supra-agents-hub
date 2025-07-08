# Supra OnChain Agent

The **Supra OnChain Agent** interacts directly with the Supra blockchain via the **Supra-L1-SDK**. It allows users to fetch balances, fund accounts via the faucet, check transaction details, retrieve transaction history, and display account resources.

## **What the Agent Does?**

✅ **Fetch Account Balance & Info**  
Retrieve the latest on-chain details of your Supra account.

✅ **Fund Your Account via Faucet**  
Automate the process of funding your Supra testnet account.

✅ **Fetch Transaction Details**  
Input a transaction hash and instantly fetch its on-chain metadata.

✅ **Retrieve Transaction History**  
Check your past transactions recorded on the Supra blockchain.

✅ **Display Account Resource Data**  
View various on-chain resources tied to your account.

## **Run the Agent**

### **1️⃣ Fork & Clone This Repo**
```bash
git clone https://github.com/Supra-Labs/Supra-agents-hub.git
```

``// Navigate into the agent directory``

```bash
cd Agents
cd SurpaOnChainAgent
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

### **3️⃣ Run the AI Agent**
Simply execute:

```bash
npx ts-node agent.ts
```

## **Running the Agent!**
Once running, you can enter conversational commands like:

```bash

$ npx ts-node agent.ts

*** Welcome to SupraOnChainAgent ***

Initializing Supra Client...
Connected to network with chain ID: _ChainId { value: 6 }
Loaded existing account from account.json
Your Supra Account Address: 
0x26b58..........a9548c218d

Available commands:
 - 'what is the balance of my account'  : Fetch account info & balance
 - 'please fund my account'             : Fund account via faucet
 - 'show me transaction details for <TX_HASH>'
 - 'what is my transaction history'     : Retrieve transaction history
 - 'show my account resources'          : Fetch resource data
 - 'help'                               : Show this help message
 - 'exit'                               : Quit the agent

SupraOnChainAgent> 
```

**The agent processes your request and interacts with the Supra blockchain in real time.**


🔥Let's Build Super Agents ON Supra L1.