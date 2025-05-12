# Price Feed Agent 

## What is this Agent?  
The **Price Feed AI Agent** is a AI Agent that interacts with **Supra's real-time price feeds and historical OHLC data APIs**.  

Users can simply **ask** for market data (e.g., "give me latest price data"), and the agent will:

✅ Fetch current prices, 24-hour changes, market caps  
✅ Provide coin details & price history  
✅ Retrieve OHLC (Open, High, Low, Close) data for candlestick charting  

This AI agent is perfect for **traders, analysts, and DeFi enthusiasts** who need instant access to reliable market insights directly on the Supra L1.

## Tech Stack & APIs Used  

- **Requests** → Fetching real-time & historical price data via REST API  
- **WebSocket Client** → Streaming live OHLC price feeds  
- **Supra REST APIs** →  
  - `/latest` → Current price, market stats, 24-hour highs/lows  
  - `/history` → OHLC historical price data for candlestick charting  
- **Supra WebSocket API** →  
  - `wss://prod-kline-ws.supra.com` → Real-time streaming of market data  

📖 Supra API Reference → [Supra Price Feeds API Docs](https://prod-kline-rest.supra.com/rpc/docs)  


## How to Run the Agent  

1️⃣ **Clone the Repository**  

```bash
git clone https://github.com/Supra-Labs/Supra-agents-hub.git
```
// Navigate into root dir.

```bash
cd Agents
cd "Price Feed Agent"
```

2️⃣ **Install Dependencies**

```bash
pip install requests websocket-client
```

3️⃣ **Set Your API Key**

Replace "YOUR_API_KEY" in ```oracle_agent.py``` with your actual Supra x-api-key.

4️⃣ **Run the AI Agent**

```bash
python oracle_agent.py
```

## Prompts

```bash

You: give me latest price data
AI: Please enter trading pair (e.g., btc_usdt):
You: btc_usdt
[Latest Price Data]
{
    "currentPrice": "96913.07",
    "24h_high": "97849.9",
    "24h_low": "92720",
    "tradingPair": "btc_usdt"
}

You: I need historical data
AI: Please enter trading pair (e.g., btc_usd):
You: btc_usd
AI: Enter the start date (YYYY-MM-DD HH:MM:SS):
You: 2025-01-01 08:22:20
AI: Enter resolution (minutes):
You: 5
[Historical OHLC Data]
{
    "timestamp": 1732014893723,
    "open": 20000.5,
    "high": 20100.0,
    "low": 19950.0,
    "close": 20050.0
}
```

