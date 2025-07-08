import nacl from 'tweetnacl';

/**
 * All bytes (Vec<u8>) data is represented as hex-encoded string prefixed with `0x` and fulfilled with
 * two hex digits per byte.
 *
 * Unlike the `Address` type, HexEncodedBytes will not trim any zeros.
 *
 */
type HexEncodedBytes = string;

/**
 * A string containing a 64-bit unsigned integer.
 *
 * We represent u64 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u64s in JSON natively.
 *
 */
type U64 = string;

/**
 * Account data
 *
 * A simplified version of the onchain Account resource
 */
type AccountData = {
    sequence_number: U64;
    authentication_key: HexEncodedBytes;
};

/**
 * A single Ed25519 signature
 */
type Ed25519Signature$1 = {
    public_key: HexEncodedBytes;
    signature: HexEncodedBytes;
};

type AccountSignature_Ed25519Signature = ({
    type: string;
} & Ed25519Signature$1);

/**
 * A Ed25519 multi-sig signature
 *
 * This allows k-of-n signing for a transaction
 */
type MultiEd25519Signature$1 = {
    /**
     * The public keys for the Ed25519 signature
     */
    public_keys: Array<HexEncodedBytes>;
    /**
     * Signature associated with the public keys in the same order
     */
    signatures: Array<HexEncodedBytes>;
    /**
     * The number of signatures required for a successful transaction
     */
    threshold: number;
    bitmap: HexEncodedBytes;
};

type AccountSignature_MultiEd25519Signature = ({
    type: string;
} & MultiEd25519Signature$1);

type Ed25519 = {
    value: HexEncodedBytes;
};

type Signature_Ed25519 = ({
    type: string;
} & Ed25519);

type Keyless = {
    value: HexEncodedBytes;
};

type Signature_Keyless = ({
    type: string;
} & Keyless);

type Secp256k1Ecdsa = {
    value: HexEncodedBytes;
};

type Signature_Secp256k1Ecdsa = ({
    type: string;
} & Secp256k1Ecdsa);

type WebAuthn = {
    value: HexEncodedBytes;
};

type Signature_WebAuthn = ({
    type: string;
} & WebAuthn);

type Signature = (Signature_Ed25519 | Signature_Secp256k1Ecdsa | Signature_WebAuthn | Signature_Keyless);

type IndexedSignature = {
    index: number;
    signature: Signature;
};

type PublicKey_Ed25519 = ({
    type: string;
} & Ed25519);

type PublicKey_Keyless = ({
    type: string;
} & Keyless);

type PublicKey_Secp256k1Ecdsa = ({
    type: string;
} & Secp256k1Ecdsa);

type Secp256r1Ecdsa = {
    value: HexEncodedBytes;
};

type PublicKey_Secp256r1Ecdsa = ({
    type: string;
} & Secp256r1Ecdsa);

type PublicKey = (PublicKey_Ed25519 | PublicKey_Secp256k1Ecdsa | PublicKey_Secp256r1Ecdsa | PublicKey_Keyless);

/**
 * A multi key signature
 */
type MultiKeySignature = {
    public_keys: Array<PublicKey>;
    signatures: Array<IndexedSignature>;
    signatures_required: number;
};

type AccountSignature_MultiKeySignature = ({
    type: string;
} & MultiKeySignature);

/**
 * A single key signature
 */
type SingleKeySignature = {
    public_key: PublicKey;
    signature: Signature;
};

type AccountSignature_SingleKeySignature = ({
    type: string;
} & SingleKeySignature);

/**
 * Account signature scheme
 *
 * The account signature scheme allows you to have two types of accounts:
 *
 * 1. A single Ed25519 key account, one private key
 * 2. A k-of-n multi-Ed25519 key account, multiple private keys, such that k-of-n must sign a transaction.
 * 3. A single Secp256k1Ecdsa key account, one private key
 */
type AccountSignature = (AccountSignature_Ed25519Signature | AccountSignature_MultiEd25519Signature | AccountSignature_SingleKeySignature | AccountSignature_MultiKeySignature);

/**
 * A hex encoded 32 byte Aptos account address.
 *
 * This is represented in a string as a 64 character hex string, sometimes
 * shortened by stripping leading 0s, and adding a 0x.
 *
 * For example, address 0x0000000000000000000000000000000000000000000000000000000000000001 is represented as 0x1.
 *
 */
type Address = string;

/**
 * These codes provide more granular error information beyond just the HTTP
 * status code of the response.
 */
declare enum AptosErrorCode {
    ACCOUNT_NOT_FOUND = "account_not_found",
    RESOURCE_NOT_FOUND = "resource_not_found",
    MODULE_NOT_FOUND = "module_not_found",
    STRUCT_FIELD_NOT_FOUND = "struct_field_not_found",
    VERSION_NOT_FOUND = "version_not_found",
    TRANSACTION_NOT_FOUND = "transaction_not_found",
    TABLE_ITEM_NOT_FOUND = "table_item_not_found",
    BLOCK_NOT_FOUND = "block_not_found",
    STATE_VALUE_NOT_FOUND = "state_value_not_found",
    VERSION_PRUNED = "version_pruned",
    BLOCK_PRUNED = "block_pruned",
    INVALID_INPUT = "invalid_input",
    INVALID_TRANSACTION_UPDATE = "invalid_transaction_update",
    SEQUENCE_NUMBER_TOO_OLD = "sequence_number_too_old",
    VM_ERROR = "vm_error",
    HEALTH_CHECK_FAILED = "health_check_failed",
    MEMPOOL_IS_FULL = "mempool_is_full",
    INTERNAL_ERROR = "internal_error",
    WEB_FRAMEWORK_ERROR = "web_framework_error",
    BCS_NOT_SUPPORTED = "bcs_not_supported",
    API_DISABLED = "api_disabled"
}

/**
 * This is the generic struct we use for all API errors, it contains a string
 * message and an Aptos API specific error code.
 */
type AptosError = {
    /**
     * A message describing the error
     */
    message: string;
    error_code: AptosErrorCode;
    /**
     * A code providing VM error details when submitting transactions to the VM
     */
    vm_error_code?: number;
};

type HashValue = string;

type BlockEndInfo = {
    block_gas_limit_reached: boolean;
    block_output_limit_reached: boolean;
    block_effective_block_gas_units: number;
    block_approx_output_size: number;
};

/**
 * Move module id is a string representation of Move module.
 *
 * Format: `{address}::{module name}`
 *
 * `address` should be hex-encoded 32 byte account address that is prefixed with `0x`.
 *
 * Module name is case-sensitive.
 *
 */
type MoveModuleId = string;

/**
 * Delete a module
 */
type DeleteModule = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    module: MoveModuleId;
};

type WriteSetChange_DeleteModule = ({
    type: string;
} & DeleteModule);

/**
 * String representation of a MoveStructTag (on-chain Move struct type). This exists so you
 * can specify MoveStructTags as path / query parameters, e.g. for get_events_by_event_handle.
 *
 * It is a combination of:
 * 1. `move_module_address`, `module_name` and `struct_name`, all joined by `::`
 * 2. `struct generic type parameters` joined by `, `
 *
 * Examples:
 * * `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
 * * `0x1::account::Account`
 *
 * Note:
 * 1. Empty chars should be ignored when comparing 2 struct tag ids.
 * 2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 *
 * See [doc](https://aptos.dev/concepts/accounts) for more details.
 *
 */
type MoveStructTag = string;

/**
 * Delete a resource
 */
type DeleteResource = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    resource: MoveStructTag;
};

type WriteSetChange_DeleteResource = ({
    type: string;
} & DeleteResource);

/**
 * Deleted table data
 */
type DeletedTableData = {
    /**
     * Deleted key
     */
    key: any;
    /**
     * Deleted key type
     */
    key_type: string;
};

/**
 * Delete a table item
 */
type DeleteTableItem = {
    state_key_hash: string;
    handle: HexEncodedBytes;
    key: HexEncodedBytes;
    data?: DeletedTableData;
};

type WriteSetChange_DeleteTableItem = ({
    type: string;
} & DeleteTableItem);

type IdentifierWrapper = string;

type MoveAbility = string;

/**
 * Move function generic type param
 */
type MoveFunctionGenericTypeParam = {
    /**
     * Move abilities tied to the generic type param and associated with the function that uses it
     */
    constraints: Array<MoveAbility>;
};

/**
 * Move function visibility
 */
declare enum MoveFunctionVisibility {
    PRIVATE = "private",
    PUBLIC = "public",
    FRIEND = "friend"
}

/**
 * String representation of an on-chain Move type tag that is exposed in transaction payload.
 * Values:
 * - bool
 * - u8
 * - u16
 * - u32
 * - u64
 * - u128
 * - u256
 * - address
 * - signer
 * - vector: `vector<{non-reference MoveTypeId}>`
 * - struct: `{address}::{module_name}::{struct_name}::<{generic types}>`
 *
 * Vector type value examples:
 * - `vector<u8>`
 * - `vector<vector<u64>>`
 * - `vector<0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>>`
 *
 * Struct type value examples:
 * - `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>
 * - `0x1::account::Account`
 *
 * Note:
 * 1. Empty chars should be ignored when comparing 2 struct tag ids.
 * 2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 *
 */
type MoveType = string;

/**
 * Move function
 */
type MoveFunction = {
    name: IdentifierWrapper;
    visibility: MoveFunctionVisibility;
    /**
     * Whether the function can be called as an entry function directly in a transaction
     */
    is_entry: boolean;
    /**
     * Whether the function is a view function or not
     */
    is_view: boolean;
    /**
     * Generic type params associated with the Move function
     */
    generic_type_params: Array<MoveFunctionGenericTypeParam>;
    /**
     * Parameters associated with the move function
     */
    params: Array<MoveType>;
    /**
     * Return type of the function
     */
    return: Array<MoveType>;
};

/**
 * Move struct field
 */
type MoveStructField = {
    name: IdentifierWrapper;
    type: MoveType;
};

/**
 * Move generic type param
 */
type MoveStructGenericTypeParam = {
    /**
     * Move abilities tied to the generic type param and associated with the type that uses it
     */
    constraints: Array<MoveAbility>;
};

/**
 * A move struct
 */
type MoveStruct = {
    name: IdentifierWrapper;
    /**
     * Whether the struct is a native struct of Move
     */
    is_native: boolean;
    /**
     * Abilities associated with the struct
     */
    abilities: Array<MoveAbility>;
    /**
     * Generic types associated with the struct
     */
    generic_type_params: Array<MoveStructGenericTypeParam>;
    /**
     * Fields associated with the struct
     */
    fields: Array<MoveStructField>;
};

/**
 * A Move module
 */
type MoveModule = {
    address: Address;
    name: IdentifierWrapper;
    /**
     * Friends of the module
     */
    friends: Array<MoveModuleId>;
    /**
     * Public functions of the module
     */
    exposed_functions: Array<MoveFunction>;
    /**
     * Structs of the module
     */
    structs: Array<MoveStruct>;
};

/**
 * Move module bytecode along with it's ABI
 */
type MoveModuleBytecode = {
    bytecode: HexEncodedBytes;
    abi?: MoveModule;
};

/**
 * Write a new module or update an existing one
 */
type WriteModule = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveModuleBytecode;
};

type WriteSetChange_WriteModule = ({
    type: string;
} & WriteModule);

