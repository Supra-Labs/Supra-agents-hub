import readline from 'readline';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { SupraClient, SupraAccount, HexString } from 'supra-l1-sdk';

/**
 * Load the account from file "account.json" if exists,
 * otherwise create a new account and persist it.
 */
async function loadOrCreateAccount(): Promise<SupraAccount> {
  const accountFilePath = path.join(__dirname, 'account.json');

  // If file exists, load and restore the account object.
  if (fs.existsSync(accountFilePath)) {
    try {
      const data = fs.readFileSync(accountFilePath, 'utf-8');
      const accountObj = JSON.parse(data);
      const account = SupraAccount.fromSupraAccountObject(accountObj);
      console.log(chalk.green("Loaded existing account from account.json"));
      return account;
    } catch (error) {
      console.error(chalk.red("Error reading account file, creating new account"), error);
    }
  }

  // Create new account, save details to file.
  const account = new SupraAccount();
  const accountObj = account.toPrivateKeyObject();
  fs.writeFileSync(accountFilePath, JSON.stringify(accountObj, null, 2));
  console.log(chalk.yellow("Created new account and saved to account.json"));
  return account;
}

/**
 * A simple parser that interprets a human language command into a command type.
 */
function parseCommand(input: string): { command: string; hash?: string } {
  const lower = input.toLowerCase();
  if (lower.includes("balance") && lower.includes("account")) {
    return { command: "balance" };
  } else if (lower.includes("fund") && lower.includes("account")) {
    return { command: "fund" };
  } else if ( (lower.includes("transaction detail") || lower.includes("txdetail") || lower.includes("show") && lower.includes("transaction")) ) {

   // Try to extract a hash in the format 0x....
    const match = lower.match(/0x[a-f0-9]{64,}/);
    if (match) {
      return { command: "txdetail", hash: match[0] };
    } else {
      return { command: "txdetail", hash: "" };
    }
  } else if (lower.includes("transaction history") || lower.includes("txhistory")) {
    return { command: "txhistory" };
  } else if (lower.includes("resource") || lower.includes("resources")) {
    return { command: "resource" };
  } else if (lower.trim() === "help") {
    return { command: "help" };
  } else if (lower.trim() === "exit" || lower.trim() === "quit") {
    return { command: "exit" };
  }

  // Fallback default using trimmed low value (so you can still type "balance" etc.)
  return { command: lower.trim() };
}

async function main() {
  console.log(chalk.cyan.bold("\n*** Welcome to SupraOnChainAgent ***\n"));

  // Initialize Supra Client on testnet.
  console.log(chalk.blue("Initializing Supra Client..."));
  const supraClient = await SupraClient.init("https://rpc-mainnet.supra.com");
  console.log(chalk.green("Connected to network with chain ID:"), supraClient.chainId);

  // Load (or create) the account so that the same account persists across runs.
  const myAccount = await loadOrCreateAccount();
  const myAddress = myAccount.address();
  console.log(chalk.green("Your Supra Account Address:"), myAddress.toString());

  // Setup CLI interface.
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.magenta("Supra OnChain Agent> ")
  });

  console.log(chalk.yellow("\nAvailable commands:"));
  console.log(" - 'what is the balance of my account'     : Fetch account info & balance");
  console.log(" - 'please fund my account'                 : Fund account via faucet");
  console.log(" - 'show me transaction details for <TX_HASH>': Fetch transaction details");
  console.log(" - 'what is my transaction history'         : Retrieve transaction history");
  console.log(" - 'show my account resources'              : Fetch resource data");
  console.log(" - 'help'                                   : Show this help message");
  console.log(" - 'exit'                                   : Quit the agent\n");

  rl.prompt();

  rl.on('line', async (input: string) => {
    const { command, hash } = parseCommand(input);
    
    switch (command) {
      case "balance": {
        try {
          const accountInfo = await supraClient.getAccountInfo(myAddress);
          const balance = await supraClient.getAccountSupraCoinBalance(myAddress);
          console.log(chalk.cyan("\n--- Account Info ---"));
          console.log(chalk.white("Address          :"), myAddress.toString());
          console.log(chalk.white("Sequence Number  :"), accountInfo.sequence_number);
          console.log(chalk.white("Authentication Key:"), accountInfo.authentication_key);
          console.log(chalk.white("Balance          :"), balance.toString());
          console.log(chalk.cyan("---------------------\n"));
        } catch (error) {
          console.error(chalk.red("Error fetching balance info:"), error);
        }
        break;
      }
      case "fund": {
        try {
          console.log(chalk.blue("Requesting funds via faucet..."));
          const fundResponse = await supraClient.fundAccountWithFaucet(myAddress);
          console.log(chalk.green("Faucet Response:"), fundResponse);

          // Wait 5 seconds before updating the balance.
          setTimeout(async () => {
            const updatedBalance = await supraClient.getAccountSupraCoinBalance(myAddress);
            console.log(chalk.green("Updated Account Balance:"), updatedBalance.toString());
            rl.prompt();
          }, 5000);
          return;
        } catch (error) {
          console.error(chalk.red("Error funding account:"), error);
        }
        break;
      }
      case "txdetail": {
        if (!hash) {
          console.log(chalk.red("Please include a valid transaction hash (starting with 0x...)"));
        } else {
          try {
            const txDetails = await supraClient.getTransactionDetail(myAddress, hash);
            console.log(chalk.cyan("\n--- Transaction Details ---"));
            console.log(chalk.white(JSON.stringify(txDetails, null, 2)));
            console.log(chalk.cyan("---------------------------\n"));
          } catch (error) {
            console.error(chalk.red("Error fetching transaction details:"), error);
          }
        }
        break;
      }
      case "txhistory": {
        try {
          const txHistory = await supraClient.getAccountTransactionsDetail(myAddress);
          console.log(chalk.cyan("\n--- Transaction History ---"));
          console.log(chalk.white(JSON.stringify(txHistory, null, 2)));
          console.log(chalk.cyan("---------------------------\n"));
        } catch (error) {
          console.error(chalk.red("Error fetching transaction history:"), error);
        }
        break;
      }
      case "resource": {
        try {
          const resources = await supraClient.getAccountResources(myAddress);
          console.log(chalk.cyan("\n--- Account Resources ---"));
          console.log(chalk.white(JSON.stringify(resources, null, 2)));
          console.log(chalk.cyan("-------------------------\n"));
        } catch (error) {
          console.error(chalk.red("Error fetching account resources:"), error);
        }
        break;
      }
      case "help": {
        console.log(chalk.yellow("\nCommands:"));
        console.log(" - 'what is the balance of my account'     : Fetch account info & balance");
        console.log(" - 'please fund my account'                 : Fund account via faucet");
        console.log(" - 'show me transaction details for <TX_HASH>': Fetch transaction details");
        console.log(" - 'what is my transaction history'         : Retrieve transaction history");
        console.log(" - 'show my account resources'              : Fetch resource data");
        console.log(" - 'exit'                                   : Quit the agent\n");
        break;
      }
      case "exit": {
        console.log(chalk.blue("Exiting agent. Goodbye!"));
        rl.close();
        process.exit(0);
      }
      default: {
        console.log(chalk.red("Command not recognized. Type 'help' for available commands."));
        break;
      }
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.blue("CLI interface closed."));
  });
}

main().catch((error) => {
  console.error(chalk.red("Initialization error:"), error);
});