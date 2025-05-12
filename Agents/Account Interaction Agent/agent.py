import openai
import requests

openai.api_key = "OPEN_AI_API_KEY"  # Replace with your OpenAI API key
# For testnet, use the following line:
BASE_URL = "https://rpc-testnet.supra.com/rpc/v1"

def ai_chat_response(user_input):
    response = openai.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a Supra L1 assistant."},
            {"role": "user", "content": user_input}
        ]
    )
#
    return response.choices[0].message.content

def get_coin_transactions(address):
    url = f"{BASE_URL}/accounts/{address}/coin_transactions"
    response = requests.get(url)
    return response.json()

def get_transaction_details(transaction_hash):
    url = f"{BASE_URL}/transactions/{transaction_hash}"
    response = requests.get(url)
    return response.json()

def get_faucet_tokens(address):
    url = f"{BASE_URL}/wallet/faucet/{address}"
    response = requests.get(url)
    return response.json()

def start_chat():
    print("🤖 Welcome to the Supra AI Agent! Type 'exit' to quit.")
    while True:
        user_input = input("You: ")

        if user_input.lower() == "exit":
            print("👋 Goodbye!")
            break

        elif "balance" in user_input.lower():
            wallet = input("🔹 Enter your wallet address: ")
            balance_info = get_coin_transactions(wallet)
            print(f"🔹 Wallet Balance Info: {balance_info}")

        elif "transaction" in user_input.lower():
            tx_hash = input("🔹 Enter the transaction hash: ")
            tx_details = get_transaction_details(tx_hash)
            print(f"🔹 Transaction Details: {tx_details}")

        elif "faucet" in user_input.lower():
            wallet = input("🔹 Enter your wallet address for testnet tokens: ")
            faucet_status = get_faucet_tokens(wallet)
            print(f"🔹 Faucet Request Status: {faucet_status}")

        else:
            ai_reply = ai_chat_response(user_input)
            print(f"🤖 AI: {ai_reply}")

if __name__ == "__main__":
    start_chat()