/**
 * This is a JSON representation of some data within an account resource. More specifically,
 * it is a map of strings to arbitrary JSON values / objects, where the keys are top level
 * fields within the given resource.
 *
 * To clarify, you might query for 0x1::account::Account and see the example data.
 *
 * Move `bool` type value is serialized into `boolean`.
 *
 * Move `u8`, `u16` and `u32` type value is serialized into `integer`.
 *
 * Move `u64`, `u128` and `u256` type value is serialized into `string`.
 *
 * Move `address` type value (32 byte Aptos account address) is serialized into a HexEncodedBytes string.
 * For example:
 * - `0x1`
 * - `0x1668f6be25668c1a17cd8caf6b8d2f25`
 *
 * Move `vector` type value is serialized into `array`, except `vector<u8>` which is serialized into a
 * HexEncodedBytes string with `0x` prefix.
 * For example:
 * - `vector<u64>{255, 255}` => `["255", "255"]`
 * - `vector<u8>{255, 255}` => `0xffff`
 *
 * Move `struct` type value is serialized into `object` that looks like this (except some Move stdlib types, see the following section):
 * ```json
 * {
     * field1_name: field1_value,
     * field2_name: field2_value,
     * ......
     * }
     * ```
     *
     * For example:
     * `{ "created": "0xa550c18", "role_id": "0" }`
     *
     * **Special serialization for Move stdlib types**:
     * - [0x1::string::String](https://github.com/aptos-labs/aptos-core/blob/main/language/move-stdlib/docs/ascii.md)
     * is serialized into `string`. For example, struct value `0x1::string::String{bytes: b"Hello World!"}`
     * is serialized as `"Hello World!"` in JSON.
     *
     */
type MoveStructValue = {};

/**
 * A parsed Move resource
 */
type MoveResource = {
    type: MoveStructTag;
    data: MoveStructValue;
};

/**
 * Write a resource or update an existing one
 */
type WriteResource = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveResource;
};

type WriteSetChange_WriteResource = ({
    type: string;
} & WriteResource);

/**
 * Decoded table data
 */
type DecodedTableData = {
    /**
     * Key of table in JSON
     */
    key: any;
    /**
     * Type of key
     */
    key_type: string;
    /**
     * Value of table in JSON
     */
    value: any;
    /**
     * Type of value
     */
    value_type: string;
};

/**
 * Change set to write a table item
 */
type WriteTableItem = {
    state_key_hash: string;
    handle: HexEncodedBytes;
    key: HexEncodedBytes;
    value: HexEncodedBytes;
    data?: DecodedTableData;
};

type WriteSetChange_WriteTableItem = ({
    type: string;
} & WriteTableItem);

/**
 * A final state change of a transaction on a resource or module
 */
type WriteSetChange = (WriteSetChange_DeleteModule | WriteSetChange_DeleteResource | WriteSetChange_DeleteTableItem | WriteSetChange_WriteModule | WriteSetChange_WriteResource | WriteSetChange_WriteTableItem);

/**
 * A block epilogue transaction
 */
type BlockEpilogueTransaction = {
    version: U64;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    timestamp: U64;
    block_end_info?: BlockEndInfo;
};

type Transaction_BlockEpilogueTransaction = ({
    type: string;
} & BlockEpilogueTransaction);

type EventGuid = {
    creation_number: U64;
    account_address: Address;
};

/**
 * An event from a transaction
 */
type Event = {
    guid: EventGuid;
    sequence_number: U64;
    type: MoveType;
    /**
     * The JSON representation of the event
     */
    data: any;
};

/**
 * A block metadata transaction
 *
 * This signifies the beginning of a block, and contains information
 * about the specific block
 */
type BlockMetadataTransaction = {
    version: U64;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    id: HashValue;
    epoch: U64;
    round: U64;
    /**
     * The events emitted at the block creation
     */
    events: Array<Event>;
    /**
     * Previous block votes
     */
    previous_block_votes_bitvec: Array<number>;
    proposer: Address;
    /**
     * The indices of the proposers who failed to propose
     */
    failed_proposer_indices: Array<number>;
    timestamp: U64;
};

type Transaction_BlockMetadataTransaction = ({
    type: string;
} & BlockMetadataTransaction);

type DirectWriteSet = {
    changes: Array<WriteSetChange>;
    events: Array<Event>;
};

type WriteSet_DirectWriteSet = ({
    type: string;
} & DirectWriteSet);

/**
 * Move script bytecode
 */
type MoveScriptBytecode = {
    bytecode: HexEncodedBytes;
    abi?: MoveFunction;
};

/**
 * Payload which runs a script that can run multiple functions
 */
