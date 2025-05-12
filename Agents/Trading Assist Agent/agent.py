import requests
import numpy as np
import pandas as pd
from datetime import datetime, timedelta, timezone
from prophet import Prophet
import openai
REST_BASE = "https://prod-kline-rest.supra.com"  # Update if needed
SUPRA_API_KEY = "YOUR_SUPRA_API_KEY"  # Replace with your Supra API key
openai.api_key = "YOUR_OPENAI_API_KEY"  # Replace with your OpenAI API key

def get_user_trading_pair() -> str:
    """
    Prompt the user to input a trading pair (e.g., SUPRA_usdt).
    If none is entered, defaults to 'btc_usdt'.
    """
    pair = input("Enter the trading pair (e.g., SUPRA_usdt): ").strip()
    if not pair:
        print("No trading pair entered. Defaulting to 'btc_usdt'.")
        return "btc_usdt"
    return pair
def get_latest_price(trading_pair: str) -> dict:
    """
    Fetch the latest market data for the given trading pair.
    """
    url = f"{REST_BASE}/latest?trading_pair={trading_pair}"
    headers = {"x-api-key": SUPRA_API_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching latest data: {response.text}")
        return {}
def get_historical_data(trading_pair: str, start: datetime, end: datetime, interval: int):
    """
    Fetch historical OHLC data for the given trading pair between start and end.
    The interval is specified in minutes.
    """
    url = f"{REST_BASE}/history"
    headers = {"x-api-key": SUPRA_API_KEY}
    params = {
        "trading_pair": trading_pair,
        "startDate": int(start.timestamp() * 1000),  # milliseconds
        "endDate": int(end.timestamp() * 1000),
        "interval": interval,
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()  # Expected either a list or a dict with a "data" key.
    else:
        print(f"Error fetching historical data: {response.text}")
        return []
def compute_rsi(prices, period=14):
    """
    Compute the Relative Strength Index (RSI) of a list of prices.
    """
    prices = np.array(prices, dtype=float)
    deltas = np.diff(prices)
    seed = deltas[:period]
    up = seed[seed >= 0].sum() / period
    down = -seed[seed < 0].sum() / period
    rs = up / down if down != 0 else 100
    rsi = np.zeros_like(prices)
    rsi[:period] = 50  # initial approximation
    for i in range(period, len(prices)):
        delta = deltas[i - 1]
        upval = delta if delta > 0 else 0
        downval = -delta if delta < 0 else 0
        up = (up * (period - 1) + upval) / period
        down = (down * (period - 1) + downval) / period
        rsi[i] = 100 if down == 0 else 100 - 100 / (1 + up / down)
    return rsi
def compute_bollinger_bands(prices, period=20, num_std=2):
    """
    Calculate Bollinger Bands: returns SMA, Upper Band, and Lower Band.
    """
    prices = np.array(prices, dtype=float)
    series = pd.Series(prices)
    sma = series.rolling(window=period).mean().to_numpy()
    std = series.rolling(window=period).std().to_numpy()
    upper_band = sma + num_std * std
    lower_band = sma - num_std * std
    return sma, upper_band, lower_band
def compute_macd(prices, short_period=12, long_period=26, signal_period=9):
    """
    Compute the MACD (Moving Average Convergence Divergence) indicator.
    Returns MACD line, Signal line, and Histogram.
    """
    prices_series = pd.Series(prices)
    ema_short = prices_series.ewm(span=short_period, adjust=False).mean()
    ema_long = prices_series.ewm(span=long_period, adjust=False).mean()
    macd_line = ema_short - ema_long
    signal_line = macd_line.ewm(span=signal_period, adjust=False).mean()
    histogram = macd_line - signal_line
    return macd_line.to_numpy(), signal_line.to_numpy(), histogram.to_numpy()

def ai_predictive_model_prophet(historical_data: list) -> float:
    """
    Uses Prophet to forecast the next price delta.
    Expects historical_data as a list of dicts with fields:
      - "timestamp": Unix timestamp in ms (or convertible)
      - "close": closing price (string or number)
    Returns: (forecasted_price - latest_price)
    """
    df = pd.DataFrame(historical_data)
    if 'timestamp' not in df.columns or 'close' not in df.columns:
        raise ValueError("Historical data must contain 'timestamp' and 'close' fields.")
    
    # Ensure timestamp is numeric; if not, convert it.
    if not pd.api.types.is_numeric_dtype(df['timestamp']):
        try:
            df['timestamp'] = pd.to_datetime(df['timestamp']).astype('int64') // 10**6
        except Exception as e:
            raise ValueError(f"Error converting timestamp: {e}")
    
    df['ds'] = pd.to_datetime(df['timestamp'], unit='ms', utc=True)
    df['ds'] = df['ds'].dt.tz_localize(None)  # Remove timezone info
    df['y'] = pd.to_numeric(df['close'], errors='coerce')
    df = df.dropna(subset=['y'])
    df = df.sort_values(by='ds')
    df_model = df.tail(100).copy()   
    model = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=False)
    model.fit(df_model)

        # Forecast one period ahead (5min interval in our case)
    future = model.make_future_dataframe(periods=1, freq='5min', include_history=False)
    forecast = model.predict(future)
    forecasted_price = forecast['yhat'].iloc[-1]
    latest_price = df_model['y'].iloc[-1]
    return forecasted_price - latest_price
def visualize_output(latest_price: float, sma_val: float, rsi_val: float, upper_band: float, 
                       lower_band: float, macd_val: float, signal_val: float, prediction_delta: float, 
                       trade_signal: str, trading_pair: str):
    """
    Nicely formats and prints market data and trade signals.
    """
    output = (
        f"\n---------- Market Data & Signals for {trading_pair.upper()} ----------\n"
        f"Latest Price       : ${latest_price:.2f}\n"
        f"SMA (last 20)      : ${sma_val:.2f}\n"
        f"RSI (14-period)    : {rsi_val:.2f}\n"
        f"Bollinger Bands    : Upper = ${upper_band:.2f}, Lower = ${lower_band:.2f}\n"
        f"MACD               : {macd_val:.4f}\n"
        f"MACD Signal        : {signal_val:.4f}\n"
        f"AI Prediction      : Change of {prediction_delta:+.4f}\n"
        f"Forecast Price     : ${latest_price + prediction_delta:.2f}\n"
        f"------------------> Trade Signal: {trade_signal}\n"
    )
    print(output)
def analyze_market(historical_data: list, latest_price: float) -> dict:
    """
    Computes several technical indicators from historical data and returns
    a dictionary with results.
    """
    close_prices = [float(item["close"]) for item in historical_data if "close" in item]
    sma_val = np.mean(close_prices[-20:]) if len(close_prices) >= 20 else np.mean(close_prices)
    rsi_values = compute_rsi(close_prices, period=14)
    rsi_latest = rsi_values[-1]
    sma_bb, upper_bb, lower_bb = compute_bollinger_bands(close_prices, period=20, num_std=2)
    upper_latest = upper_bb[-1]
    lower_latest = lower_bb[-1]
    macd_line, signal_line, _ = compute_macd(close_prices)
    macd_latest = macd_line[-1]
    signal_latest = signal_line[-1]
    return {
        "sma": sma_val,
        "rsi": rsi_latest,
        "upper_band": upper_latest,
        "lower_band": lower_latest,
        "macd": macd_latest,
        "macd_signal": signal_latest
    }
def ask_openai(prompt: str) -> str:
    """
    Uses OpenAI's API to provide an interactive response based on the prompt.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # or "gpt-3.5-turbo"
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        reply = response.choices[0].message.content.strip()
        return reply
    except Exception as e:
        return f"Error contacting OpenAI: {e}"
def main():
    # Get trading pair from user.
    trading_pair = get_user_trading_pair()    
    # Set time window for historical data.
    now = datetime.now(timezone.utc)
    one_day_ago = now - timedelta(days=1)
    interval = 1  # 5-minute intervals
      # Fetch latest market data.
    latest_data = get_latest_price(trading_pair)
    if not latest_data or "instruments" not in latest_data or not latest_data["instruments"]:
        print("Failed to retrieve latest data.")
        return
    latest_instrument = latest_data["instruments"][0]
    latest_price = float(latest_instrument["currentPrice"])  
    # Fetch historical data.
    historical_data = get_historical_data(trading_pair, one_day_ago, now, interval)
     # Handle both dict and list return types.
    if isinstance(historical_data, dict):
        data_items = historical_data.get("data", [])
    else:
        data_items = historical_data
    if not data_items:
        print("No historical data available.")
        return
    analysis = analyze_market(data_items, latest_price)    
    # Use Prophet-based model to forecast price delta.
    try:
        prediction_delta = ai_predictive_model_prophet(data_items)
    except Exception as e:
        print(f"Error in AI prediction: {e}")
        prediction_delta = 0.0
    forecasted_price = latest_price + prediction_delta
    # Generate a trade signal based on combined indicators.
    trade_signal = "HOLD"
    # Use conditions based on RSI and Bollinger Bands.
    if analysis["rsi"] < 30 and latest_price < analysis["lower_band"]:
        trade_signal = "BUY"
    elif analysis["rsi"] > 70 and latest_price > analysis["upper_band"]:
        trade_signal = "SELL"
    elif prediction_delta > 0.005 * latest_price:
        trade_signal = "BUY"
    elif prediction_delta < -0.005 * latest_price:
        trade_signal = "SELL"
    

    # Extend the analysis dictionary.
    analysis["prediction"] = prediction_delta
    analysis["forecasted_price"] = forecasted_price
    analysis["trade_signal"] = trade_signal
    # Visualize and print output.
    visualize_output(
        latest_price,
        analysis["sma"],
        analysis["rsi"],
        analysis["upper_band"],
        analysis["lower_band"],
        analysis["macd"],
        analysis["macd_signal"],
        analysis["prediction"],
        analysis["trade_signal"],
        trading_pair
    )
    # Ask user for a query and get OpenAI's response.      
    user_query = input("Type your question for the trading assistant or press Enter to exit: ").strip()
    if user_query:
        context = (
            f"Market data for {trading_pair.upper()}:\n"
            f"Latest Price: ${latest_price:.2f}\n"
            f"SMA (last 20): ${analysis['sma']:.2f}\n"
            f"RSI (14): {analysis['rsi']:.2f}\n"
            f"Bollinger Upper: ${analysis['upper_band']:.2f}\n"
            f"Bollinger Lower: ${analysis['lower_band']:.2f}\n"
            f"MACD: {analysis['macd']:.4f}\n"
            f"MACD Signal: {analysis['macd_signal']:.4f}\n"
            f"AI Prediction Delta: {analysis['prediction']:+.4f}\n"
            f"Forecast Price: ${analysis['forecasted_price']:.2f}\n"
            f"Trade Signal: {analysis['trade_signal']}\n\n"
            f"User Query: {user_query}\n"
            "Provide a detailed analysis and recommendation based on the market conditions."
        )
        openai_response = ask_openai(context)
        print("\n--- Trading Assistant Response ---")
        print(openai_response)
if __name__ == "__main__":
    main()
