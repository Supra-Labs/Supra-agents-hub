import requests
import json
import re
from tabulate import tabulate

class SupraAgent:
    def __init__(self):
        self.session = requests.Session()

    def get_transfer_stats(self):
        """Fetch transfer stats for SUPRA."""
        url = 'https://services.blockpour.com/query/stats/supra/transfer-stats'
        response = self.session.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error in get_transfer_stats: {response.status_code}")

    def get_recent_onchain_transfers(self, limit=50):
        """Fetch recent on-chain transfers."""
        url = f'https://services.blockpour.com/query/transfers/recent-supra?limit={limit}'
        response = self.session.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error in get_recent_onchain_transfers: {response.status_code}")

    def get_move_transactions(self, address):
        """Fetch finalized transactions sent by the move account."""
        url = f'https://rpc-testnet.supra.com/rpc/v1/accounts/{address}/transactions'
        response = self.session.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error in get_move_transactions: {response.status_code}")

def format_transfers(transfers):
    """Formats transfer data into a structured table."""
    headers = ["Time", "Block", "Sender", "Receiver", "Amount", "Token", "Transaction ID"]
    table_data = []
    
    for transfer in transfers.get("data", []):
        table_data.append([
            transfer["time"],
            transfer["block"],
            transfer["sender"],
            transfer["receiver"],
            transfer["amount"],
            transfer["token_symbol"],
            transfer["tx"]
        ])
    
    return tabulate(table_data, headers, tablefmt="grid")

def detect_command(user_input):
    """Detects command based on keywords in a sentence."""
    user_input = user_input.lower()

    if re.search(r"\btransfer stats\b", user_input):
        return "transfer_stats"
    elif re.search(r"\brecent transfers\b", user_input):
        return "recent_transfers"
    elif re.search(r"\bmove transactions\b", user_input) or re.search(r"\bfinalized transactions\b", user_input):
        return "move_transactions"
    else:
        return None

def main():
    agent = SupraAgent()
    print("\nWelcome to the Supra<>OpenBlocksAI Agent!")
    print("Ask for: 'transfer stats', 'recent transfers', or 'finalized transactions sent by the move account'.")
    print("Type 'exit' to quit.\n")
    
    while True:
        user_input = input("\nYou: ").strip().lower()
        
        if user_input == "exit":
            print("\nGoodbye!")
            break

        command = detect_command(user_input)
        
        if command == "transfer_stats":
            try:
                data = agent.get_transfer_stats()
                print("\nTransfer Stats:")
                print(json.dumps(data, indent=4))
            except Exception as e:
                print("Error:", str(e))

        elif command == "recent_transfers":
            try:
                data = agent.get_recent_onchain_transfers()
                print("\nRecent Transfers:")
                print(format_transfers(data))
            except Exception as e:
                print("Error:", str(e))

        elif command == "move_transactions":
            address = input("Enter move account address: ").strip()
            try:
                data = agent.get_move_transactions(address)
                print("\nMove Account Transactions:")
                print(json.dumps(data, indent=4))
            except Exception as e:
                print("Error:", str(e))

        else:
            print("I didn't understand that. Try 'transfer stats', 'recent transfers', or 'finalized transactions sent by the move account'.")

if __name__ == '__main__':
    main()