type ScriptPayload = {
    code: MoveScriptBytecode;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

type ScriptWriteSet = {
    execute_as: Address;
    script: ScriptPayload;
};

type WriteSet_ScriptWriteSet = ({
    type: string;
} & ScriptWriteSet);

/**
 * The associated writeset with a payload
 */
type WriteSet$1 = (WriteSet_ScriptWriteSet | WriteSet_DirectWriteSet);

/**
 * A writeset payload, used only for genesis
 */
type WriteSetPayload = {
    write_set: WriteSet$1;
};

type GenesisPayload_WriteSetPayload = ({
    type: string;
} & WriteSetPayload);

/**
 * The writeset payload of the Genesis transaction
 */
type GenesisPayload = GenesisPayload_WriteSetPayload;

/**
 * The genesis transaction
 *
 * This only occurs at the genesis transaction (version 0)
 */
type GenesisTransaction = {
    version: U64;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    payload: GenesisPayload;
    /**
     * Events emitted during genesis
     */
    events: Array<Event>;
};

type Transaction_GenesisTransaction = ({
    type: string;
} & GenesisTransaction);

type DeprecatedModuleBundlePayload = {};

type TransactionPayload_DeprecatedModuleBundlePayload = ({
    type: string;
} & DeprecatedModuleBundlePayload);

/**
 * Entry function id is string representation of a entry function defined on-chain.
 *
 * Format: `{address}::{module name}::{function name}`
 *
 * Both `module name` and `function name` are case-sensitive.
 *
 */
type EntryFunctionId = string;

/**
 * Payload which runs a single entry function
 */
type EntryFunctionPayload = {
    function: EntryFunctionId;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

type TransactionPayload_EntryFunctionPayload = ({
    type: string;
} & EntryFunctionPayload);

type MultisigTransactionPayload_EntryFunctionPayload = ({
    type: string;
} & EntryFunctionPayload);

type MultisigTransactionPayload = MultisigTransactionPayload_EntryFunctionPayload;

/**
 * A multisig transaction that allows an owner of a multisig account to execute a pre-approved
 * transaction as the multisig account.
 */
type MultisigPayload = {
    multisig_address: Address;
    transaction_payload?: MultisigTransactionPayload;
};

type TransactionPayload_MultisigPayload = ({
    type: string;
} & MultisigPayload);

type TransactionPayload_ScriptPayload = ({
    type: string;
} & ScriptPayload);

/**
 * An enum of the possible transaction payloads
 */
type TransactionPayload$1 = (TransactionPayload_EntryFunctionPayload | TransactionPayload_ScriptPayload | TransactionPayload_DeprecatedModuleBundlePayload | TransactionPayload_MultisigPayload);

type TransactionSignature_AccountSignature = ({
    type: string;
} & AccountSignature);

type TransactionSignature_Ed25519Signature = ({
    type: string;
} & Ed25519Signature$1);

/**
 * Fee payer signature for fee payer transactions
 *
 * This allows you to have transactions across multiple accounts and with a fee payer
 */
type FeePayerSignature = {
    sender: AccountSignature;
    /**
     * The other involved parties' addresses
     */
    secondary_signer_addresses: Array<Address>;
    /**
     * The associated signatures, in the same order as the secondary addresses
     */
    secondary_signers: Array<AccountSignature>;
    fee_payer_address: Address;
    fee_payer_signer: AccountSignature;
};

type TransactionSignature_FeePayerSignature = ({
    type: string;
} & FeePayerSignature);

/**
 * Multi agent signature for multi agent transactions
 *
 * This allows you to have transactions across multiple accounts
 */
type MultiAgentSignature = {
    sender: AccountSignature;
    /**
     * The other involved parties' addresses
     */
    secondary_signer_addresses: Array<Address>;
    /**
     * The associated signatures, in the same order as the secondary addresses
     */
    secondary_signers: Array<AccountSignature>;
};

type TransactionSignature_MultiAgentSignature = ({
    type: string;
} & MultiAgentSignature);

type TransactionSignature_MultiEd25519Signature = ({
    type: string;
} & MultiEd25519Signature$1);

/**
 * An enum representing the different transaction signatures available
 */
type TransactionSignature = (TransactionSignature_Ed25519Signature | TransactionSignature_MultiEd25519Signature | TransactionSignature_MultiAgentSignature | TransactionSignature_FeePayerSignature | TransactionSignature_AccountSignature);

/**
 * A transaction waiting in mempool
 */
type PendingTransaction = {
    hash: HashValue;
    sender: Address;
    sequence_number: U64;
    max_gas_amount: U64;
    gas_unit_price: U64;
    expiration_timestamp_secs: U64;
    payload: TransactionPayload$1;
    signature?: TransactionSignature;
};

type Transaction_PendingTransaction = ({
    type: string;
} & PendingTransaction);

/**
 * A state checkpoint transaction
 */
type StateCheckpointTransaction = {
    version: U64;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    timestamp: U64;
};

type Transaction_StateCheckpointTransaction = ({
    type: string;
} & StateCheckpointTransaction);

/**
 * A transaction submitted by a user to change the state of the blockchain
 */
type UserTransaction$1 = {
    version: U64;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    sender: Address;
    sequence_number: U64;
    max_gas_amount: U64;
    gas_unit_price: U64;
    expiration_timestamp_secs: U64;
    payload: TransactionPayload$1;
    signature?: TransactionSignature;
    /**
     * Events generated by the transaction
     */
    events: Array<Event>;
    timestamp: U64;
};

type Transaction_UserTransaction = ({
    type: string;
} & UserTransaction$1);

type ValidatorTransaction = {
    version: U64;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    events: Array<Event>;
    timestamp: U64;
};

type Transaction_ValidatorTransaction = ({
    type: string;
} & ValidatorTransaction);

/**
 * Enum of the different types of transactions in Aptos
 */
type Transaction$1 = (Transaction_PendingTransaction | Transaction_UserTransaction | Transaction_GenesisTransaction | Transaction_BlockMetadataTransaction | Transaction_StateCheckpointTransaction | Transaction_BlockEpilogueTransaction | Transaction_ValidatorTransaction);

/**
 * A Block with or without transactions
 *
 * This contains the information about a transactions along with
 * associated transactions if requested
 */
type Block = {
    block_height: U64;
    block_hash: HashValue;
    block_timestamp: U64;
    first_version: U64;
    last_version: U64;
    /**
     * The transactions in the block in sequential order
     */
    transactions?: Array<Transaction$1>;
};

/**
 * Request to encode a submission
 */
type EncodeSubmissionRequest = {
    sender: Address;
    sequence_number: U64;
    max_gas_amount: U64;
    gas_unit_price: U64;
    expiration_timestamp_secs: U64;
    payload: TransactionPayload$1;
    /**
     * Secondary signer accounts of the request for Multi-agent
     */
    secondary_signers?: Array<Address>;
};

/**
 * Struct holding the outputs of the estimate gas API
 */
type GasEstimation = {
    /**
     * The deprioritized estimate for the gas unit price
     */
    deprioritized_gas_estimate?: number;
    /**
     * The current estimate for the gas unit price
     */
    gas_estimate: number;
    /**
     * The prioritized estimate for the gas unit price
     */
    prioritized_gas_estimate?: number;
};

/**
 * Representation of a successful healthcheck
 */
type HealthCheckSuccess = {
    message: string;
};

declare enum RoleType {
    VALIDATOR = "validator",
    FULL_NODE = "full_node"
}

/**
 * The struct holding all data returned to the client by the
 * index endpoint (i.e., GET "/").  Only for responding in JSON
 */
type IndexResponse = {
    /**
     * Chain ID of the current chain
     */
    chain_id: number;
    epoch: U64;
    ledger_version: U64;
    oldest_ledger_version: U64;
    ledger_timestamp: U64;
    node_role: RoleType;
    oldest_block_height: U64;
    block_height: U64;
    /**
     * Git hash of the build of the API endpoint.  Can be used to determine the exact
     * software version used by the API endpoint.
     */
    git_hash?: string;
};

/**
 * A string containing a 128-bit unsigned integer.
 *
 * We represent u128 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u128s in JSON natively.
 *
 */
type U128 = string;

/**
 * A string containing a 256-bit unsigned integer.
 *
 * We represent u256 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u256s in JSON natively.
 *
 */
type U256 = string;

/**
 * An enum of the possible Move value types
 */
type MoveValue = (number | U64 | U128 | U256 | boolean | Address | Array<MoveValue> | HexEncodedBytes | MoveStructValue | string);

/**
 * Table Item request for the GetTableItemRaw API
 */
type RawTableItemRequest = {
    key: HexEncodedBytes;
};

/**
 * Representation of a StateKey as a hex string. This is used for cursor based pagination.
 *
 */
type StateKeyWrapper = string;

/**
 * A request to submit a transaction
 *
 * This requires a transaction and a signature of it
 */
type SubmitTransactionRequest = {
    sender: Address;
    sequence_number: U64;
    max_gas_amount: U64;
    gas_unit_price: U64;
    expiration_timestamp_secs: U64;
    payload: TransactionPayload$1;
    signature: TransactionSignature;
};

/**
 * Table Item request for the GetTableItem API
 */
type TableItemRequest = {
    key_type: MoveType;
    value_type: MoveType;
    /**
     * The value of the table item's key
     */
    key: any;
};

/**
 * Information telling which batch submission transactions failed
 */
type TransactionsBatchSingleSubmissionFailure = {
    error: AptosError;
    /**
     * The index of which transaction failed, same as submission order
     */
    transaction_index: number;
};

/**
 * Batch transaction submission result
 *
 * Tells which transactions failed
 */
type TransactionsBatchSubmissionResult = {
    /**
     * Summary of the failed transactions
     */
    transaction_failures: Array<TransactionsBatchSingleSubmissionFailure>;
};

/**
 * An event from a transaction with a version
 */
type VersionedEvent = {
    version: U64;
    guid: EventGuid;
    sequence_number: U64;
    type: MoveType;
    /**
     * The JSON representation of the event
     */
    data: any;
};

/**
 * View request for the Move View Function API
 */
type ViewRequest = {
    function: EntryFunctionId;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

type index$2_AccountData = AccountData;
type index$2_AccountSignature = AccountSignature;
type index$2_AccountSignature_Ed25519Signature = AccountSignature_Ed25519Signature;
type index$2_AccountSignature_MultiEd25519Signature = AccountSignature_MultiEd25519Signature;
type index$2_AccountSignature_MultiKeySignature = AccountSignature_MultiKeySignature;
type index$2_AccountSignature_SingleKeySignature = AccountSignature_SingleKeySignature;
type index$2_Address = Address;
type index$2_AptosError = AptosError;
type index$2_AptosErrorCode = AptosErrorCode;
declare const index$2_AptosErrorCode: typeof AptosErrorCode;
type index$2_Block = Block;
type index$2_BlockEndInfo = BlockEndInfo;
type index$2_BlockEpilogueTransaction = BlockEpilogueTransaction;
type index$2_BlockMetadataTransaction = BlockMetadataTransaction;
type index$2_DecodedTableData = DecodedTableData;
type index$2_DeleteModule = DeleteModule;
type index$2_DeleteResource = DeleteResource;
type index$2_DeleteTableItem = DeleteTableItem;
type index$2_DeletedTableData = DeletedTableData;
type index$2_DeprecatedModuleBundlePayload = DeprecatedModuleBundlePayload;
type index$2_DirectWriteSet = DirectWriteSet;
type index$2_Ed25519 = Ed25519;
type index$2_EncodeSubmissionRequest = EncodeSubmissionRequest;
type index$2_EntryFunctionId = EntryFunctionId;
type index$2_EntryFunctionPayload = EntryFunctionPayload;
type index$2_Event = Event;
type index$2_EventGuid = EventGuid;
type index$2_FeePayerSignature = FeePayerSignature;
type index$2_GasEstimation = GasEstimation;
type index$2_GenesisPayload = GenesisPayload;
type index$2_GenesisPayload_WriteSetPayload = GenesisPayload_WriteSetPayload;
type index$2_GenesisTransaction = GenesisTransaction;
type index$2_HashValue = HashValue;
type index$2_HealthCheckSuccess = HealthCheckSuccess;
type index$2_HexEncodedBytes = HexEncodedBytes;
type index$2_IdentifierWrapper = IdentifierWrapper;
type index$2_IndexResponse = IndexResponse;
type index$2_IndexedSignature = IndexedSignature;
type index$2_Keyless = Keyless;
type index$2_MoveAbility = MoveAbility;
type index$2_MoveFunction = MoveFunction;
type index$2_MoveFunctionGenericTypeParam = MoveFunctionGenericTypeParam;
type index$2_MoveFunctionVisibility = MoveFunctionVisibility;
declare const index$2_MoveFunctionVisibility: typeof MoveFunctionVisibility;
type index$2_MoveModule = MoveModule;
type index$2_MoveModuleBytecode = MoveModuleBytecode;
type index$2_MoveModuleId = MoveModuleId;
type index$2_MoveResource = MoveResource;
type index$2_MoveScriptBytecode = MoveScriptBytecode;
type index$2_MoveStruct = MoveStruct;
type index$2_MoveStructField = MoveStructField;
type index$2_MoveStructGenericTypeParam = MoveStructGenericTypeParam;
type index$2_MoveStructTag = MoveStructTag;
type index$2_MoveStructValue = MoveStructValue;
type index$2_MoveType = MoveType;
type index$2_MoveValue = MoveValue;
type index$2_MultiAgentSignature = MultiAgentSignature;
type index$2_MultiKeySignature = MultiKeySignature;
type index$2_MultisigPayload = MultisigPayload;
type index$2_MultisigTransactionPayload = MultisigTransactionPayload;
type index$2_MultisigTransactionPayload_EntryFunctionPayload = MultisigTransactionPayload_EntryFunctionPayload;
type index$2_PendingTransaction = PendingTransaction;
type index$2_PublicKey = PublicKey;
type index$2_PublicKey_Ed25519 = PublicKey_Ed25519;
type index$2_PublicKey_Keyless = PublicKey_Keyless;
type index$2_PublicKey_Secp256k1Ecdsa = PublicKey_Secp256k1Ecdsa;
type index$2_PublicKey_Secp256r1Ecdsa = PublicKey_Secp256r1Ecdsa;
type index$2_RawTableItemRequest = RawTableItemRequest;
type index$2_RoleType = RoleType;
declare const index$2_RoleType: typeof RoleType;
type index$2_ScriptPayload = ScriptPayload;
type index$2_ScriptWriteSet = ScriptWriteSet;
type index$2_Secp256k1Ecdsa = Secp256k1Ecdsa;
type index$2_Secp256r1Ecdsa = Secp256r1Ecdsa;
type index$2_Signature = Signature;
type index$2_Signature_Ed25519 = Signature_Ed25519;
type index$2_Signature_Keyless = Signature_Keyless;
type index$2_Signature_Secp256k1Ecdsa = Signature_Secp256k1Ecdsa;
type index$2_Signature_WebAuthn = Signature_WebAuthn;
type index$2_SingleKeySignature = SingleKeySignature;
type index$2_StateCheckpointTransaction = StateCheckpointTransaction;
type index$2_StateKeyWrapper = StateKeyWrapper;
type index$2_SubmitTransactionRequest = SubmitTransactionRequest;
type index$2_TableItemRequest = TableItemRequest;
type index$2_TransactionPayload_DeprecatedModuleBundlePayload = TransactionPayload_DeprecatedModuleBundlePayload;
type index$2_TransactionPayload_EntryFunctionPayload = TransactionPayload_EntryFunctionPayload;
type index$2_TransactionPayload_MultisigPayload = TransactionPayload_MultisigPayload;
type index$2_TransactionPayload_ScriptPayload = TransactionPayload_ScriptPayload;
type index$2_TransactionSignature = TransactionSignature;
type index$2_TransactionSignature_AccountSignature = TransactionSignature_AccountSignature;
type index$2_TransactionSignature_Ed25519Signature = TransactionSignature_Ed25519Signature;
type index$2_TransactionSignature_FeePayerSignature = TransactionSignature_FeePayerSignature;
type index$2_TransactionSignature_MultiAgentSignature = TransactionSignature_MultiAgentSignature;
type index$2_TransactionSignature_MultiEd25519Signature = TransactionSignature_MultiEd25519Signature;
type index$2_Transaction_BlockEpilogueTransaction = Transaction_BlockEpilogueTransaction;
type index$2_Transaction_BlockMetadataTransaction = Transaction_BlockMetadataTransaction;
type index$2_Transaction_GenesisTransaction = Transaction_GenesisTransaction;
type index$2_Transaction_PendingTransaction = Transaction_PendingTransaction;
type index$2_Transaction_StateCheckpointTransaction = Transaction_StateCheckpointTransaction;
type index$2_Transaction_UserTransaction = Transaction_UserTransaction;
type index$2_Transaction_ValidatorTransaction = Transaction_ValidatorTransaction;
type index$2_TransactionsBatchSingleSubmissionFailure = TransactionsBatchSingleSubmissionFailure;
type index$2_TransactionsBatchSubmissionResult = TransactionsBatchSubmissionResult;
type index$2_U128 = U128;
type index$2_U256 = U256;
type index$2_U64 = U64;
type index$2_ValidatorTransaction = ValidatorTransaction;
type index$2_VersionedEvent = VersionedEvent;
type index$2_ViewRequest = ViewRequest;
type index$2_WebAuthn = WebAuthn;
type index$2_WriteModule = WriteModule;
type index$2_WriteResource = WriteResource;
type index$2_WriteSetChange = WriteSetChange;
type index$2_WriteSetChange_DeleteModule = WriteSetChange_DeleteModule;
type index$2_WriteSetChange_DeleteResource = WriteSetChange_DeleteResource;
type index$2_WriteSetChange_DeleteTableItem = WriteSetChange_DeleteTableItem;
type index$2_WriteSetChange_WriteModule = WriteSetChange_WriteModule;
type index$2_WriteSetChange_WriteResource = WriteSetChange_WriteResource;
type index$2_WriteSetChange_WriteTableItem = WriteSetChange_WriteTableItem;
type index$2_WriteSetPayload = WriteSetPayload;
type index$2_WriteSet_DirectWriteSet = WriteSet_DirectWriteSet;
type index$2_WriteSet_ScriptWriteSet = WriteSet_ScriptWriteSet;
type index$2_WriteTableItem = WriteTableItem;
declare namespace index$2 {
  export { type index$2_AccountData as AccountData, type index$2_AccountSignature as AccountSignature, type index$2_AccountSignature_Ed25519Signature as AccountSignature_Ed25519Signature, type index$2_AccountSignature_MultiEd25519Signature as AccountSignature_MultiEd25519Signature, type index$2_AccountSignature_MultiKeySignature as AccountSignature_MultiKeySignature, type index$2_AccountSignature_SingleKeySignature as AccountSignature_SingleKeySignature, type index$2_Address as Address, type index$2_AptosError as AptosError, index$2_AptosErrorCode as AptosErrorCode, type index$2_Block as Block, type index$2_BlockEndInfo as BlockEndInfo, type index$2_BlockEpilogueTransaction as BlockEpilogueTransaction, type index$2_BlockMetadataTransaction as BlockMetadataTransaction, type index$2_DecodedTableData as DecodedTableData, type index$2_DeleteModule as DeleteModule, type index$2_DeleteResource as DeleteResource, type index$2_DeleteTableItem as DeleteTableItem, type index$2_DeletedTableData as DeletedTableData, type index$2_DeprecatedModuleBundlePayload as DeprecatedModuleBundlePayload, type index$2_DirectWriteSet as DirectWriteSet, type index$2_Ed25519 as Ed25519, type Ed25519Signature$1 as Ed25519Signature, type index$2_EncodeSubmissionRequest as EncodeSubmissionRequest, type index$2_EntryFunctionId as EntryFunctionId, type index$2_EntryFunctionPayload as EntryFunctionPayload, type index$2_Event as Event, type index$2_EventGuid as EventGuid, type index$2_FeePayerSignature as FeePayerSignature, type index$2_GasEstimation as GasEstimation, type index$2_GenesisPayload as GenesisPayload, type index$2_GenesisPayload_WriteSetPayload as GenesisPayload_WriteSetPayload, type index$2_GenesisTransaction as GenesisTransaction, type index$2_HashValue as HashValue, type index$2_HealthCheckSuccess as HealthCheckSuccess, type index$2_HexEncodedBytes as HexEncodedBytes, type index$2_IdentifierWrapper as IdentifierWrapper, type index$2_IndexResponse as IndexResponse, type index$2_IndexedSignature as IndexedSignature, type index$2_Keyless as Keyless, type index$2_MoveAbility as MoveAbility, type index$2_MoveFunction as MoveFunction, type index$2_MoveFunctionGenericTypeParam as MoveFunctionGenericTypeParam, index$2_MoveFunctionVisibility as MoveFunctionVisibility, type index$2_MoveModule as MoveModule, type index$2_MoveModuleBytecode as MoveModuleBytecode, type index$2_MoveModuleId as MoveModuleId, type index$2_MoveResource as MoveResource, type index$2_MoveScriptBytecode as MoveScriptBytecode, type index$2_MoveStruct as MoveStruct, type index$2_MoveStructField as MoveStructField, type index$2_MoveStructGenericTypeParam as MoveStructGenericTypeParam, type index$2_MoveStructTag as MoveStructTag, type index$2_MoveStructValue as MoveStructValue, type index$2_MoveType as MoveType, type index$2_MoveValue as MoveValue, type index$2_MultiAgentSignature as MultiAgentSignature, type MultiEd25519Signature$1 as MultiEd25519Signature, type index$2_MultiKeySignature as MultiKeySignature, type index$2_MultisigPayload as MultisigPayload, type index$2_MultisigTransactionPayload as MultisigTransactionPayload, type index$2_MultisigTransactionPayload_EntryFunctionPayload as MultisigTransactionPayload_EntryFunctionPayload, type index$2_PendingTransaction as PendingTransaction, type index$2_PublicKey as PublicKey, type index$2_PublicKey_Ed25519 as PublicKey_Ed25519, type index$2_PublicKey_Keyless as PublicKey_Keyless, type index$2_PublicKey_Secp256k1Ecdsa as PublicKey_Secp256k1Ecdsa, type index$2_PublicKey_Secp256r1Ecdsa as PublicKey_Secp256r1Ecdsa, type index$2_RawTableItemRequest as RawTableItemRequest, index$2_RoleType as RoleType, type index$2_ScriptPayload as ScriptPayload, type index$2_ScriptWriteSet as ScriptWriteSet, type index$2_Secp256k1Ecdsa as Secp256k1Ecdsa, type index$2_Secp256r1Ecdsa as Secp256r1Ecdsa, type index$2_Signature as Signature, type index$2_Signature_Ed25519 as Signature_Ed25519, type index$2_Signature_Keyless as Signature_Keyless, type index$2_Signature_Secp256k1Ecdsa as Signature_Secp256k1Ecdsa, type index$2_Signature_WebAuthn as Signature_WebAuthn, type index$2_SingleKeySignature as SingleKeySignature, type index$2_StateCheckpointTransaction as StateCheckpointTransaction, type index$2_StateKeyWrapper as StateKeyWrapper, type index$2_SubmitTransactionRequest as SubmitTransactionRequest, type index$2_TableItemRequest as TableItemRequest, type Transaction$1 as Transaction, type TransactionPayload$1 as TransactionPayload, type index$2_TransactionPayload_DeprecatedModuleBundlePayload as TransactionPayload_DeprecatedModuleBundlePayload, type index$2_TransactionPayload_EntryFunctionPayload as TransactionPayload_EntryFunctionPayload, type index$2_TransactionPayload_MultisigPayload as TransactionPayload_MultisigPayload, type index$2_TransactionPayload_ScriptPayload as TransactionPayload_ScriptPayload, type index$2_TransactionSignature as TransactionSignature, type index$2_TransactionSignature_AccountSignature as TransactionSignature_AccountSignature, type index$2_TransactionSignature_Ed25519Signature as TransactionSignature_Ed25519Signature, type index$2_TransactionSignature_FeePayerSignature as TransactionSignature_FeePayerSignature, type index$2_TransactionSignature_MultiAgentSignature as TransactionSignature_MultiAgentSignature, type index$2_TransactionSignature_MultiEd25519Signature as TransactionSignature_MultiEd25519Signature, type index$2_Transaction_BlockEpilogueTransaction as Transaction_BlockEpilogueTransaction, type index$2_Transaction_BlockMetadataTransaction as Transaction_BlockMetadataTransaction, type index$2_Transaction_GenesisTransaction as Transaction_GenesisTransaction, type index$2_Transaction_PendingTransaction as Transaction_PendingTransaction, type index$2_Transaction_StateCheckpointTransaction as Transaction_StateCheckpointTransaction, type index$2_Transaction_UserTransaction as Transaction_UserTransaction, type index$2_Transaction_ValidatorTransaction as Transaction_ValidatorTransaction, type index$2_TransactionsBatchSingleSubmissionFailure as TransactionsBatchSingleSubmissionFailure, type index$2_TransactionsBatchSubmissionResult as TransactionsBatchSubmissionResult, type index$2_U128 as U128, type index$2_U256 as U256, type index$2_U64 as U64, type UserTransaction$1 as UserTransaction, type index$2_ValidatorTransaction as ValidatorTransaction, type index$2_VersionedEvent as VersionedEvent, type index$2_ViewRequest as ViewRequest, type index$2_WebAuthn as WebAuthn, type index$2_WriteModule as WriteModule, type index$2_WriteResource as WriteResource, type WriteSet$1 as WriteSet, type index$2_WriteSetChange as WriteSetChange, type index$2_WriteSetChange_DeleteModule as WriteSetChange_DeleteModule, type index$2_WriteSetChange_DeleteResource as WriteSetChange_DeleteResource, type index$2_WriteSetChange_DeleteTableItem as WriteSetChange_DeleteTableItem, type index$2_WriteSetChange_WriteModule as WriteSetChange_WriteModule, type index$2_WriteSetChange_WriteResource as WriteSetChange_WriteResource, type index$2_WriteSetChange_WriteTableItem as WriteSetChange_WriteTableItem, type index$2_WriteSetPayload as WriteSetPayload, type index$2_WriteSet_DirectWriteSet as WriteSet_DirectWriteSet, type index$2_WriteSet_ScriptWriteSet as WriteSet_ScriptWriteSet, type index$2_WriteTableItem as WriteTableItem };
}

type MaybeHexString = HexString | string | HexEncodedBytes;
/**
 * A util class for working with hex strings.
 * Hex strings are strings that are prefixed with `0x`
 */
declare class HexString {
    private readonly hexString;
    /**
     * Creates new hex string from Buffer
     * @param buffer A buffer to convert
     * @returns New HexString
     */
    static fromBuffer(buffer: Uint8Array): HexString;
    /**
     * Creates new hex string from Uint8Array
     * @param arr Uint8Array to convert
     * @returns New HexString
     */
    static fromUint8Array(arr: Uint8Array): HexString;
    /**
     * Ensures `hexString` is instance of `HexString` class
     * @param hexString String to check
     * @returns New HexString if `hexString` is regular string or `hexString` if it is HexString instance
     * @example
     * ```
     *  const regularString = "string";
     *  const hexString = new HexString("string"); // "0xstring"
     *  HexString.ensure(regularString); // "0xstring"
     *  HexString.ensure(hexString); // "0xstring"
     * ```
     */
    static ensure(hexString: MaybeHexString): HexString;
    /**
     * Creates new HexString instance from regular string. If specified string already starts with "0x" prefix,
     * it will not add another one
     * @param hexString String to convert
     * @example
     * ```
     *  const string = "string";
     *  new HexString(string); // "0xstring"
     * ```
     */
    constructor(hexString: string | HexEncodedBytes);
    /**
     * Getter for inner hexString
     * @returns Inner hex string
     */
    hex(): string;
    /**
     * Getter for inner hexString without prefix
     * @returns Inner hex string without prefix
     * @example
     * ```
     *  const hexString = new HexString("string"); // "0xstring"
     *  hexString.noPrefix(); // "string"
     * ```
     */
    noPrefix(): string;
    /**
     * Overrides default `toString` method
     * @returns Inner hex string
     */
    toString(): string;
    /**
     * Trimmes extra zeroes in the begining of a string
     * @returns Inner hexString without leading zeroes
     * @example
     * ```
     *  new HexString("0x000000string").toShortString(); // result = "0xstring"
     * ```
     */
    toShortString(): string;
    /**
     * Converts hex string to a Uint8Array
     * @returns Uint8Array from inner hexString without prefix
     */
    toUint8Array(): Uint8Array;
}

interface SupraAccountObject {
    address?: HexEncodedBytes;
    publicKeyHex?: HexEncodedBytes;
    privateKeyHex: HexEncodedBytes;
}
/**
 * Class for creating and managing Supra account
 */
declare class SupraAccount {
    /**
     * A private key and public key, associated with the given account
     */
    readonly signingKey: nacl.SignKeyPair;
    /**
     * Address associated with the given account
     */
    private readonly accountAddress;
    static fromSupraAccountObject(obj: SupraAccountObject): SupraAccount;
    /**
     * Check's if the derive path is valid
     */
    static isValidPath(path: string): boolean;
    /**
     * Creates new account with bip44 path and mnemonics,
     * @param path. (e.g. m/44'/637'/0'/0'/0')
     * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
     * @param mnemonics.
     * @returns SupraAccount
     */
    static fromDerivePath(path: string, mnemonics: string): SupraAccount;
    /**
     * Creates new account instance. Constructor allows passing in an address,
     * to handle account key rotation, where auth_key != public_key
     * @param privateKeyBytes  Private key from which account key pair will be generated.
     * If not specified, new key pair is going to be created.
     * @param address Account address (e.g. 0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591).
     * If not specified, a new one will be generated from public key
     */
    constructor(privateKeyBytes?: Uint8Array | undefined, address?: MaybeHexString);
    /**
     * This is the key by which Supra account is referenced.
     * It is the 32-byte of the SHA-3 256 cryptographic hash
     * of the public key(s) concatenated with a signature scheme identifier byte
     * @returns Address associated with the given account
     */
    address(): HexString;
    /**
     * This key enables account owners to rotate their private key(s)
     * associated with the account without changing the address that hosts their account.
     * @returns Authentication key for the associated account
     */
    authKey(): HexString;
    /**
     * Takes source address and seeds and returns the resource account address
     * @param sourceAddress Address used to derive the resource account
     * @param seed The seed bytes
     * @returns The resource account address
     */
    static getResourceAccountAddress(sourceAddress: MaybeHexString, seed: Uint8Array): HexString;
    /**
     * Takes creator address and collection name and returns the collection id hash.
     * Collection id hash are generated as sha256 hash of (`creator_address::collection_name`)
     *
     * @param creatorAddress Collection creator address
     * @param collectionName The collection name
     * @returns The collection id hash
     */
    static getCollectionID(creatorAddress: MaybeHexString, collectionName: string): HexString;
    /**
     * This key is generated with Ed25519 scheme.
     * Public key is used to check a signature of transaction, signed by given account
     * @returns The public key for the associated account
     */
    pubKey(): HexString;
    /**
     * Signs specified `buffer` with account's private key
     * @param buffer A buffer to sign
     * @returns A signature HexString
     */
    signBuffer(buffer: Uint8Array): HexString;
    /**
     * Signs specified `hexString` with account's private key
     * @param hexString A regular string or HexString to sign
     * @returns A signature HexString
     */
    signHexString(hexString: MaybeHexString): HexString;
    /**
     * Verifies the signature of the message with the public key of the account
     * @param message a signed message
     * @param signature the signature of the message
     */
    verifySignature(message: MaybeHexString, signature: MaybeHexString): boolean;
    /**
     * Derives account address, public key and private key
     * @returns SupraAccountObject instance.
     * @example An example of the returned SupraAccountObject object
     * ```
     * {
     *    address: "0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591",
     *    publicKeyHex: "0xf56d8524faf79fbc0f48c13aeed3b0ce5dd376b4db93b8130a107c0a5e04ba04",
     *    privateKeyHex: `0x009c9f7c992a06cfafe916f125d8adb7a395fca243e264a8e56a4b3e6accf940
     *      d2b11e9ece3049ce60e3c7b4a1c58aebfa9298e29a30a58a67f1998646135204`
     * }
     * ```
     */
    toPrivateKeyObject(): SupraAccountObject;
}
declare function getAddressFromAccountOrAddress(accountOrAddress: SupraAccount | MaybeHexString): HexString;

type Seq<T> = T[];
type Uint8 = number;
type Uint16 = number;
type Uint32 = number;
type Uint64 = bigint;
type Uint128 = bigint;
type Uint256 = bigint;
type AnyNumber = bigint | number;
type Bytes = Uint8Array;

declare class Serializer {
    private buffer;
    private offset;
    constructor();
    private ensureBufferWillHandleSize;
    protected serialize(values: Bytes): void;
    private serializeWithFunction;
    /**
     * Serializes a string. UTF8 string is supported. Serializes the string's bytes length "l" first,
     * and then serializes "l" bytes of the string content.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeStr("çå∞≠¢õß∂ƒ∫");
     * assert(serializer.getBytes() === new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * ```
     */
    serializeStr(value: string): void;
    /**
     * Serializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    serializeBytes(value: Bytes): void;
    /**
     * Serializes an array of bytes with known length. Therefore length doesn't need to be
     * serialized to help deserialization.  When deserializing, the number of
     * bytes to deserialize needs to be passed in.
     */
    serializeFixedBytes(value: Bytes): void;
    /**
     * Serializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    serializeBool(value: boolean): void;
    /**
     * Serializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    serializeU8(value: Uint8): void;
    /**
     * Serializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU16(4660);
     * assert(serializer.getBytes() === new Uint8Array([0x34, 0x12]));
     * ```
     */
    serializeU16(value: Uint16): void;
    /**
     * Serializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU32(305419896);
     * assert(serializer.getBytes() === new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU32(value: Uint32): void;
    /**
     * Serializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU64(1311768467750121216);
     * assert(serializer.getBytes() === new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU64(value: AnyNumber): void;
    /**
     * Serializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU128(value: AnyNumber): void;
    /**
     * Serializes a uint256 number.
     *
     * BCS layout for "uint256": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU256(value: AnyNumber): void;
    /**
     * Serializes a uint32 number with uleb128.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    serializeU32AsUleb128(val: Uint32): void;
    /**
     * Returns the buffered bytes
     */
    getBytes(): Bytes;
}

declare class Deserializer {
    private buffer;
    private offset;
    constructor(data: Bytes);
    private read;
    /**
     * Deserializes a string. UTF8 string is supported. Reads the string's bytes length "l" first,
     * and then reads "l" bytes of content. Decodes the byte array into a string.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * assert(deserializer.deserializeStr() === "çå∞≠¢õß∂ƒ∫");
     * ```
     */
    deserializeStr(): string;
    /**
     * Deserializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    deserializeBytes(): Bytes;
    /**
     * Deserializes an array of bytes. The number of bytes to read is already known.
     *
     */
    deserializeFixedBytes(len: number): Bytes;
    /**
     * Deserializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    deserializeBool(): boolean;
    /**
     * Deserializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    deserializeU8(): Uint8;
    /**
     * Deserializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x34, 0x12]));
     * assert(deserializer.deserializeU16() === 4660);
     * ```
     */
    deserializeU16(): Uint16;
    /**
     * Deserializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU32() === 305419896);
     * ```
     */
    deserializeU32(): Uint32;
    /**
     * Deserializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU64() === 1311768467750121216);
     * ```
     */
    deserializeU64(): Uint64;
    /**
     * Deserializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    deserializeU128(): Uint128;
    /**
     * Deserializes a uint256 number.
     *
     * BCS layout for "uint256": Thirty-two bytes. Binary format in little-endian representation.
     */
    deserializeU256(): Uint256;
    /**
     * Deserializes a uleb128 encoded uint32 number.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    deserializeUleb128AsU32(): Uint32;
}

interface Serializable {
    serialize(serializer: Serializer): void;
}
/**
 * Serializes a vector values that are "Serializable".
 */
declare function serializeVector<T extends Serializable>(value: Seq<T>, serializer: Serializer): void;
/**
 * Serializes a vector of bytes.
 */
declare function serializeVectorOfBytes(value: Seq<Bytes>, serializer: Serializer): void;
/**
 * Serializes a vector with specified item serialization function.
 * Very dynamic function and bypasses static typechecking.
 */
declare function serializeVectorWithFunc(value: any[], func: string): Bytes;
/**
 * Deserializes a vector of values.
 */
declare function deserializeVector(deserializer: Deserializer, cls: any): any[];
/**
 * Deserializes a vector of bytes.
 */
declare function deserializeVectorOfBytes(deserializer: Deserializer): Bytes[];
declare function bcsToBytes<T extends Serializable>(value: T): Bytes;
declare function bcsSerializeUint64(value: AnyNumber): Bytes;
declare function bcsSerializeU8(value: Uint8): Bytes;
declare function bcsSerializeU16(value: Uint16): Bytes;
declare function bcsSerializeU32(value: Uint32): Bytes;
declare function bcsSerializeU128(value: AnyNumber): Bytes;
declare function bcsSerializeU256(value: AnyNumber): Bytes;
declare function bcsSerializeBool(value: boolean): Bytes;
declare function bcsSerializeStr(value: string): Bytes;
declare function bcsSerializeBytes(value: Bytes): Bytes;
declare function bcsSerializeFixedBytes(value: Bytes): Bytes;

type index$1_AnyNumber = AnyNumber;
type index$1_Bytes = Bytes;
type index$1_Deserializer = Deserializer;
declare const index$1_Deserializer: typeof Deserializer;
type index$1_Seq<T> = Seq<T>;
type index$1_Serializer = Serializer;
declare const index$1_Serializer: typeof Serializer;
type index$1_Uint128 = Uint128;
type index$1_Uint16 = Uint16;
type index$1_Uint256 = Uint256;
type index$1_Uint32 = Uint32;
type index$1_Uint64 = Uint64;
type index$1_Uint8 = Uint8;
declare const index$1_bcsSerializeBool: typeof bcsSerializeBool;
declare const index$1_bcsSerializeBytes: typeof bcsSerializeBytes;
declare const index$1_bcsSerializeFixedBytes: typeof bcsSerializeFixedBytes;
declare const index$1_bcsSerializeStr: typeof bcsSerializeStr;
declare const index$1_bcsSerializeU128: typeof bcsSerializeU128;
declare const index$1_bcsSerializeU16: typeof bcsSerializeU16;
declare const index$1_bcsSerializeU256: typeof bcsSerializeU256;
declare const index$1_bcsSerializeU32: typeof bcsSerializeU32;
declare const index$1_bcsSerializeU8: typeof bcsSerializeU8;
declare const index$1_bcsSerializeUint64: typeof bcsSerializeUint64;
declare const index$1_bcsToBytes: typeof bcsToBytes;
declare const index$1_deserializeVector: typeof deserializeVector;
declare const index$1_deserializeVectorOfBytes: typeof deserializeVectorOfBytes;
declare const index$1_serializeVector: typeof serializeVector;
declare const index$1_serializeVectorOfBytes: typeof serializeVectorOfBytes;
declare const index$1_serializeVectorWithFunc: typeof serializeVectorWithFunc;
declare namespace index$1 {
  export { type index$1_AnyNumber as AnyNumber, type index$1_Bytes as Bytes, index$1_Deserializer as Deserializer, type index$1_Seq as Seq, index$1_Serializer as Serializer, type index$1_Uint128 as Uint128, type index$1_Uint16 as Uint16, type index$1_Uint256 as Uint256, type index$1_Uint32 as Uint32, type index$1_Uint64 as Uint64, type index$1_Uint8 as Uint8, index$1_bcsSerializeBool as bcsSerializeBool, index$1_bcsSerializeBytes as bcsSerializeBytes, index$1_bcsSerializeFixedBytes as bcsSerializeFixedBytes, index$1_bcsSerializeStr as bcsSerializeStr, index$1_bcsSerializeU128 as bcsSerializeU128, index$1_bcsSerializeU16 as bcsSerializeU16, index$1_bcsSerializeU256 as bcsSerializeU256, index$1_bcsSerializeU32 as bcsSerializeU32, index$1_bcsSerializeU8 as bcsSerializeU8, index$1_bcsSerializeUint64 as bcsSerializeUint64, index$1_bcsToBytes as bcsToBytes, index$1_deserializeVector as deserializeVector, index$1_deserializeVectorOfBytes as deserializeVectorOfBytes, index$1_serializeVector as serializeVector, index$1_serializeVectorOfBytes as serializeVectorOfBytes, index$1_serializeVectorWithFunc as serializeVectorWithFunc };
}

/**
 * Exported as TransactionBuilderTypes.AccountAddress
 */
declare class AccountAddress {
    static readonly LENGTH: number;
    readonly address: Bytes;
    static CORE_CODE_ADDRESS: AccountAddress;
    constructor(address: Bytes);
    /**
     * Creates AccountAddress from a hex string.
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static fromHex(addr: MaybeHexString): AccountAddress;
    /**
     * Checks if the string is a valid AccountAddress
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static isValid(addr: MaybeHexString): boolean;
    /**
     * Return a hex string from account Address.
     */
    toHexString(): MaybeHexString;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAddress;
    /**
     * Standardizes an address to the format "0x" followed by 64 lowercase hexadecimal digits.
     */
    static standardizeAddress(address: string): string;
}

declare class Ed25519PublicKey {
    static readonly LENGTH: number;
    readonly value: Bytes;
    constructor(value: Bytes);
    toBytes(): Bytes;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519PublicKey;
}
declare class Ed25519Signature {
    readonly value: Bytes;
    static readonly LENGTH = 64;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519Signature;
}

declare class MultiEd25519PublicKey {
    readonly public_keys: Seq<Ed25519PublicKey>;
    readonly threshold: Uint8;
    /**
     * Public key for a K-of-N multisig transaction. A K-of-N multisig transaction means that for such a
     * transaction to be executed, at least K out of the N authorized signers have signed the transaction
     * and passed the check conducted by the chain.
     *
     *
     * @param public_keys A list of public keys
     * @param threshold At least "threshold" signatures must be valid
     */
    constructor(public_keys: Seq<Ed25519PublicKey>, threshold: Uint8);
    /**
     * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
     */
    toBytes(): Bytes;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519PublicKey;
}
declare class MultiEd25519Signature {
    readonly signatures: Seq<Ed25519Signature>;
    readonly bitmap: Uint8Array;
    static BITMAP_LEN: Uint8;
    /**
     * Signature for a K-of-N multisig transaction.
     *
     *
     * @param signatures A list of ed25519 signatures
     * @param bitmap 4 bytes, at most 32 signatures are supported. If Nth bit value is `1`, the Nth
     * signature should be provided in `signatures`. Bits are read from left to right
     */
    constructor(signatures: Seq<Ed25519Signature>, bitmap: Uint8Array);
    /**
     * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
     */
    toBytes(): Bytes;
    /**
     * Helper method to create a bitmap out of the specified bit positions
     * @param bits The bitmap positions that should be set. A position starts at index 0.
     * Valid position should range between 0 and 31.
     * @example
     * Here's an example of valid `bits`
     * ```
     * [0, 2, 31]
     * ```
     * `[0, 2, 31]` means the 1st, 3rd and 32nd bits should be set in the bitmap.
     * The result bitmap should be 0b1010000000000000000000000000001
     *
     * @returns bitmap that is 32bit long
     */
    static createBitmap(bits: Seq<Uint8>): Uint8Array;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519Signature;
}

declare abstract class TransactionAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionAuthenticator;
}
declare class TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    /**
     * An authenticator for single signature.
     *
     * @param public_key Client's public key.
     * @param signature Signature of a raw transaction.
     * for details about generating a signature.
     */
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorEd25519;
}
declare class TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    /**
     * An authenticator for multiple signatures.
     *
     * @param public_key
     * @param signature
     *
     */
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiEd25519;
}
declare class TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly secondary_signers: Seq<AccountAuthenticator>;
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Seq<AccountAddress>, secondary_signers: Seq<AccountAuthenticator>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
declare class TransactionAuthenticatorFeePayer extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly secondary_signers: Seq<AccountAuthenticator>;
    readonly fee_payer: {
        address: AccountAddress;
        authenticator: AccountAuthenticator;
    };
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Seq<AccountAddress>, secondary_signers: Seq<AccountAuthenticator>, fee_payer: {
        address: AccountAddress;
        authenticator: AccountAuthenticator;
    });
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
declare abstract class AccountAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAuthenticator;
}
declare class AccountAuthenticatorEd25519 extends AccountAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorEd25519;
}
declare class AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorMultiEd25519;
}

