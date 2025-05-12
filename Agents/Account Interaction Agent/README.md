# Account Interaction Agent
An Agent designed to chat with users and perform real-time on-chain tasks like tracking transactions and requesting testnet tokens.

## What the AI Agent Does? 
✅ Chat with AI about Supra & blockchain topics. 

✅ Check wallet balances by providing your Supra address. 

✅ Track transactions using the transaction hash. 

✅ Request testnet tokens using Supra’s faucet API


## Steps to Run the AI Agent

### Fork & Clone This Repo

```bash
git clone https://github.com/Supra-Labs/Supra-agents-hub.git
```
// Navigate into root dir.

```bash
cd Agents
cd "Account Interaction Agent"
```

### Install Dependencies

```bash
pip install openai requests
```

### Add Your OpenAI API Key

Replace `YOUR_OPENAI_API_KEY` in **agent.py** with your actual OpenAI API key.

### Run the AI Agent
```bash
python agent.py
```

## Start Chatting!

***Use the terminal to talk to the AI and execute on-chain actions:***

**"Check my balance"** → Fetches wallet balance

**"Track my transaction"** → Retrieves transaction details

**"Get testnet tokens"** → Calls the Supra faucet API

Type **"exit"** to quit the bot.

## How Your AI Agent Interacts With Supra?
Each command triggers a blockchain call via Supra’s REST APIs, allowing fast, real-time execution:


| **Command**        | **What Happens?**                                               | **API** |
|----------------------|---------------------------------------------------------------|----------|
| **Check balance**         | Fetches transaction history from Supra. | /accounts/{address}/coin_transactions |
| **Track transaction**         | Retrieves details for a given transaction. | /transactions/{hash} |
| **Get faucet tokens**         | Requests testnet tokens for a wallet. | /wallet/faucet/transactions/{address} |
		


🔥 Ready to build AI-driven DeFi on Supra? Fork the repo & deploy your agent today!