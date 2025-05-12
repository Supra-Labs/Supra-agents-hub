# Trading Assist Agent
This Agent fetches real-time and historical market data via Supra’s REST APIs, computes technical indicators, uses a Prophet-based machine learning model for short-term predictions, and lets you ask follow-up questions via OpenAI’s API—all directly from your terminal.

## What the AI Agent Does?

✅  Prompts you for the crypto pair (e.g., SUPRA_usdt, apt_usdt) to analyze. 

✅  Retrieves the latest price and historical OHLC data from Supra’s endpoints.

✅  Calculates key technical indicators such as SMA, RSI, Bollinger Bands, and MACD.

✅  Uses Facebook Prophet to predict the next price delta for a more informed forecast.

✅  Combines the indicators and AI forecast to generate a simple trade signal (BUY, SELL, or HOLD).

✅  After displaying the market analysis, you can ask follow-up questions (e.g., "Is it a good time to hold?"), and the assistant will provide a detailed recommendation using OpenAI’s GPT API.

## Steps to Run the AI Agent

### Fork & Clone This Repo

```bash
git clone https://github.com/Supra-Labs/Supra-agents-hub.git
```
// Navigate into root dir.

```bash
cd Agents
cd "Trading Assist Agent"
```

### Install Dependencies

```bash
pip install requests numpy pandas prophet openai==0.28
```

### Add Your SUPRA x-API Key
Replace `YOUR_SUPRA_API_KEY` with your actual Supra API key.

### Add Your OpenAI API Key
Replace `YOUR_OPENAI_API_KEY` in agent.py with your actual OpenAI API key.

### Run the AI Agent

```bash
python agent.py
```

## Start Chatting!
- When the agent starts, it will ask you to enter a trading pair (e.g., SUPRA_usdt). If left blank, it defaults to btc_usdt.

- The agent outputs a detailed summary, for example:

```
---------- Market Data & Signals for SUPRA_USDT ----------
Latest Price       : $0.01
SMA (last 20)      : $0.01
RSI (14-period)    : 62.77
Bollinger Bands    : Upper = $0.01, Lower = $0.01
MACD               : 0.0001
MACD Signal        : 0.0001
AI Prediction      : Change of -0.0000
Forecast Price     : $0.01
------------------> Trade Signal: HOLD

Type your question for the trading assistant or press Enter to exit: 
```

- After the analysis, you'll be prompted to enter a follow-up question (for example, "Is it a good time to hold?"). The agent will then send the market data and your query to OpenAI and display the assistant's response.

## How Your AI Agent Interacts With Supra?

**Data Retrieval:** It uses Supra’s REST API endpoints to fetch real-time prices and historical OHLC data.

**Calculation of Indicators:** Functions compute common technical indicators (RSI, SMA, Bollinger Bands, MACD) from the historical data.

**Price Forecasting:** A Prophet-based model forecasts a short-term price delta to help predict near-future price movements.

**Trade Signal Logic:** Decision rules based on indicator thresholds and predicted deltas generate a BUY/SELL/HOLD signal.

**Interactivity with OpenAI:** The assistant integrates with OpenAI’s ChatCompletion to answer contextual follow-up questions based on the current market analysis.
	

🔥 Ready to leverage AI-driven market analysis for crypto trading on Supra? Fork this repository, set up your API keys, and start exploring dynamic trade insights today!