declare class Identifier {
    value: string;
    constructor(value: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Identifier;
}

declare abstract class TypeTag {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeTag;
}
declare class TypeTagBool extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagBool;
}
declare class TypeTagU8 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU8;
}
declare class TypeTagU16 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU16;
}
declare class TypeTagU32 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU32;
}
declare class TypeTagU64 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU64;
}
declare class TypeTagU128 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU128;
}
declare class TypeTagU256 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU256;
}
declare class TypeTagAddress extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagAddress;
}
declare class TypeTagSigner extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagSigner;
}
declare class TypeTagVector extends TypeTag {
    readonly value: TypeTag;
    constructor(value: TypeTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagVector;
}
declare class TypeTagStruct extends TypeTag {
    readonly value: StructTag;
    constructor(value: StructTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagStruct;
    isStringTypeTag(): boolean;
}
declare class StructTag {
    readonly address: AccountAddress;
    readonly module_name: Identifier;
    readonly name: Identifier;
    readonly type_args: Seq<TypeTag>;
    constructor(address: AccountAddress, module_name: Identifier, name: Identifier, type_args: Seq<TypeTag>);
    /**
     * Converts a string literal to a StructTag
     * @param structTag String literal in format "AccountAddress::module_name::ResourceName",
     *   e.g. "0x1::supra_coin::SupraCoin"
     * @returns
     */
    static fromString(structTag: string): StructTag;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): StructTag;
}
declare const stringStructTag: StructTag;
declare function optionStructTag(typeArg: TypeTag): StructTag;
declare function objectStructTag(typeArg: TypeTag): StructTag;
/**
 * Parser to parse a type tag string
 */
declare class TypeTagParser {
    private readonly tokens;
    private readonly typeTags;
    constructor(tagStr: string, typeTags?: string[]);
    private consume;
    /**
     * Consumes all of an unused generic field, mostly applicable to object
     *
     * Note: This is recursive.  it can be problematic if there's bad input
     * @private
     */
    private consumeWholeGeneric;
    private parseCommaList;
    parseTypeTag(): TypeTag;
}
declare class TypeTagParserError extends Error {
    constructor(message: string);
}

declare class RawTransaction {
    readonly sender: AccountAddress;
    readonly sequence_number: Uint64;
    readonly payload: TransactionPayload;
    readonly max_gas_amount: Uint64;
    readonly gas_unit_price: Uint64;
    readonly expiration_timestamp_secs: Uint64;
    readonly chain_id: ChainId;
    /**
     * RawTransactions contain the metadata and payloads that can be submitted to Supra chain for execution.
     * RawTransactions must be signed before Supra chain can execute them.
     *
     * @param sender Account address of the sender.
     * @param sequence_number Sequence number of this transaction. This must match the sequence number stored in
     *   the sender's account at the time the transaction executes.
     * @param payload Instructions for the Supra Blockchain, including publishing a module,
     *   execute a entry function or execute a script payload.
     * @param max_gas_amount Maximum total gas to spend for this transaction. The account must have more
     *   than this gas or the transaction will be discarded during validation.
     * @param gas_unit_price Price to be paid per gas unit.
     * @param expiration_timestamp_secs The blockchain timestamp at which the blockchain would discard this transaction.
     * @param chain_id The chain ID of the blockchain that this transaction is intended to be run on.
     */
    constructor(sender: AccountAddress, sequence_number: Uint64, payload: TransactionPayload, max_gas_amount: Uint64, gas_unit_price: Uint64, expiration_timestamp_secs: Uint64, chain_id: ChainId);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransaction;
}
declare class Script {
    readonly code: Bytes;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<TransactionArgument>;
    /**
     * Scripts contain the Move bytecodes payload that can be submitted to Supra chain for execution.
     * @param code Move bytecode
     * @param ty_args Type arguments that bytecode requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to bytecode function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(code: Bytes, ty_args: Seq<TypeTag>, args: Seq<TransactionArgument>);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Script;
}
declare class EntryFunction {
    readonly module_name: ModuleId;
    readonly function_name: Identifier;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<Bytes>;
    /**
     * Contains the payload to run a function within a module.
     * @param module_name Fully qualified module name. ModuleId consists of account address and module name.
     * @param function_name The function to run.
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(module_name: ModuleId, function_name: Identifier, ty_args: Seq<TypeTag>, args: Seq<Bytes>);
    /**
     *
     * @param module Fully qualified module name in format "AccountAddress::module_name" e.g. "0x1::coin"
     * @param func Function name
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @returns
     */
    static natural(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    /**
     * `natual` is deprecated, please use `natural`
     *
     * @deprecated.
     */
    static natual(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): EntryFunction;
}
declare class MultiSigTransactionPayload {
    readonly transaction_payload: EntryFunction;
    /**
     * Contains the payload to run a multisig account transaction.
     * @param transaction_payload The payload of the multisig transaction. This can only be EntryFunction for now but
     * Script might be supported in the future.
     */
    constructor(transaction_payload: EntryFunction);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiSigTransactionPayload;
}
declare class MultiSig {
    readonly multisig_address: AccountAddress;
    readonly transaction_payload?: MultiSigTransactionPayload | undefined;
    /**
     * Contains the payload to run a multisig account transaction.
     * @param multisig_address The multisig account address the transaction will be executed as.
     * @param transaction_payload The payload of the multisig transaction. This is optional when executing a multisig
     *  transaction whose payload is already stored on chain.
     */
    constructor(multisig_address: AccountAddress, transaction_payload?: MultiSigTransactionPayload | undefined);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiSig;
}
declare class Module {
    readonly code: Bytes;
    /**
     * Contains the bytecode of a Move module that can be published to the Supra chain.
     * @param code Move bytecode of a module.
     */
    constructor(code: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Module;
}
declare class ModuleId {
    readonly address: AccountAddress;
    readonly name: Identifier;
    /**
     * Full name of a module.
     * @param address The account address.
     * @param name The name of the module under the account at "address".
     */
    constructor(address: AccountAddress, name: Identifier);
    /**
     * Converts a string literal to a ModuleId
     * @param moduleId String literal in format "AccountAddress::module_name", e.g. "0x1::coin"
     * @returns
     */
    static fromStr(moduleId: string): ModuleId;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ModuleId;
}
declare class ChangeSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChangeSet;
}
declare class WriteSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): WriteSet;
}
declare class SignedTransaction {
    readonly raw_txn: RawTransaction;
    readonly authenticator: TransactionAuthenticator;
    /**
     * A SignedTransaction consists of a raw transaction and an authenticator. The authenticator
     * contains a client's public key and the signature of the raw transaction.
     *
     *
     * @param raw_txn
     * @param authenticator Contains a client's public key and the signature of the raw transaction.
     *   Authenticator has 3 flavors: single signature, multi-signature and multi-agent.
     *   @see authenticator.ts for details.
     */
    constructor(raw_txn: RawTransaction, authenticator: TransactionAuthenticator);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): SignedTransaction;
}
declare abstract class RawTransactionWithData {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransactionWithData;
}
declare class MultiAgentRawTransaction extends RawTransactionWithData {
    readonly raw_txn: RawTransaction;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Seq<AccountAddress>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): MultiAgentRawTransaction;
}
declare class FeePayerRawTransaction extends RawTransactionWithData {
    readonly raw_txn: RawTransaction;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly fee_payer_address: AccountAddress;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Seq<AccountAddress>, fee_payer_address: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): FeePayerRawTransaction;
}
declare abstract class TransactionPayload {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionPayload;
}
declare class TransactionPayloadScript extends TransactionPayload {
    readonly value: Script;
    constructor(value: Script);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadScript;
}
declare class TransactionPayloadEntryFunction extends TransactionPayload {
    readonly value: EntryFunction;
    constructor(value: EntryFunction);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadEntryFunction;
}
declare class TransactionPayloadMultisig extends TransactionPayload {
    readonly value: MultiSig;
    constructor(value: MultiSig);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadMultisig;
}
declare class TransactionPayloadAutomationRegistration extends TransactionPayload {
    readonly value: AutomationRegistrationParams;
    constructor(value: AutomationRegistrationParams);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadAutomationRegistration;
}
declare abstract class AutomationRegistrationParams {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AutomationRegistrationParams;
}
declare class AutomationRegistrationParamsV1 extends AutomationRegistrationParams {
    readonly value: AutomationRegistrationParamsV1Data;
    constructor(value: AutomationRegistrationParamsV1Data);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AutomationRegistrationParamsV1;
}
declare class AutomationRegistrationParamsV1Data {
    readonly automated_function: EntryFunction;
    readonly max_gas_amount: Uint64;
    readonly gas_price_cap: Uint64;
    readonly automation_fee_cap_for_epoch: Uint64;
    readonly expiration_timestamp_secs: Uint64;
    readonly aux_data: Seq<Bytes>;
    constructor(automated_function: EntryFunction, max_gas_amount: Uint64, gas_price_cap: Uint64, automation_fee_cap_for_epoch: Uint64, expiration_timestamp_secs: Uint64, aux_data: Seq<Bytes>);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AutomationRegistrationParamsV1Data;
}
declare class ChainId {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChainId;
}
declare abstract class TransactionArgument {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionArgument;
}
declare class TransactionArgumentU8 extends TransactionArgument {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8;
}
declare class TransactionArgumentU16 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU16;
}
declare class TransactionArgumentU32 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU32;
}
declare class TransactionArgumentU64 extends TransactionArgument {
    readonly value: Uint64;
    constructor(value: Uint64);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU64;
}
declare class TransactionArgumentU128 extends TransactionArgument {
    readonly value: Uint128;
    constructor(value: Uint128);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU128;
}
declare class TransactionArgumentU256 extends TransactionArgument {
    readonly value: Uint256;
    constructor(value: Uint256);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU256;
}
declare class TransactionArgumentAddress extends TransactionArgument {
    readonly value: AccountAddress;
    constructor(value: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentAddress;
}
declare class TransactionArgumentU8Vector extends TransactionArgument {
    readonly value: Bytes;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8Vector;
}
declare class TransactionArgumentBool extends TransactionArgument {
    readonly value: boolean;
    constructor(value: boolean);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentBool;
}
declare abstract class Transaction {
    abstract serialize(serializer: Serializer): void;
    abstract hash(): Bytes;
    getHashSalt(): Bytes;
    static deserialize(deserializer: Deserializer): Transaction;
}
declare class UserTransaction extends Transaction {
    readonly value: SignedTransaction;
    constructor(value: SignedTransaction);
    hash(): Bytes;
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): UserTransaction;
}

