import requests
import json
from datetime import datetime
import time

API_KEY = "Supra x-api key"
REST_BASE_URL = "https://prod-kline-rest.supra.com"
HISTORY_ENDPOINT = "/history"
LATEST_ENDPOINT = "/latest"
WS_URL = "wss://prod-kline-ws.supra.com"

def get_latest_price(trading_pair):
    """
    Get the latest price data (current price, 24-hour highs/lows, change, etc.) for a trading pair.
    """
    url = f"{REST_BASE_URL}{LATEST_ENDPOINT}"
    headers = {"x-api-key": API_KEY}
    params = {"trading_pair": trading_pair}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Status {response.status_code}", "details": response.text}

def get_historical_data(trading_pair, start_date, end_date, resolution):
    """
    Retrieve historical price data (OHLC data) for a given trading pair.
    
    Parameters:
      trading_pair: e.g. "btc_usd"
      start_date, end_date: Unix timestamps in milliseconds
      resolution: Time interval between data points (in minutes, e.g. 5)
    """
    url = f"{REST_BASE_URL}{HISTORY_ENDPOINT}"
    headers = {"x-api-key": API_KEY}
    params = {
        "trading_pair": trading_pair,
        "startDate": start_date,
        "endDate": end_date,
        "interval": resolution
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Status {response.status_code}", "details": response.text}

def subscribe_to_ws(trading_pair, resolution):
    """
    Establish a WebSocket connection to subscribe to real-time OHLC price feed updates.
    
    Users can specify a trading pair (e.g., "btc_usdt") and the time resolution (in minutes) for receiving updates.
    """
    try:
        import websocket
    except ImportError:
        print("Please install websocket-client (pip install websocket-client)")
        return

    def on_message(ws, message):
        print("\n[Real-Time WebSocket Data]")
        try:
            data = json.loads(message)
            print(json.dumps(data, indent=4))
        except Exception as e:
            print(f"Error parsing WebSocket message: {e}")

    def on_error(ws, error):
        print("WebSocket error:", error)

    def on_close(ws, close_status_code, close_msg):
        print("WebSocket closed.")

    def on_open(ws):
        sub_message = {
            "action": "subscribe",
            "channels": [
                {
                    "name": "ohlc_datafeed",
                    "resolution": resolution,
                    "dataPairs": [trading_pair]
                }
            ]
        }
        ws.send(json.dumps(sub_message))
        print(f"Subscribed to the live feed for {trading_pair} at a {resolution}-minute resolution.")

    headers = [f"x-api-key: {API_KEY}"]
    ws_app = websocket.WebSocketApp(
        WS_URL,
        header=headers,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    print("Starting WebSocket stream... (Press Ctrl+C to stop)")
    ws_app.run_forever()
def main():
    print("=== Welcome to the Supra Oracle Price Feeds AI Agent ===")
    print("You can ask for the following (in natural language):")
    print(" • 'Give me latest price data'")
    print(" • 'Show me coin details'")
    print(" • 'I need historical data' or 'give me OHLC data'")
    print(" • 'Subscribe to live updates'")
    print("Type 'exit' to quit.")

    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ("exit", "quit"):
            print("Exiting AI Agent. Goodbye!")
            break

        # Detect intent based on keywords
        elif "latest price" in user_input.lower():
            trading_pair = input("Please enter trading pair (e.g., btc_usdt): ").strip()
            result = get_latest_price(trading_pair)
            print("\n[Latest Price Data]")
            print(json.dumps(result, indent=4))

        elif "coin details" in user_input.lower():
            trading_pair = input("Please enter trading pair (e.g., btc_usdt): ").strip()
            result = get_latest_price(trading_pair)
            print("\n[Coin Details]")
            print(json.dumps(result, indent=4))

        elif "historical" in user_input.lower() or "ohlc" in user_input.lower() or "candlestick" in user_input.lower():
            trading_pair = input("Please enter trading pair (e.g., btc_usd): ").strip()
            print("Enter the start date (YYYY-MM-DD HH:MM:SS):")
            start_str = input().strip()
            print("Enter the end date (YYYY-MM-DD HH:MM:SS):")
            end_str = input().strip()
            resolution = input("Enter resolution in minutes (e.g., 5): ").strip()
            try:
                start_timestamp = int(datetime.strptime(start_str, "%Y-%m-%d %H:%M:%S").timestamp() * 1000)
                end_timestamp = int(datetime.strptime(end_str, "%Y-%m-%d %H:%M:%S").timestamp() * 1000)
            except Exception as e:
                print("Error parsing dates:", e)
                continue
            result = get_historical_data(trading_pair, start_timestamp, end_timestamp, resolution)
            print("\n[Historical OHLC Data]")
            print(json.dumps(result, indent=4))

        elif "subscribe" in user_input.lower() or "live update" in user_input.lower():
            trading_pair = input("Please enter trading pair for live feed (e.g., btc_usdt): ").strip()
            try:
                res_value = int(input("Enter resolution in minutes (e.g., 5): ").strip())
            except ValueError:
                print("Invalid resolution; using default of 5 minutes.")
                res_value = 5
            subscribe_to_ws(trading_pair, res_value)

        else:
            print("Sorry, I didn't understand that. Try asking for 'latest price data', 'coin details', 'historical data', or 'subscribe to live updates'.")

if __name__ == "__main__":
    main()
