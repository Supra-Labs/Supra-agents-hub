# Supra OpenBlocksAI Agent

This AI Agent Interacts with the **Supra Network** using **OpenBlocks.ai**, It enables users to fetch transfer stats, view recent on-chain transactions, and retrieve finalized transactions from wallet's Move account.

## What the AI Agent Does?

✅ **Fetch Transfer Stats for SUPRA** – Retrieves stats from Supra’s ecosystem via OpenBlocks Endpoints.  

✅ **Get Recent On-Chain Transfers** – Views the latest transfers happening on the Supra L1 network.  

✅ **Fetch Finalized Transactions** – Queries the list of transactions for any Supra Move account using wallet address.  

## Run the AI Agent

1️⃣ **Clone the Repository**  

```bash
git clone https://github.com/Supra-Labs/Supra-agents-hub.git
```
// Navigate into root dir.

```bash
cd Agents
cd "OpenBlocksAI Agent"
```

2️⃣ **Install Dependencies**

```bash
pip install requests tabulate
```

3️⃣ **Run the AI Agent**

```bash
python Agent.py
```

## Prompts

```bash

You: Recent transfers  

Agent: (in an tabluar format)
+----------------------+----------+--------------------------------+--------------------------------+------------+--------+--------------------------------+
| Time                 | Block    | Sender                         | Receiver                       | Amount     | Token  | Transaction ID                 |
+----------------------+----------+--------------------------------+--------------------------------+------------+--------+--------------------------------+
| 2025-05-18T21:02:59 | 12570458 | 0x84b167...6d7add256ecf50a4bc7 | 0x8bea0c...cdd66f18eb8        | 22765.211  | SUPRA  | 0xaed639...940a13161           |
| 2025-05-18T21:01:48 | 12570402 | 0x6a05eb...996fbc90           | 0xe7f617...10a6cee            | 5001       | SUPRA  | 0x27a28f...6c1e797            |
+----------------------+----------+--------------------------------+--------------------------------+------------+--------+--------------------------------+

You: finalized transactions sent by the move account
Agent: Enter move account address: 
You: 0xfb93f1edc9603149578590eb8a21cd1571df977c5b50a4a25cf71a9448b90a06

Agent: Move Account Transactions:
{
    "record": [
        {
            "authenticator": {
                "Move": {
                    "FeePayer": {
                        "sender": {
                            "Ed25519": {
                                "public_key": "0xa4ef621bfde94247a067170a3dcda1dc3eb00b2099c581e96baa897b70400bee",
                                "signature": "0x8aa264c0701e6831e3fab58bb3313f86eaf61c1bb70f4c9305c5daba26aba75e4781bb9f6edaa07e9aee78032c68ddc7af0893c26b771c9559338c1962977703"
                            }
                        },
                        "secondary_signer_addresses": [],
                        "secondary_signers": [],
                        "fee_payer_address": "50f694bde9ac4abb60df14b69db4b17b362f64907bc5917cc24098ccd64cb2f2",
                        "fee_payer_signer": {
                            "Ed25519": {
                                "public_key": "0xea1cd39f5b93363c3a5f0958f7e7f75b9a44eeb3d87d959384fd100bc9df443e",
                                "signature": "0x7a132a78829c086f4f2297bf16e3aa9987a68eaa3160510be3cc1569846fc37d8697cbbc444dceeb3c7e5aca67e8a083936dd3a471eb6de577c1ca964861eb04"
                            }
                        }
                    }
                }
            },
            "block_header": {
                "hash": "0xe80796c13943768f74e41815e7f19df5308ac20eb99fe6c4b8f90a71101dfcaa",
                "height": 12595931,
                "timestamp": {
                    "microseconds_since_unix_epoch": 1747634122000376,
                    "utc_date_time": "2025-05-19T05:55:22.000376+00:00"
                }
            },
            "hash": "0x852ddb613c71b48e8a9bc465eba196de348dba58c4359ad05703a64d381b37d9",
            "header": {
                "chain_id": 8,
                "expiration_timestamp": {
                    "microseconds_since_unix_epoch": 1747634417000000,
                    "utc_date_time": "2025-05-19T06:00:17+00:00"
                },
                "sender": {
                    "Move": "0xfb93f1edc9603149578590eb8a21cd1571df977c5b50a4a25cf71a9448b90a06"
                },
                "sequence_number": 0,
                "gas_unit_price": 100,
                "max_gas_amount": 500000
            },
            "payload": {
                "Move": {
                    "type": "entry_function_payload",
                    "function": "0xaad547bcc033d86000c9718a25ef99025b5d1783c523fac866a9af4c33e8c442::LyncCards::mint_nft",
                    "type_arguments": [],
                    "arguments": [
                        "0x642592fbe27e8230cd622cfd439e6a2b658d69d99dd0da6de71806438aa7f0b3172f13da9313fdd5d3b21700399109ab75b0ebab9cc45d0763ff8df260d27101", 
                        "4",
                        "1"
                    ]
                }
            }
.....
```