declare class TypeArgumentABI {
    readonly name: string;
    /**
     * Constructs a TypeArgumentABI instance.
     * @param name
     */
    constructor(name: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeArgumentABI;
}
declare class ArgumentABI {
    readonly name: string;
    readonly type_tag: TypeTag;
    /**
     * Constructs an ArgumentABI instance.
     * @param name
     * @param type_tag
     */
    constructor(name: string, type_tag: TypeTag);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ArgumentABI;
}
declare abstract class ScriptABI {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ScriptABI;
}
declare class TransactionScriptABI extends ScriptABI {
    readonly name: string;
    readonly doc: string;
    readonly code: Bytes;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a TransactionScriptABI instance.
     * @param name Entry function name
     * @param doc
     * @param code
     * @param ty_args
     * @param args
     */
    constructor(name: string, doc: string, code: Bytes, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionScriptABI;
}
declare class EntryFunctionABI extends ScriptABI {
    readonly name: string;
    readonly module_name: ModuleId;
    readonly doc: string;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a EntryFunctionABI instance
     * @param name
     * @param module_name Fully qualified module id
     * @param doc
     * @param ty_args
     * @param args
     */
    constructor(name: string, module_name: ModuleId, doc: string, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): EntryFunctionABI;
}

/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 *
 * Account addresses can be derived from AuthenticationKey
 */
declare class AuthenticationKey {
    static readonly LENGTH: number;
    static readonly MULTI_ED25519_SCHEME: number;
    static readonly ED25519_SCHEME: number;
    static readonly DERIVE_RESOURCE_ACCOUNT_SCHEME: number;
    readonly bytes: Bytes;
    constructor(bytes: Bytes);
    /**
     * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
     * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
     * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
     */
    static fromMultiEd25519PublicKey(publicKey: MultiEd25519PublicKey): AuthenticationKey;
    static fromEd25519PublicKey(publicKey: Ed25519PublicKey): AuthenticationKey;
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     */
    derivedAddress(): HexString;
}

declare class RotationProofChallenge {
    readonly accountAddress: AccountAddress;
    readonly moduleName: string;
    readonly structName: string;
    readonly sequenceNumber: AnyNumber;
    readonly originator: AccountAddress;
    readonly currentAuthKey: AccountAddress;
    readonly newPublicKey: Uint8Array;
    constructor(accountAddress: AccountAddress, moduleName: string, structName: string, sequenceNumber: AnyNumber, originator: AccountAddress, currentAuthKey: AccountAddress, newPublicKey: Uint8Array);
    serialize(serializer: Serializer): void;
}

type SigningMessage = Uint8Array;

type index_AccountAddress = AccountAddress;
declare const index_AccountAddress: typeof AccountAddress;
type index_AccountAuthenticator = AccountAuthenticator;
declare const index_AccountAuthenticator: typeof AccountAuthenticator;
type index_AccountAuthenticatorEd25519 = AccountAuthenticatorEd25519;
declare const index_AccountAuthenticatorEd25519: typeof AccountAuthenticatorEd25519;
type index_AccountAuthenticatorMultiEd25519 = AccountAuthenticatorMultiEd25519;
declare const index_AccountAuthenticatorMultiEd25519: typeof AccountAuthenticatorMultiEd25519;
type index_ArgumentABI = ArgumentABI;
declare const index_ArgumentABI: typeof ArgumentABI;
type index_AuthenticationKey = AuthenticationKey;
declare const index_AuthenticationKey: typeof AuthenticationKey;
type index_AutomationRegistrationParams = AutomationRegistrationParams;
declare const index_AutomationRegistrationParams: typeof AutomationRegistrationParams;
type index_AutomationRegistrationParamsV1 = AutomationRegistrationParamsV1;
declare const index_AutomationRegistrationParamsV1: typeof AutomationRegistrationParamsV1;
type index_AutomationRegistrationParamsV1Data = AutomationRegistrationParamsV1Data;
declare const index_AutomationRegistrationParamsV1Data: typeof AutomationRegistrationParamsV1Data;
type index_ChainId = ChainId;
declare const index_ChainId: typeof ChainId;
type index_ChangeSet = ChangeSet;
declare const index_ChangeSet: typeof ChangeSet;
type index_Ed25519PublicKey = Ed25519PublicKey;
declare const index_Ed25519PublicKey: typeof Ed25519PublicKey;
type index_Ed25519Signature = Ed25519Signature;
declare const index_Ed25519Signature: typeof Ed25519Signature;
type index_EntryFunction = EntryFunction;
declare const index_EntryFunction: typeof EntryFunction;
type index_EntryFunctionABI = EntryFunctionABI;
declare const index_EntryFunctionABI: typeof EntryFunctionABI;
type index_FeePayerRawTransaction = FeePayerRawTransaction;
declare const index_FeePayerRawTransaction: typeof FeePayerRawTransaction;
type index_Identifier = Identifier;
declare const index_Identifier: typeof Identifier;
type index_Module = Module;
declare const index_Module: typeof Module;
type index_ModuleId = ModuleId;
declare const index_ModuleId: typeof ModuleId;
type index_MultiAgentRawTransaction = MultiAgentRawTransaction;
declare const index_MultiAgentRawTransaction: typeof MultiAgentRawTransaction;
type index_MultiEd25519PublicKey = MultiEd25519PublicKey;
declare const index_MultiEd25519PublicKey: typeof MultiEd25519PublicKey;
type index_MultiEd25519Signature = MultiEd25519Signature;
declare const index_MultiEd25519Signature: typeof MultiEd25519Signature;
type index_MultiSig = MultiSig;
declare const index_MultiSig: typeof MultiSig;
type index_MultiSigTransactionPayload = MultiSigTransactionPayload;
declare const index_MultiSigTransactionPayload: typeof MultiSigTransactionPayload;
type index_RawTransaction = RawTransaction;
declare const index_RawTransaction: typeof RawTransaction;
type index_RawTransactionWithData = RawTransactionWithData;
declare const index_RawTransactionWithData: typeof RawTransactionWithData;
type index_RotationProofChallenge = RotationProofChallenge;
declare const index_RotationProofChallenge: typeof RotationProofChallenge;
type index_Script = Script;
declare const index_Script: typeof Script;
type index_ScriptABI = ScriptABI;
declare const index_ScriptABI: typeof ScriptABI;
type index_SignedTransaction = SignedTransaction;
declare const index_SignedTransaction: typeof SignedTransaction;
type index_SigningMessage = SigningMessage;
type index_StructTag = StructTag;
declare const index_StructTag: typeof StructTag;
type index_Transaction = Transaction;
declare const index_Transaction: typeof Transaction;
type index_TransactionArgument = TransactionArgument;
declare const index_TransactionArgument: typeof TransactionArgument;
type index_TransactionArgumentAddress = TransactionArgumentAddress;
declare const index_TransactionArgumentAddress: typeof TransactionArgumentAddress;
type index_TransactionArgumentBool = TransactionArgumentBool;
declare const index_TransactionArgumentBool: typeof TransactionArgumentBool;
type index_TransactionArgumentU128 = TransactionArgumentU128;
declare const index_TransactionArgumentU128: typeof TransactionArgumentU128;
type index_TransactionArgumentU16 = TransactionArgumentU16;
declare const index_TransactionArgumentU16: typeof TransactionArgumentU16;
type index_TransactionArgumentU256 = TransactionArgumentU256;
declare const index_TransactionArgumentU256: typeof TransactionArgumentU256;
type index_TransactionArgumentU32 = TransactionArgumentU32;
declare const index_TransactionArgumentU32: typeof TransactionArgumentU32;
type index_TransactionArgumentU64 = TransactionArgumentU64;
declare const index_TransactionArgumentU64: typeof TransactionArgumentU64;
type index_TransactionArgumentU8 = TransactionArgumentU8;
declare const index_TransactionArgumentU8: typeof TransactionArgumentU8;
type index_TransactionArgumentU8Vector = TransactionArgumentU8Vector;
declare const index_TransactionArgumentU8Vector: typeof TransactionArgumentU8Vector;
type index_TransactionAuthenticator = TransactionAuthenticator;
declare const index_TransactionAuthenticator: typeof TransactionAuthenticator;
type index_TransactionAuthenticatorEd25519 = TransactionAuthenticatorEd25519;
declare const index_TransactionAuthenticatorEd25519: typeof TransactionAuthenticatorEd25519;
type index_TransactionAuthenticatorFeePayer = TransactionAuthenticatorFeePayer;
declare const index_TransactionAuthenticatorFeePayer: typeof TransactionAuthenticatorFeePayer;
type index_TransactionAuthenticatorMultiAgent = TransactionAuthenticatorMultiAgent;
declare const index_TransactionAuthenticatorMultiAgent: typeof TransactionAuthenticatorMultiAgent;
type index_TransactionAuthenticatorMultiEd25519 = TransactionAuthenticatorMultiEd25519;
declare const index_TransactionAuthenticatorMultiEd25519: typeof TransactionAuthenticatorMultiEd25519;
type index_TransactionPayload = TransactionPayload;
declare const index_TransactionPayload: typeof TransactionPayload;
type index_TransactionPayloadAutomationRegistration = TransactionPayloadAutomationRegistration;
declare const index_TransactionPayloadAutomationRegistration: typeof TransactionPayloadAutomationRegistration;
type index_TransactionPayloadEntryFunction = TransactionPayloadEntryFunction;
declare const index_TransactionPayloadEntryFunction: typeof TransactionPayloadEntryFunction;
type index_TransactionPayloadMultisig = TransactionPayloadMultisig;
declare const index_TransactionPayloadMultisig: typeof TransactionPayloadMultisig;
type index_TransactionPayloadScript = TransactionPayloadScript;
declare const index_TransactionPayloadScript: typeof TransactionPayloadScript;
type index_TransactionScriptABI = TransactionScriptABI;
declare const index_TransactionScriptABI: typeof TransactionScriptABI;
type index_TypeArgumentABI = TypeArgumentABI;
declare const index_TypeArgumentABI: typeof TypeArgumentABI;
type index_TypeTag = TypeTag;
declare const index_TypeTag: typeof TypeTag;
type index_TypeTagAddress = TypeTagAddress;
declare const index_TypeTagAddress: typeof TypeTagAddress;
type index_TypeTagBool = TypeTagBool;
declare const index_TypeTagBool: typeof TypeTagBool;
type index_TypeTagParser = TypeTagParser;
declare const index_TypeTagParser: typeof TypeTagParser;
type index_TypeTagParserError = TypeTagParserError;
declare const index_TypeTagParserError: typeof TypeTagParserError;
type index_TypeTagSigner = TypeTagSigner;
declare const index_TypeTagSigner: typeof TypeTagSigner;
type index_TypeTagStruct = TypeTagStruct;
declare const index_TypeTagStruct: typeof TypeTagStruct;
type index_TypeTagU128 = TypeTagU128;
declare const index_TypeTagU128: typeof TypeTagU128;
type index_TypeTagU16 = TypeTagU16;
declare const index_TypeTagU16: typeof TypeTagU16;
type index_TypeTagU256 = TypeTagU256;
declare const index_TypeTagU256: typeof TypeTagU256;
type index_TypeTagU32 = TypeTagU32;
declare const index_TypeTagU32: typeof TypeTagU32;
type index_TypeTagU64 = TypeTagU64;
declare const index_TypeTagU64: typeof TypeTagU64;
type index_TypeTagU8 = TypeTagU8;
declare const index_TypeTagU8: typeof TypeTagU8;
type index_TypeTagVector = TypeTagVector;
declare const index_TypeTagVector: typeof TypeTagVector;
type index_UserTransaction = UserTransaction;
declare const index_UserTransaction: typeof UserTransaction;
type index_WriteSet = WriteSet;
declare const index_WriteSet: typeof WriteSet;
declare const index_objectStructTag: typeof objectStructTag;
declare const index_optionStructTag: typeof optionStructTag;
declare const index_stringStructTag: typeof stringStructTag;
declare namespace index {
  export { index_AccountAddress as AccountAddress, index_AccountAuthenticator as AccountAuthenticator, index_AccountAuthenticatorEd25519 as AccountAuthenticatorEd25519, index_AccountAuthenticatorMultiEd25519 as AccountAuthenticatorMultiEd25519, index_ArgumentABI as ArgumentABI, index_AuthenticationKey as AuthenticationKey, index_AutomationRegistrationParams as AutomationRegistrationParams, index_AutomationRegistrationParamsV1 as AutomationRegistrationParamsV1, index_AutomationRegistrationParamsV1Data as AutomationRegistrationParamsV1Data, index_ChainId as ChainId, index_ChangeSet as ChangeSet, index_Ed25519PublicKey as Ed25519PublicKey, index_Ed25519Signature as Ed25519Signature, index_EntryFunction as EntryFunction, index_EntryFunctionABI as EntryFunctionABI, index_FeePayerRawTransaction as FeePayerRawTransaction, index_Identifier as Identifier, index_Module as Module, index_ModuleId as ModuleId, index_MultiAgentRawTransaction as MultiAgentRawTransaction, index_MultiEd25519PublicKey as MultiEd25519PublicKey, index_MultiEd25519Signature as MultiEd25519Signature, index_MultiSig as MultiSig, index_MultiSigTransactionPayload as MultiSigTransactionPayload, index_RawTransaction as RawTransaction, index_RawTransactionWithData as RawTransactionWithData, index_RotationProofChallenge as RotationProofChallenge, index_Script as Script, index_ScriptABI as ScriptABI, index_SignedTransaction as SignedTransaction, type index_SigningMessage as SigningMessage, index_StructTag as StructTag, index_Transaction as Transaction, index_TransactionArgument as TransactionArgument, index_TransactionArgumentAddress as TransactionArgumentAddress, index_TransactionArgumentBool as TransactionArgumentBool, index_TransactionArgumentU128 as TransactionArgumentU128, index_TransactionArgumentU16 as TransactionArgumentU16, index_TransactionArgumentU256 as TransactionArgumentU256, index_TransactionArgumentU32 as TransactionArgumentU32, index_TransactionArgumentU64 as TransactionArgumentU64, index_TransactionArgumentU8 as TransactionArgumentU8, index_TransactionArgumentU8Vector as TransactionArgumentU8Vector, index_TransactionAuthenticator as TransactionAuthenticator, index_TransactionAuthenticatorEd25519 as TransactionAuthenticatorEd25519, index_TransactionAuthenticatorFeePayer as TransactionAuthenticatorFeePayer, index_TransactionAuthenticatorMultiAgent as TransactionAuthenticatorMultiAgent, index_TransactionAuthenticatorMultiEd25519 as TransactionAuthenticatorMultiEd25519, index_TransactionPayload as TransactionPayload, index_TransactionPayloadAutomationRegistration as TransactionPayloadAutomationRegistration, index_TransactionPayloadEntryFunction as TransactionPayloadEntryFunction, index_TransactionPayloadMultisig as TransactionPayloadMultisig, index_TransactionPayloadScript as TransactionPayloadScript, index_TransactionScriptABI as TransactionScriptABI, index_TypeArgumentABI as TypeArgumentABI, index_TypeTag as TypeTag, index_TypeTagAddress as TypeTagAddress, index_TypeTagBool as TypeTagBool, index_TypeTagParser as TypeTagParser, index_TypeTagParserError as TypeTagParserError, index_TypeTagSigner as TypeTagSigner, index_TypeTagStruct as TypeTagStruct, index_TypeTagU128 as TypeTagU128, index_TypeTagU16 as TypeTagU16, index_TypeTagU256 as TypeTagU256, index_TypeTagU32 as TypeTagU32, index_TypeTagU64 as TypeTagU64, index_TypeTagU8 as TypeTagU8, index_TypeTagVector as TypeTagVector, index_UserTransaction as UserTransaction, index_WriteSet as WriteSet, index_objectStructTag as objectStructTag, index_optionStructTag as optionStructTag, index_stringStructTag as stringStructTag };
}

type AnyRawTransaction = RawTransaction | MultiAgentRawTransaction | FeePayerRawTransaction;
/**
 * Function that takes in a Signing Message (serialized raw transaction)
 *  and returns a signature
 */
type SigningFn = (txn: SigningMessage) => Ed25519Signature | MultiEd25519Signature;
declare class TransactionBuilder<F extends SigningFn> {
    readonly rawTxnBuilder?: TransactionBuilderABI | undefined;
    protected readonly signingFunction: F;
    constructor(signingFunction: F, rawTxnBuilder?: TransactionBuilderABI | undefined);
    /**
     * Builds a RawTransaction. Relays the call to TransactionBuilderABI.build
     * @param func
     * @param ty_tags
     * @param args
     */
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
    /** Generates a Signing Message out of a raw transaction. */
    static getSigningMessage(rawTxn: AnyRawTransaction): SigningMessage;
}
/**
 * Provides signing method for signing a raw transaction with single public key.
 */
declare class TransactionBuilderEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: Uint8Array, rawTxnBuilder?: TransactionBuilderABI);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Provides signing method for signing a raw transaction with multisig public key.
 */
declare class TransactionBuilderMultiEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: MultiEd25519PublicKey);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Config for creating raw transactions.
 */
interface ABIBuilderConfig {
    sender: MaybeHexString | AccountAddress;
    sequenceNumber: Uint64 | string;
    gasUnitPrice: Uint64 | string;
    maxGasAmount?: Uint64 | string;
    expSecFromNow?: number | string;
    chainId: Uint8 | string;
}
/**
 * Builds raw transactions based on ABI
 */
declare class TransactionBuilderABI {
    private readonly abiMap;
    private readonly builderConfig;
    /**
     * Constructs a TransactionBuilderABI instance
     * @param abis List of binary ABIs.
     * @param builderConfig Configs for creating a raw transaction.
     */
    constructor(abis: Bytes[], builderConfig?: ABIBuilderConfig);
    private static toBCSArgs;
    private static toTransactionArguments;
    setSequenceNumber(seqNumber: Uint64 | string): void;
    /**
     * Builds a TransactionPayload. For dApps, chain ID and account sequence numbers are only known to the wallet.
     * Instead of building a RawTransaction (requires chainID and sequenceNumber), dApps can build a TransactionPayload
     * and pass the payload to the wallet for signing and sending.
     * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
     * @param ty_tags TypeTag strings
     * @param args Function arguments
     * @returns TransactionPayload
     */
    buildTransactionPayload(func: string, ty_tags: string[], args: any[]): TransactionPayload;
    /**
     * Builds a RawTransaction
     * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
     * @param ty_tags TypeTag strings.
     * @example Below are valid value examples
     * ```
     * // Structs are in format `AccountAddress::ModuleName::StructName`
     * 0x1::aptos_coin::AptosCoin
     * // Vectors are in format `vector<other_tag_string>`
     * vector<0x1::aptos_coin::AptosCoin>
     * bool
     * u8
     * u16
     * u32
     * u64
     * u128
     * u256
     * address
     * ```
     * @param args Function arguments
     * @returns RawTransaction
     */
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
}
type RemoteABIBuilderConfig = Partial<Omit<ABIBuilderConfig, "sender">> & {
    sender: MaybeHexString | AccountAddress;
};
interface AptosClientInterface {
    getAccountModules: (accountAddress: MaybeHexString) => Promise<MoveModuleBytecode[]>;
    getAccount: (accountAddress: MaybeHexString) => Promise<AccountData>;
    getChainId: () => Promise<number>;
    estimateGasPrice: () => Promise<GasEstimation>;
}
/**
 * This transaction builder downloads JSON ABIs from the fullnodes.
 * It then translates the JSON ABIs to the format that is accepted by TransactionBuilderABI
 */
declare class TransactionBuilderRemoteABI {
    private readonly aptosClient;
    private readonly builderConfig;
    constructor(aptosClient: AptosClientInterface, builderConfig: RemoteABIBuilderConfig);
    fetchABI(addr: string): Promise<Map<string, MoveFunction & {
        fullName: string;
    }>>;
    /**
     * Builds a raw transaction. Only support script function a.k.a entry function payloads
     *
     * @param func fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer
     * @param ty_tags
     * @param args
     * @returns RawTransaction
     */
    build(func: EntryFunctionId, ty_tags: MoveType[], args: any[]): Promise<RawTransaction>;
}

declare function ensureBoolean(val: boolean | string): boolean;
declare function ensureNumber(val: number | string): number;
declare function ensureBigInt(val: number | bigint | string): bigint;
declare function serializeArg(argVal: any, argType: TypeTag, serializer: Serializer): void;
declare function argToTransactionArgument(argVal: any, argType: TypeTag): TransactionArgument;

type Keys = {
    key: Uint8Array;
    chainCode: Uint8Array;
};
declare const getMasterKeyFromSeed: (seed: string) => Keys;
declare const CKDPriv: ({ key, chainCode }: Keys, index: number) => Keys;
declare const getPublicKey: (privateKey: Uint8Array, withZeroByte?: boolean) => Uint8Array;
declare const isValidPath: (path: string) => boolean;
declare const derivePath: (path: string, seed: string, offset?: number) => Keys;

export { type ABIBuilderConfig, type AnyRawTransaction, type AptosClientInterface, index$1 as BCS, CKDPriv, HexString, type Keys, type MaybeHexString, type RemoteABIBuilderConfig, type SigningFn, SupraAccount, type SupraAccountObject, TransactionBuilder, TransactionBuilderABI, TransactionBuilderEd25519, TransactionBuilderMultiEd25519, TransactionBuilderRemoteABI, index as TxnBuilderTypes, TypeTagParser, index$2 as Types, argToTransactionArgument, derivePath, ensureBigInt, ensureBoolean, ensureNumber, getAddressFromAccountOrAddress, getMasterKeyFromSeed, getPublicKey, isValidPath, serializeArg };
