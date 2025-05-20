var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/account/supra_account.ts
import nacl2 from "tweetnacl";
import * as bip39 from "@scure/bip39";
import { bytesToHex as bytesToHex2 } from "@noble/hashes/utils";
import { sha256 } from "@noble/hashes/sha256";
import { sha3_256 as sha3Hash3 } from "@noble/hashes/sha3";

// src/utils/hd-key.ts
import nacl from "tweetnacl";
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";
import { hexToBytes } from "@noble/hashes/utils";
var pathRegex = /^m(\/[0-9]+')+$/;
var replaceDerive = (val) => val.replace("'", "");
var HMAC_KEY = "ed25519 seed";
var HARDENED_OFFSET = 2147483648;
var getMasterKeyFromSeed = (seed) => {
  const h = hmac.create(sha512, HMAC_KEY);
  const I = h.update(hexToBytes(seed)).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
};
var CKDPriv = ({ key, chainCode }, index) => {
  const buffer = new ArrayBuffer(4);
  new DataView(buffer).setUint32(0, index);
  const indexBytes = new Uint8Array(buffer);
  const zero = new Uint8Array([0]);
  const data = new Uint8Array([...zero, ...key, ...indexBytes]);
  const I = hmac.create(sha512, chainCode).update(data).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
};
var getPublicKey = (privateKey, withZeroByte = true) => {
  const keyPair = nacl.sign.keyPair.fromSeed(privateKey);
  const signPk = keyPair.secretKey.subarray(32);
  const zero = new Uint8Array([0]);
  return withZeroByte ? new Uint8Array([...zero, ...signPk]) : signPk;
};
var isValidPath = (path) => {
  if (!pathRegex.test(path)) {
    return false;
  }
  return !path.split("/").slice(1).map(replaceDerive).some(Number.isNaN);
};
var derivePath = (path, seed, offset = HARDENED_OFFSET) => {
  if (!isValidPath(path)) {
    throw new Error("Invalid derivation path");
  }
  const { key, chainCode } = getMasterKeyFromSeed(seed);
  const segments = path.split("/").slice(1).map(replaceDerive).map((el) => parseInt(el, 10));
  return segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), { key, chainCode });
};

// src/utils/misc.ts
var DEFAULT_MAX_GAS_AMOUNT = 2e5;
var DEFAULT_TXN_EXP_SEC_FROM_NOW = 20;

// src/utils/hex_string.ts
import { bytesToHex, hexToBytes as hexToBytes2 } from "@noble/hashes/utils";
var HexString = class _HexString {
  /**
   * Creates new hex string from Buffer
   * @param buffer A buffer to convert
   * @returns New HexString
   */
  static fromBuffer(buffer) {
    return _HexString.fromUint8Array(buffer);
  }
  /**
   * Creates new hex string from Uint8Array
   * @param arr Uint8Array to convert
   * @returns New HexString
   */
  static fromUint8Array(arr) {
    return new _HexString(bytesToHex(arr));
  }
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
  static ensure(hexString) {
    if (typeof hexString === "string") {
      return new _HexString(hexString);
    }
    return hexString;
  }
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
  constructor(hexString) {
    if (hexString.startsWith("0x")) {
      this.hexString = hexString;
    } else {
      this.hexString = `0x${hexString}`;
    }
  }
  /**
   * Getter for inner hexString
   * @returns Inner hex string
   */
  hex() {
    return this.hexString;
  }
  /**
   * Getter for inner hexString without prefix
   * @returns Inner hex string without prefix
   * @example
   * ```
   *  const hexString = new HexString("string"); // "0xstring"
   *  hexString.noPrefix(); // "string"
   * ```
   */
  noPrefix() {
    return this.hexString.slice(2);
  }
  /**
   * Overrides default `toString` method
   * @returns Inner hex string
   */
  toString() {
    return this.hex();
  }
  /**
   * Trimmes extra zeroes in the begining of a string
   * @returns Inner hexString without leading zeroes
   * @example
   * ```
   *  new HexString("0x000000string").toShortString(); // result = "0xstring"
   * ```
   */
  toShortString() {
    const trimmed = this.hexString.replace(/^0x0*/, "");
    return `0x${trimmed}`;
  }
  /**
   * Converts hex string to a Uint8Array
   * @returns Uint8Array from inner hexString without prefix
   */
  toUint8Array() {
    return Uint8Array.from(hexToBytes2(this.noPrefix()));
  }
};

// src/utils/memoize-decorator.ts
function Memoize(args) {
  let hashFunction;
  let ttlMs;
  let tags;
  if (typeof args === "object") {
    hashFunction = args.hashFunction;
    ttlMs = args.ttlMs;
    tags = args.tags;
  } else {
    hashFunction = args;
  }
  return (target, propertyKey, descriptor) => {
    if (descriptor.value != null) {
      descriptor.value = getNewFunction(descriptor.value, hashFunction, ttlMs, tags);
    } else if (descriptor.get != null) {
      descriptor.get = getNewFunction(descriptor.get, hashFunction, ttlMs, tags);
    } else {
      throw new Error("Only put a Memoize() decorator on a method or get accessor.");
    }
  };
}
function MemoizeExpiring(ttlMs, hashFunction) {
  return Memoize({
    ttlMs,
    hashFunction
  });
}
var clearCacheTagsMap = /* @__PURE__ */ new Map();
function getNewFunction(originalMethod, hashFunction, ttlMs = 0, tags) {
  const propMapName = Symbol("__memoized_map__");
  return function(...args) {
    let returnedValue;
    const that = this;
    if (!that.hasOwnProperty(propMapName)) {
      Object.defineProperty(that, propMapName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: /* @__PURE__ */ new Map()
      });
    }
    const myMap = that[propMapName];
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (clearCacheTagsMap.has(tag)) {
          clearCacheTagsMap.get(tag).push(myMap);
        } else {
          clearCacheTagsMap.set(tag, [myMap]);
        }
      }
    }
    if (hashFunction || args.length > 0 || ttlMs > 0) {
      let hashKey;
      if (hashFunction === true) {
        hashKey = args.map((a) => a.toString()).join("!");
      } else if (hashFunction) {
        hashKey = hashFunction.apply(that, args);
      } else {
        hashKey = args[0];
      }
      const timestampKey = `${hashKey}__timestamp`;
      let isExpired = false;
      if (ttlMs > 0) {
        if (!myMap.has(timestampKey)) {
          isExpired = true;
        } else {
          const timestamp = myMap.get(timestampKey);
          isExpired = Date.now() - timestamp > ttlMs;
        }
      }
      if (myMap.has(hashKey) && !isExpired) {
        returnedValue = myMap.get(hashKey);
      } else {
        returnedValue = originalMethod.apply(that, args);
        myMap.set(hashKey, returnedValue);
        if (ttlMs > 0) {
          myMap.set(timestampKey, Date.now());
        }
      }
    } else {
      const hashKey = that;
      if (myMap.has(hashKey)) {
        returnedValue = myMap.get(hashKey);
      } else {
        returnedValue = originalMethod.apply(that, args);
        myMap.set(hashKey, returnedValue);
      }
    }
    return returnedValue;
  };
}

// src/supra_types/index.ts
var supra_types_exports = {};
__export(supra_types_exports, {
  AccountAddress: () => AccountAddress,
  AccountAuthenticator: () => AccountAuthenticator,
  AccountAuthenticatorEd25519: () => AccountAuthenticatorEd25519,
  AccountAuthenticatorMultiEd25519: () => AccountAuthenticatorMultiEd25519,
  ArgumentABI: () => ArgumentABI,
  AuthenticationKey: () => AuthenticationKey,
  AutomationRegistrationParams: () => AutomationRegistrationParams,
  AutomationRegistrationParamsV1: () => AutomationRegistrationParamsV1,
  AutomationRegistrationParamsV1Data: () => AutomationRegistrationParamsV1Data,
  ChainId: () => ChainId,
  ChangeSet: () => ChangeSet,
  Ed25519PublicKey: () => Ed25519PublicKey,
  Ed25519Signature: () => Ed25519Signature,
  EntryFunction: () => EntryFunction,
  EntryFunctionABI: () => EntryFunctionABI,
  FeePayerRawTransaction: () => FeePayerRawTransaction,
  Identifier: () => Identifier,
  Module: () => Module,
  ModuleId: () => ModuleId,
  MultiAgentRawTransaction: () => MultiAgentRawTransaction,
  MultiEd25519PublicKey: () => MultiEd25519PublicKey,
  MultiEd25519Signature: () => MultiEd25519Signature,
  MultiSig: () => MultiSig,
  MultiSigTransactionPayload: () => MultiSigTransactionPayload,
  RawTransaction: () => RawTransaction,
  RawTransactionWithData: () => RawTransactionWithData,
  RotationProofChallenge: () => RotationProofChallenge,
  Script: () => Script,
  ScriptABI: () => ScriptABI,
  SignedTransaction: () => SignedTransaction,
  StructTag: () => StructTag,
  Transaction: () => Transaction,
  TransactionArgument: () => TransactionArgument,
  TransactionArgumentAddress: () => TransactionArgumentAddress,
  TransactionArgumentBool: () => TransactionArgumentBool,
  TransactionArgumentU128: () => TransactionArgumentU128,
  TransactionArgumentU16: () => TransactionArgumentU16,
  TransactionArgumentU256: () => TransactionArgumentU256,
  TransactionArgumentU32: () => TransactionArgumentU32,
  TransactionArgumentU64: () => TransactionArgumentU64,
  TransactionArgumentU8: () => TransactionArgumentU8,
  TransactionArgumentU8Vector: () => TransactionArgumentU8Vector,
  TransactionAuthenticator: () => TransactionAuthenticator,
  TransactionAuthenticatorEd25519: () => TransactionAuthenticatorEd25519,
  TransactionAuthenticatorFeePayer: () => TransactionAuthenticatorFeePayer,
  TransactionAuthenticatorMultiAgent: () => TransactionAuthenticatorMultiAgent,
  TransactionAuthenticatorMultiEd25519: () => TransactionAuthenticatorMultiEd25519,
  TransactionPayload: () => TransactionPayload,
  TransactionPayloadAutomationRegistration: () => TransactionPayloadAutomationRegistration,
  TransactionPayloadEntryFunction: () => TransactionPayloadEntryFunction,
  TransactionPayloadMultisig: () => TransactionPayloadMultisig,
  TransactionPayloadScript: () => TransactionPayloadScript,
  TransactionScriptABI: () => TransactionScriptABI,
  TypeArgumentABI: () => TypeArgumentABI,
  TypeTag: () => TypeTag,
  TypeTagAddress: () => TypeTagAddress,
  TypeTagBool: () => TypeTagBool,
  TypeTagParser: () => TypeTagParser,
  TypeTagParserError: () => TypeTagParserError,
  TypeTagSigner: () => TypeTagSigner,
  TypeTagStruct: () => TypeTagStruct,
  TypeTagU128: () => TypeTagU128,
  TypeTagU16: () => TypeTagU16,
  TypeTagU256: () => TypeTagU256,
  TypeTagU32: () => TypeTagU32,
  TypeTagU64: () => TypeTagU64,
  TypeTagU8: () => TypeTagU8,
  TypeTagVector: () => TypeTagVector,
  UserTransaction: () => UserTransaction,
  WriteSet: () => WriteSet,
  objectStructTag: () => objectStructTag,
  optionStructTag: () => optionStructTag,
  stringStructTag: () => stringStructTag
});

// src/bcs/index.ts
var bcs_exports = {};
__export(bcs_exports, {
  Deserializer: () => Deserializer,
  Serializer: () => Serializer,
  bcsSerializeBool: () => bcsSerializeBool,
  bcsSerializeBytes: () => bcsSerializeBytes,
  bcsSerializeFixedBytes: () => bcsSerializeFixedBytes,
  bcsSerializeStr: () => bcsSerializeStr,
  bcsSerializeU128: () => bcsSerializeU128,
  bcsSerializeU16: () => bcsSerializeU16,
  bcsSerializeU256: () => bcsSerializeU256,
  bcsSerializeU32: () => bcsSerializeU32,
  bcsSerializeU8: () => bcsSerializeU8,
  bcsSerializeUint64: () => bcsSerializeUint64,
  bcsToBytes: () => bcsToBytes,
  deserializeVector: () => deserializeVector,
  deserializeVectorOfBytes: () => deserializeVectorOfBytes,
  serializeVector: () => serializeVector,
  serializeVectorOfBytes: () => serializeVectorOfBytes,
  serializeVectorWithFunc: () => serializeVectorWithFunc
});

// src/bcs/consts.ts
var MAX_U8_NUMBER = 255;
var MAX_U16_NUMBER = 65535;
var MAX_U32_NUMBER = 4294967295;
var MAX_U64_BIG_INT = 18446744073709551615n;
var MAX_U128_BIG_INT = 340282366920938463463374607431768211455n;
var MAX_U256_BIG_INT = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

// src/bcs/serializer.ts
var Serializer = class {
  constructor() {
    this.buffer = new ArrayBuffer(64);
    this.offset = 0;
  }
  ensureBufferWillHandleSize(bytes) {
    while (this.buffer.byteLength < this.offset + bytes) {
      const newBuffer = new ArrayBuffer(this.buffer.byteLength * 2);
      new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
      this.buffer = newBuffer;
    }
  }
  serialize(values) {
    this.ensureBufferWillHandleSize(values.length);
    new Uint8Array(this.buffer, this.offset).set(values);
    this.offset += values.length;
  }
  serializeWithFunction(fn, bytesLength, value) {
    this.ensureBufferWillHandleSize(bytesLength);
    const dv = new DataView(this.buffer, this.offset);
    fn.apply(dv, [0, value, true]);
    this.offset += bytesLength;
  }
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
  serializeStr(value) {
    const textEncoder = new TextEncoder();
    this.serializeBytes(textEncoder.encode(value));
  }
  /**
   * Serializes an array of bytes.
   *
   * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
   * uleb128 encoded. bytes_length is a u32 integer.
   */
  serializeBytes(value) {
    this.serializeU32AsUleb128(value.length);
    this.serialize(value);
  }
  /**
   * Serializes an array of bytes with known length. Therefore length doesn't need to be
   * serialized to help deserialization.  When deserializing, the number of
   * bytes to deserialize needs to be passed in.
   */
  serializeFixedBytes(value) {
    this.serialize(value);
  }
  /**
   * Serializes a boolean value.
   *
   * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
   */
  serializeBool(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value needs to be a boolean");
    }
    const byteValue = value ? 1 : 0;
    this.serialize(new Uint8Array([byteValue]));
  }
  serializeU8(value) {
    this.serialize(new Uint8Array([value]));
  }
  serializeU16(value) {
    this.serializeWithFunction(DataView.prototype.setUint16, 2, value);
  }
  serializeU32(value) {
    this.serializeWithFunction(DataView.prototype.setUint32, 4, value);
  }
  serializeU64(value) {
    const low = BigInt(value.toString()) & BigInt(MAX_U32_NUMBER);
    const high = BigInt(value.toString()) >> BigInt(32);
    this.serializeU32(Number(low));
    this.serializeU32(Number(high));
  }
  serializeU128(value) {
    const low = BigInt(value.toString()) & MAX_U64_BIG_INT;
    const high = BigInt(value.toString()) >> BigInt(64);
    this.serializeU64(low);
    this.serializeU64(high);
  }
  serializeU256(value) {
    const low = BigInt(value.toString()) & MAX_U128_BIG_INT;
    const high = BigInt(value.toString()) >> BigInt(128);
    this.serializeU128(low);
    this.serializeU128(high);
  }
  serializeU32AsUleb128(val) {
    let value = val;
    const valueArray = [];
    while (value >>> 7 !== 0) {
      valueArray.push(value & 127 | 128);
      value >>>= 7;
    }
    valueArray.push(value);
    this.serialize(new Uint8Array(valueArray));
  }
  /**
   * Returns the buffered bytes
   */
  getBytes() {
    return new Uint8Array(this.buffer).slice(0, this.offset);
  }
};
__decorateClass([
  checkNumberRange(0, MAX_U8_NUMBER)
], Serializer.prototype, "serializeU8", 1);
__decorateClass([
  checkNumberRange(0, MAX_U16_NUMBER)
], Serializer.prototype, "serializeU16", 1);
__decorateClass([
  checkNumberRange(0, MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U64_BIG_INT)
], Serializer.prototype, "serializeU64", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U128_BIG_INT)
], Serializer.prototype, "serializeU128", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U256_BIG_INT)
], Serializer.prototype, "serializeU256", 1);
__decorateClass([
  checkNumberRange(0, MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32AsUleb128", 1);
function checkNumberRange(minValue, maxValue, message) {
  return (target, propertyKey, descriptor) => {
    const childFunction = descriptor.value;
    descriptor.value = function deco(value) {
      const valueBigInt = BigInt(value.toString());
      if (valueBigInt > BigInt(maxValue.toString()) || valueBigInt < BigInt(minValue.toString())) {
        throw new Error(message || "Value is out of range");
      }
      childFunction.apply(this, [value]);
    };
    return descriptor;
  };
}

// src/bcs/deserializer.ts
var Deserializer = class {
  constructor(data) {
    this.buffer = new ArrayBuffer(data.length);
    new Uint8Array(this.buffer).set(data, 0);
    this.offset = 0;
  }
  read(length) {
    if (this.offset + length > this.buffer.byteLength) {
      throw new Error("Reached to the end of buffer");
    }
    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }
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
  deserializeStr() {
    const value = this.deserializeBytes();
    const textDecoder = new TextDecoder();
    return textDecoder.decode(value);
  }
  /**
   * Deserializes an array of bytes.
   *
   * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
   * uleb128 encoded. bytes_length is a u32 integer.
   */
  deserializeBytes() {
    const len = this.deserializeUleb128AsU32();
    return new Uint8Array(this.read(len));
  }
  /**
   * Deserializes an array of bytes. The number of bytes to read is already known.
   *
   */
  deserializeFixedBytes(len) {
    return new Uint8Array(this.read(len));
  }
  /**
   * Deserializes a boolean value.
   *
   * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
   */
  deserializeBool() {
    const bool = new Uint8Array(this.read(1))[0];
    if (bool !== 1 && bool !== 0) {
      throw new Error("Invalid boolean value");
    }
    return bool === 1;
  }
  /**
   * Deserializes a uint8 number.
   *
   * BCS layout for "uint8": One byte. Binary format in little-endian representation.
   */
  deserializeU8() {
    return new DataView(this.read(1)).getUint8(0);
  }
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
  deserializeU16() {
    return new DataView(this.read(2)).getUint16(0, true);
  }
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
  deserializeU32() {
    return new DataView(this.read(4)).getUint32(0, true);
  }
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
  deserializeU64() {
    const low = this.deserializeU32();
    const high = this.deserializeU32();
    return BigInt(BigInt(high) << BigInt(32) | BigInt(low));
  }
  /**
   * Deserializes a uint128 number.
   *
   * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
   */
  deserializeU128() {
    const low = this.deserializeU64();
    const high = this.deserializeU64();
    return BigInt(high << BigInt(64) | low);
  }
  /**
   * Deserializes a uint256 number.
   *
   * BCS layout for "uint256": Thirty-two bytes. Binary format in little-endian representation.
   */
  deserializeU256() {
    const low = this.deserializeU128();
    const high = this.deserializeU128();
    return BigInt(high << BigInt(128) | low);
  }
  /**
   * Deserializes a uleb128 encoded uint32 number.
   *
   * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
   */
  deserializeUleb128AsU32() {
    let value = BigInt(0);
    let shift = 0;
    while (value < MAX_U32_NUMBER) {
      const byte = this.deserializeU8();
      value |= BigInt(byte & 127) << BigInt(shift);
      if ((byte & 128) === 0) {
        break;
      }
      shift += 7;
    }
    if (value > MAX_U32_NUMBER) {
      throw new Error("Overflow while parsing uleb128-encoded uint32 value");
    }
    return Number(value);
  }
};

// src/bcs/helper.ts
function serializeVector(value, serializer) {
  serializer.serializeU32AsUleb128(value.length);
  value.forEach((item) => {
    item.serialize(serializer);
  });
}
function serializeVectorOfBytes(value, serializer) {
  serializer.serializeU32AsUleb128(value.length);
  value.forEach((item) => {
    serializer.serializeBytes(item);
  });
}
function serializeVectorWithFunc(value, func) {
  const serializer = new Serializer();
  serializer.serializeU32AsUleb128(value.length);
  const f = serializer[func];
  value.forEach((item) => {
    f.call(serializer, item);
  });
  return serializer.getBytes();
}
function deserializeVector(deserializer, cls) {
  const length = deserializer.deserializeUleb128AsU32();
  const list = [];
  for (let i = 0; i < length; i += 1) {
    list.push(cls.deserialize(deserializer));
  }
  return list;
}
function deserializeVectorOfBytes(deserializer) {
  const length = deserializer.deserializeUleb128AsU32();
  const list = [];
  for (let i = 0; i < length; i += 1) {
    list.push(deserializer.deserializeBytes());
  }
  return list;
}
function bcsToBytes(value) {
  const serializer = new Serializer();
  value.serialize(serializer);
  return serializer.getBytes();
}
function bcsSerializeUint64(value) {
  const serializer = new Serializer();
  serializer.serializeU64(value);
  return serializer.getBytes();
}
function bcsSerializeU8(value) {
  const serializer = new Serializer();
  serializer.serializeU8(value);
  return serializer.getBytes();
}
function bcsSerializeU16(value) {
  const serializer = new Serializer();
  serializer.serializeU16(value);
  return serializer.getBytes();
}
function bcsSerializeU32(value) {
  const serializer = new Serializer();
  serializer.serializeU32(value);
  return serializer.getBytes();
}
function bcsSerializeU128(value) {
  const serializer = new Serializer();
  serializer.serializeU128(value);
  return serializer.getBytes();
}
function bcsSerializeU256(value) {
  const serializer = new Serializer();
  serializer.serializeU256(value);
  return serializer.getBytes();
}
function bcsSerializeBool(value) {
  const serializer = new Serializer();
  serializer.serializeBool(value);
  return serializer.getBytes();
}
function bcsSerializeStr(value) {
  const serializer = new Serializer();
  serializer.serializeStr(value);
  return serializer.getBytes();
}
function bcsSerializeBytes(value) {
  const serializer = new Serializer();
  serializer.serializeBytes(value);
  return serializer.getBytes();
}
function bcsSerializeFixedBytes(value) {
  const serializer = new Serializer();
  serializer.serializeFixedBytes(value);
  return serializer.getBytes();
}

// src/supra_types/transaction.ts
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";

// src/supra_types/account_address.ts
var _AccountAddress = class _AccountAddress {
  constructor(address) {
    if (address.length !== _AccountAddress.LENGTH) {
      throw new Error("Expected address of length 32");
    }
    this.address = address;
  }
  /**
   * Creates AccountAddress from a hex string.
   * @param addr Hex string can be with a prefix or without a prefix,
   *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
   */
  static fromHex(addr) {
    let address = HexString.ensure(addr);
    if (address.noPrefix().length % 2 !== 0) {
      address = new HexString(`0${address.noPrefix()}`);
    }
    const addressBytes = address.toUint8Array();
    if (addressBytes.length > _AccountAddress.LENGTH) {
      throw new Error("Hex string is too long. Address's length is 32 bytes.");
    } else if (addressBytes.length === _AccountAddress.LENGTH) {
      return new _AccountAddress(addressBytes);
    }
    const res = new Uint8Array(_AccountAddress.LENGTH);
    res.set(addressBytes, _AccountAddress.LENGTH - addressBytes.length);
    return new _AccountAddress(res);
  }
  /**
   * Checks if the string is a valid AccountAddress
   * @param addr Hex string can be with a prefix or without a prefix,
   *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
   */
  static isValid(addr) {
    if (addr === "") {
      return false;
    }
    let address = HexString.ensure(addr);
    if (address.noPrefix().length % 2 !== 0) {
      address = new HexString(`0${address.noPrefix()}`);
    }
    const addressBytes = address.toUint8Array();
    return addressBytes.length <= _AccountAddress.LENGTH;
  }
  /**
   * Return a hex string from account Address.
   */
  toHexString() {
    return HexString.fromUint8Array(this.address).hex();
  }
  serialize(serializer) {
    serializer.serializeFixedBytes(this.address);
  }
  static deserialize(deserializer) {
    return new _AccountAddress(deserializer.deserializeFixedBytes(_AccountAddress.LENGTH));
  }
  /**
   * Standardizes an address to the format "0x" followed by 64 lowercase hexadecimal digits.
   */
  static standardizeAddress(address) {
    const lowercaseAddress = address.toLowerCase();
    const addressWithoutPrefix = lowercaseAddress.startsWith("0x") ? lowercaseAddress.slice(2) : lowercaseAddress;
    const addressWithPadding = addressWithoutPrefix.padStart(64, "0");
    return `0x${addressWithPadding}`;
  }
};
_AccountAddress.LENGTH = 32;
_AccountAddress.CORE_CODE_ADDRESS = _AccountAddress.fromHex("0x1");
var AccountAddress = _AccountAddress;

// src/supra_types/ed25519.ts
var _Ed25519PublicKey = class _Ed25519PublicKey {
  constructor(value) {
    if (value.length !== _Ed25519PublicKey.LENGTH) {
      throw new Error(`Ed25519PublicKey length should be ${_Ed25519PublicKey.LENGTH}`);
    }
    this.value = value;
  }
  toBytes() {
    return this.value;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeBytes();
    return new _Ed25519PublicKey(value);
  }
};
_Ed25519PublicKey.LENGTH = 32;
var Ed25519PublicKey = _Ed25519PublicKey;
var _Ed25519Signature = class _Ed25519Signature {
  constructor(value) {
    this.value = value;
    if (value.length !== _Ed25519Signature.LENGTH) {
      throw new Error(`Ed25519Signature length should be ${_Ed25519Signature.LENGTH}`);
    }
  }
  serialize(serializer) {
    serializer.serializeBytes(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeBytes();
    return new _Ed25519Signature(value);
  }
};
_Ed25519Signature.LENGTH = 64;
var Ed25519Signature = _Ed25519Signature;

// src/supra_types/multi_ed25519.ts
var MAX_SIGNATURES_SUPPORTED = 32;
var MultiEd25519PublicKey = class _MultiEd25519PublicKey {
  /**
   * Public key for a K-of-N multisig transaction. A K-of-N multisig transaction means that for such a
   * transaction to be executed, at least K out of the N authorized signers have signed the transaction
   * and passed the check conducted by the chain.
   *
   *
   * @param public_keys A list of public keys
   * @param threshold At least "threshold" signatures must be valid
   */
  constructor(public_keys, threshold) {
    this.public_keys = public_keys;
    this.threshold = threshold;
    if (threshold > MAX_SIGNATURES_SUPPORTED) {
      throw new Error(`"threshold" cannot be larger than ${MAX_SIGNATURES_SUPPORTED}`);
    }
  }
  /**
   * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
   */
  toBytes() {
    const bytes = new Uint8Array(this.public_keys.length * Ed25519PublicKey.LENGTH + 1);
    this.public_keys.forEach((k, i) => {
      bytes.set(k.value, i * Ed25519PublicKey.LENGTH);
    });
    bytes[this.public_keys.length * Ed25519PublicKey.LENGTH] = this.threshold;
    return bytes;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toBytes());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    const threshold = bytes[bytes.length - 1];
    const keys = [];
    for (let i = 0; i < bytes.length - 1; i += Ed25519PublicKey.LENGTH) {
      const begin = i;
      keys.push(new Ed25519PublicKey(bytes.subarray(begin, begin + Ed25519PublicKey.LENGTH)));
    }
    return new _MultiEd25519PublicKey(keys, threshold);
  }
};
var _MultiEd25519Signature = class _MultiEd25519Signature {
  /**
   * Signature for a K-of-N multisig transaction.
   *
   *
   * @param signatures A list of ed25519 signatures
   * @param bitmap 4 bytes, at most 32 signatures are supported. If Nth bit value is `1`, the Nth
   * signature should be provided in `signatures`. Bits are read from left to right
   */
  constructor(signatures, bitmap) {
    this.signatures = signatures;
    this.bitmap = bitmap;
    if (bitmap.length !== _MultiEd25519Signature.BITMAP_LEN) {
      throw new Error(`"bitmap" length should be ${_MultiEd25519Signature.BITMAP_LEN}`);
    }
  }
  /**
   * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
   */
  toBytes() {
    const bytes = new Uint8Array(this.signatures.length * Ed25519Signature.LENGTH + _MultiEd25519Signature.BITMAP_LEN);
    this.signatures.forEach((k, i) => {
      bytes.set(k.value, i * Ed25519Signature.LENGTH);
    });
    bytes.set(this.bitmap, this.signatures.length * Ed25519Signature.LENGTH);
    return bytes;
  }
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
  static createBitmap(bits) {
    const firstBitInByte = 128;
    const bitmap = new Uint8Array([0, 0, 0, 0]);
    const dupCheckSet = /* @__PURE__ */ new Set();
    bits.forEach((bit) => {
      if (bit >= MAX_SIGNATURES_SUPPORTED) {
        throw new Error(`Invalid bit value ${bit}.`);
      }
      if (dupCheckSet.has(bit)) {
        throw new Error("Duplicated bits detected.");
      }
      dupCheckSet.add(bit);
      const byteOffset = Math.floor(bit / 8);
      let byte = bitmap[byteOffset];
      byte |= firstBitInByte >> bit % 8;
      bitmap[byteOffset] = byte;
    });
    return bitmap;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toBytes());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    const bitmap = bytes.subarray(bytes.length - 4);
    const sigs = [];
    for (let i = 0; i < bytes.length - bitmap.length; i += Ed25519Signature.LENGTH) {
      const begin = i;
      sigs.push(new Ed25519Signature(bytes.subarray(begin, begin + Ed25519Signature.LENGTH)));
    }
    return new _MultiEd25519Signature(sigs, bitmap);
  }
};
_MultiEd25519Signature.BITMAP_LEN = 4;
var MultiEd25519Signature = _MultiEd25519Signature;

// src/supra_types/authenticator.ts
var TransactionAuthenticator = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionAuthenticatorEd25519.load(deserializer);
      case 1:
        return TransactionAuthenticatorMultiEd25519.load(deserializer);
      case 2:
        return TransactionAuthenticatorMultiAgent.load(deserializer);
      case 3:
        return TransactionAuthenticatorFeePayer.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionAuthenticator: ${index}`);
    }
  }
};
var TransactionAuthenticatorEd25519 = class _TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
  /**
   * An authenticator for single signature.
   *
   * @param public_key Client's public key.
   * @param signature Signature of a raw transaction.
   * for details about generating a signature.
   */
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = Ed25519PublicKey.deserialize(deserializer);
    const signature = Ed25519Signature.deserialize(deserializer);
    return new _TransactionAuthenticatorEd25519(public_key, signature);
  }
};
var TransactionAuthenticatorMultiEd25519 = class _TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
  /**
   * An authenticator for multiple signatures.
   *
   * @param public_key
   * @param signature
   *
   */
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = MultiEd25519PublicKey.deserialize(deserializer);
    const signature = MultiEd25519Signature.deserialize(deserializer);
    return new _TransactionAuthenticatorMultiEd25519(public_key, signature);
  }
};
var TransactionAuthenticatorMultiAgent = class _TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
  constructor(sender, secondary_signer_addresses, secondary_signers) {
    super();
    this.sender = sender;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.secondary_signers = secondary_signers;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
    this.sender.serialize(serializer);
    serializeVector(this.secondary_signer_addresses, serializer);
    serializeVector(this.secondary_signers, serializer);
  }
  static load(deserializer) {
    const sender = AccountAuthenticator.deserialize(deserializer);
    const secondary_signer_addresses = deserializeVector(deserializer, AccountAddress);
    const secondary_signers = deserializeVector(deserializer, AccountAuthenticator);
    return new _TransactionAuthenticatorMultiAgent(sender, secondary_signer_addresses, secondary_signers);
  }
};
var TransactionAuthenticatorFeePayer = class _TransactionAuthenticatorFeePayer extends TransactionAuthenticator {
  constructor(sender, secondary_signer_addresses, secondary_signers, fee_payer) {
    super();
    this.sender = sender;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.secondary_signers = secondary_signers;
    this.fee_payer = fee_payer;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
    this.sender.serialize(serializer);
    serializeVector(this.secondary_signer_addresses, serializer);
    serializeVector(this.secondary_signers, serializer);
    this.fee_payer.address.serialize(serializer);
    this.fee_payer.authenticator.serialize(serializer);
  }
  static load(deserializer) {
    const sender = AccountAuthenticator.deserialize(deserializer);
    const secondary_signer_addresses = deserializeVector(deserializer, AccountAddress);
    const secondary_signers = deserializeVector(deserializer, AccountAuthenticator);
    const address = AccountAddress.deserialize(deserializer);
    const authenticator = AccountAuthenticator.deserialize(deserializer);
    const fee_payer = { address, authenticator };
    return new _TransactionAuthenticatorFeePayer(sender, secondary_signer_addresses, secondary_signers, fee_payer);
  }
};
var AccountAuthenticator = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return AccountAuthenticatorEd25519.load(deserializer);
      case 1:
        return AccountAuthenticatorMultiEd25519.load(deserializer);
      default:
        throw new Error(`Unknown variant index for AccountAuthenticator: ${index}`);
    }
  }
};
var AccountAuthenticatorEd25519 = class _AccountAuthenticatorEd25519 extends AccountAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = Ed25519PublicKey.deserialize(deserializer);
    const signature = Ed25519Signature.deserialize(deserializer);
    return new _AccountAuthenticatorEd25519(public_key, signature);
  }
};
var AccountAuthenticatorMultiEd25519 = class _AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = MultiEd25519PublicKey.deserialize(deserializer);
    const signature = MultiEd25519Signature.deserialize(deserializer);
    return new _AccountAuthenticatorMultiEd25519(public_key, signature);
  }
};

// src/supra_types/identifier.ts
var Identifier = class _Identifier {
  constructor(value) {
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeStr(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeStr();
    return new _Identifier(value);
  }
};

// src/supra_types/type_tag.ts
var TypeTag = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TypeTagBool.load(deserializer);
      case 1:
        return TypeTagU8.load(deserializer);
      case 2:
        return TypeTagU64.load(deserializer);
      case 3:
        return TypeTagU128.load(deserializer);
      case 4:
        return TypeTagAddress.load(deserializer);
      case 5:
        return TypeTagSigner.load(deserializer);
      case 6:
        return TypeTagVector.load(deserializer);
      case 7:
        return TypeTagStruct.load(deserializer);
      case 8:
        return TypeTagU16.load(deserializer);
      case 9:
        return TypeTagU32.load(deserializer);
      case 10:
        return TypeTagU256.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TypeTag: ${index}`);
    }
  }
};
var TypeTagBool = class _TypeTagBool extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
  }
  static load(_deserializer) {
    return new _TypeTagBool();
  }
};
var TypeTagU8 = class _TypeTagU8 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
  }
  static load(_deserializer) {
    return new _TypeTagU8();
  }
};
var TypeTagU16 = class _TypeTagU16 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(8);
  }
  static load(_deserializer) {
    return new _TypeTagU16();
  }
};
var TypeTagU32 = class _TypeTagU32 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(9);
  }
  static load(_deserializer) {
    return new _TypeTagU32();
  }
};
var TypeTagU64 = class _TypeTagU64 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
  }
  static load(_deserializer) {
    return new _TypeTagU64();
  }
};
var TypeTagU128 = class _TypeTagU128 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
  }
  static load(_deserializer) {
    return new _TypeTagU128();
  }
};
var TypeTagU256 = class _TypeTagU256 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(10);
  }
  static load(_deserializer) {
    return new _TypeTagU256();
  }
};
var TypeTagAddress = class _TypeTagAddress extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(4);
  }
  static load(_deserializer) {
    return new _TypeTagAddress();
  }
};
var TypeTagSigner = class _TypeTagSigner extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(5);
  }
  static load(_deserializer) {
    return new _TypeTagSigner();
  }
};
var TypeTagVector = class _TypeTagVector extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(6);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = TypeTag.deserialize(deserializer);
    return new _TypeTagVector(value);
  }
};
var TypeTagStruct = class _TypeTagStruct extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(7);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = StructTag.deserialize(deserializer);
    return new _TypeTagStruct(value);
  }
  isStringTypeTag() {
    if (this.value.module_name.value === "string" && this.value.name.value === "String" && this.value.address.toHexString() === AccountAddress.CORE_CODE_ADDRESS.toHexString()) {
      return true;
    }
    return false;
  }
};
var StructTag = class _StructTag {
  constructor(address, module_name, name, type_args) {
    this.address = address;
    this.module_name = module_name;
    this.name = name;
    this.type_args = type_args;
  }
  /**
   * Converts a string literal to a StructTag
   * @param structTag String literal in format "AccountAddress::module_name::ResourceName",
   *   e.g. "0x1::supra_coin::SupraCoin"
   * @returns
   */
  static fromString(structTag) {
    const typeTagStruct = new TypeTagParser(structTag).parseTypeTag();
    return new _StructTag(
      typeTagStruct.value.address,
      typeTagStruct.value.module_name,
      typeTagStruct.value.name,
      typeTagStruct.value.type_args
    );
  }
  serialize(serializer) {
    this.address.serialize(serializer);
    this.module_name.serialize(serializer);
    this.name.serialize(serializer);
    serializeVector(this.type_args, serializer);
  }
  static deserialize(deserializer) {
    const address = AccountAddress.deserialize(deserializer);
    const moduleName = Identifier.deserialize(deserializer);
    const name = Identifier.deserialize(deserializer);
    const typeArgs = deserializeVector(deserializer, TypeTag);
    return new _StructTag(address, moduleName, name, typeArgs);
  }
};
var stringStructTag = new StructTag(
  AccountAddress.fromHex("0x1"),
  new Identifier("string"),
  new Identifier("String"),
  []
);
function optionStructTag(typeArg) {
  return new StructTag(AccountAddress.fromHex("0x1"), new Identifier("option"), new Identifier("Option"), [typeArg]);
}
function objectStructTag(typeArg) {
  return new StructTag(AccountAddress.fromHex("0x1"), new Identifier("object"), new Identifier("Object"), [typeArg]);
}
function bail(message) {
  throw new TypeTagParserError(message);
}
function isWhiteSpace(c) {
  if (c.match(/\s/)) {
    return true;
  }
  return false;
}
function isValidAlphabetic(c) {
  if (c.match(/[_A-Za-z0-9]/g)) {
    return true;
  }
  return false;
}
function isGeneric(c) {
  if (c.match(/T\d+/g)) {
    return true;
  }
  return false;
}
function nextToken(tagStr, pos) {
  const c = tagStr[pos];
  if (c === ":") {
    if (tagStr.slice(pos, pos + 2) === "::") {
      return [["COLON", "::"], 2];
    }
    bail("Unrecognized token.");
  } else if (c === "<") {
    return [["LT", "<"], 1];
  } else if (c === ">") {
    return [["GT", ">"], 1];
  } else if (c === ",") {
    return [["COMMA", ","], 1];
  } else if (isWhiteSpace(c)) {
    let res = "";
    for (let i = pos; i < tagStr.length; i += 1) {
      const char = tagStr[i];
      if (isWhiteSpace(char)) {
        res = `${res}${char}`;
      } else {
        break;
      }
    }
    return [["SPACE", res], res.length];
  } else if (isValidAlphabetic(c)) {
    let res = "";
    for (let i = pos; i < tagStr.length; i += 1) {
      const char = tagStr[i];
      if (isValidAlphabetic(char)) {
        res = `${res}${char}`;
      } else {
        break;
      }
    }
    if (isGeneric(res)) {
      return [["GENERIC", res], res.length];
    }
    return [["IDENT", res], res.length];
  }
  throw new Error("Unrecognized token.");
}
function tokenize(tagStr) {
  let pos = 0;
  const tokens = [];
  while (pos < tagStr.length) {
    const [token, size] = nextToken(tagStr, pos);
    if (token[0] !== "SPACE") {
      tokens.push(token);
    }
    pos += size;
  }
  return tokens;
}
var TypeTagParser = class _TypeTagParser {
  constructor(tagStr, typeTags) {
    this.typeTags = [];
    this.tokens = tokenize(tagStr);
    this.typeTags = typeTags || [];
  }
  consume(targetToken) {
    const token = this.tokens.shift();
    if (!token || token[1] !== targetToken) {
      bail("Invalid type tag.");
    }
  }
  /**
   * Consumes all of an unused generic field, mostly applicable to object
   *
   * Note: This is recursive.  it can be problematic if there's bad input
   * @private
   */
  consumeWholeGeneric() {
    this.consume("<");
    while (this.tokens[0][1] !== ">") {
      if (this.tokens[0][1] === "<") {
        this.consumeWholeGeneric();
      } else {
        this.tokens.shift();
      }
    }
    this.consume(">");
  }
  parseCommaList(endToken, allowTraillingComma) {
    const res = [];
    if (this.tokens.length <= 0) {
      bail("Invalid type tag.");
    }
    while (this.tokens[0][1] !== endToken) {
      res.push(this.parseTypeTag());
      if (this.tokens.length > 0 && this.tokens[0][1] === endToken) {
        break;
      }
      this.consume(",");
      if (this.tokens.length > 0 && this.tokens[0][1] === endToken && allowTraillingComma) {
        break;
      }
      if (this.tokens.length <= 0) {
        bail("Invalid type tag.");
      }
    }
    return res;
  }
  parseTypeTag() {
    if (this.tokens.length === 0) {
      bail("Invalid type tag.");
    }
    const [tokenTy, tokenVal] = this.tokens.shift();
    if (tokenVal === "u8") {
      return new TypeTagU8();
    }
    if (tokenVal === "u16") {
      return new TypeTagU16();
    }
    if (tokenVal === "u32") {
      return new TypeTagU32();
    }
    if (tokenVal === "u64") {
      return new TypeTagU64();
    }
    if (tokenVal === "u128") {
      return new TypeTagU128();
    }
    if (tokenVal === "u256") {
      return new TypeTagU256();
    }
    if (tokenVal === "bool") {
      return new TypeTagBool();
    }
    if (tokenVal === "address") {
      return new TypeTagAddress();
    }
    if (tokenVal === "vector") {
      this.consume("<");
      const res = this.parseTypeTag();
      this.consume(">");
      return new TypeTagVector(res);
    }
    if (tokenVal === "string") {
      return new TypeTagStruct(stringStructTag);
    }
    if (tokenTy === "IDENT" && (tokenVal.startsWith("0x") || tokenVal.startsWith("0X"))) {
      const address = AccountAddress.fromHex(tokenVal);
      this.consume("::");
      const [moduleTokenTy, module] = this.tokens.shift();
      if (moduleTokenTy !== "IDENT") {
        bail("Invalid type tag.");
      }
      this.consume("::");
      const [nameTokenTy, name] = this.tokens.shift();
      if (nameTokenTy !== "IDENT") {
        bail("Invalid type tag.");
      }
      if (AccountAddress.CORE_CODE_ADDRESS.toHexString() === address.toHexString() && module === "object" && name === "Object") {
        this.consumeWholeGeneric();
        return new TypeTagAddress();
      }
      let tyTags = [];
      if (this.tokens.length > 0 && this.tokens[0][1] === "<") {
        this.consume("<");
        tyTags = this.parseCommaList(">", true);
        this.consume(">");
      }
      const structTag = new StructTag(address, new Identifier(module), new Identifier(name), tyTags);
      return new TypeTagStruct(structTag);
    }
    if (tokenTy === "GENERIC") {
      if (this.typeTags.length === 0) {
        bail("Can't convert generic type since no typeTags were specified.");
      }
      const idx = parseInt(tokenVal.substring(1), 10);
      return new _TypeTagParser(this.typeTags[idx]).parseTypeTag();
    }
    throw new Error("Invalid type tag.");
  }
};
var TypeTagParserError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TypeTagParserError";
  }
};

// src/supra_types/transaction.ts
var RawTransaction = class _RawTransaction {
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
  constructor(sender, sequence_number, payload, max_gas_amount, gas_unit_price, expiration_timestamp_secs, chain_id) {
    this.sender = sender;
    this.sequence_number = sequence_number;
    this.payload = payload;
    this.max_gas_amount = max_gas_amount;
    this.gas_unit_price = gas_unit_price;
    this.expiration_timestamp_secs = expiration_timestamp_secs;
    this.chain_id = chain_id;
  }
  serialize(serializer) {
    this.sender.serialize(serializer);
    serializer.serializeU64(this.sequence_number);
    this.payload.serialize(serializer);
    serializer.serializeU64(this.max_gas_amount);
    serializer.serializeU64(this.gas_unit_price);
    serializer.serializeU64(this.expiration_timestamp_secs);
    this.chain_id.serialize(serializer);
  }
  static deserialize(deserializer) {
    const sender = AccountAddress.deserialize(deserializer);
    const sequence_number = deserializer.deserializeU64();
    const payload = TransactionPayload.deserialize(deserializer);
    const max_gas_amount = deserializer.deserializeU64();
    const gas_unit_price = deserializer.deserializeU64();
    const expiration_timestamp_secs = deserializer.deserializeU64();
    const chain_id = ChainId.deserialize(deserializer);
    return new _RawTransaction(
      sender,
      sequence_number,
      payload,
      max_gas_amount,
      gas_unit_price,
      expiration_timestamp_secs,
      chain_id
    );
  }
};
var Script = class _Script {
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
  constructor(code, ty_args, args) {
    this.code = code;
    this.ty_args = ty_args;
    this.args = args;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.code);
    serializeVector(this.ty_args, serializer);
    serializeVector(this.args, serializer);
  }
  static deserialize(deserializer) {
    const code = deserializer.deserializeBytes();
    const ty_args = deserializeVector(deserializer, TypeTag);
    const args = deserializeVector(deserializer, TransactionArgument);
    return new _Script(code, ty_args, args);
  }
};
var EntryFunction = class _EntryFunction {
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
  constructor(module_name, function_name, ty_args, args) {
    this.module_name = module_name;
    this.function_name = function_name;
    this.ty_args = ty_args;
    this.args = args;
  }
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
  static natural(module, func, ty_args, args) {
    return new _EntryFunction(
      ModuleId.fromStr(module),
      new Identifier(func),
      ty_args,
      args
    );
  }
  /**
   * `natual` is deprecated, please use `natural`
   *
   * @deprecated.
   */
  static natual(module, func, ty_args, args) {
    return _EntryFunction.natural(module, func, ty_args, args);
  }
  serialize(serializer) {
    this.module_name.serialize(serializer);
    this.function_name.serialize(serializer);
    serializeVector(this.ty_args, serializer);
    serializer.serializeU32AsUleb128(this.args.length);
    this.args.forEach((item) => {
      serializer.serializeBytes(item);
    });
  }
  static deserialize(deserializer) {
    const module_name = ModuleId.deserialize(deserializer);
    const function_name = Identifier.deserialize(deserializer);
    const ty_args = deserializeVector(deserializer, TypeTag);
    const length = deserializer.deserializeUleb128AsU32();
    const list = [];
    for (let i = 0; i < length; i += 1) {
      list.push(deserializer.deserializeBytes());
    }
    const args = list;
    return new _EntryFunction(module_name, function_name, ty_args, args);
  }
};
var MultiSigTransactionPayload = class _MultiSigTransactionPayload {
  /**
   * Contains the payload to run a multisig account transaction.
   * @param transaction_payload The payload of the multisig transaction. This can only be EntryFunction for now but
   * Script might be supported in the future.
   */
  constructor(transaction_payload) {
    this.transaction_payload = transaction_payload;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.transaction_payload.serialize(serializer);
  }
  static deserialize(deserializer) {
    deserializer.deserializeUleb128AsU32();
    return new _MultiSigTransactionPayload(
      EntryFunction.deserialize(deserializer)
    );
  }
};
var MultiSig = class _MultiSig {
  /**
   * Contains the payload to run a multisig account transaction.
   * @param multisig_address The multisig account address the transaction will be executed as.
   * @param transaction_payload The payload of the multisig transaction. This is optional when executing a multisig
   *  transaction whose payload is already stored on chain.
   */
  constructor(multisig_address, transaction_payload) {
    this.multisig_address = multisig_address;
    this.transaction_payload = transaction_payload;
  }
  serialize(serializer) {
    this.multisig_address.serialize(serializer);
    if (this.transaction_payload === void 0) {
      serializer.serializeBool(false);
    } else {
      serializer.serializeBool(true);
      this.transaction_payload.serialize(serializer);
    }
  }
  static deserialize(deserializer) {
    const multisig_address = AccountAddress.deserialize(deserializer);
    const payloadPresent = deserializer.deserializeBool();
    let transaction_payload;
    if (payloadPresent) {
      transaction_payload = MultiSigTransactionPayload.deserialize(deserializer);
    }
    return new _MultiSig(multisig_address, transaction_payload);
  }
};
var Module = class _Module {
  /**
   * Contains the bytecode of a Move module that can be published to the Supra chain.
   * @param code Move bytecode of a module.
   */
  constructor(code) {
    this.code = code;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.code);
  }
  static deserialize(deserializer) {
    const code = deserializer.deserializeBytes();
    return new _Module(code);
  }
};
var ModuleId = class _ModuleId {
  /**
   * Full name of a module.
   * @param address The account address.
   * @param name The name of the module under the account at "address".
   */
  constructor(address, name) {
    this.address = address;
    this.name = name;
  }
  /**
   * Converts a string literal to a ModuleId
   * @param moduleId String literal in format "AccountAddress::module_name", e.g. "0x1::coin"
   * @returns
   */
  static fromStr(moduleId) {
    const parts = moduleId.split("::");
    if (parts.length !== 2) {
      throw new Error("Invalid module id.");
    }
    return new _ModuleId(
      AccountAddress.fromHex(new HexString(parts[0])),
      new Identifier(parts[1])
    );
  }
  serialize(serializer) {
    this.address.serialize(serializer);
    this.name.serialize(serializer);
  }
  static deserialize(deserializer) {
    const address = AccountAddress.deserialize(deserializer);
    const name = Identifier.deserialize(deserializer);
    return new _ModuleId(address, name);
  }
};
var ChangeSet = class {
  serialize(serializer) {
    throw new Error("Not implemented.");
  }
  static deserialize(deserializer) {
    throw new Error("Not implemented.");
  }
};
var WriteSet = class {
  serialize(serializer) {
    throw new Error("Not implmented.");
  }
  static deserialize(deserializer) {
    throw new Error("Not implmented.");
  }
};
var SignedTransaction = class _SignedTransaction {
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
  constructor(raw_txn, authenticator) {
    this.raw_txn = raw_txn;
    this.authenticator = authenticator;
  }
  serialize(serializer) {
    this.raw_txn.serialize(serializer);
    this.authenticator.serialize(serializer);
  }
  static deserialize(deserializer) {
    const raw_txn = RawTransaction.deserialize(deserializer);
    const authenticator = TransactionAuthenticator.deserialize(deserializer);
    return new _SignedTransaction(raw_txn, authenticator);
  }
};
var RawTransactionWithData = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return MultiAgentRawTransaction.load(deserializer);
      case 1:
        return FeePayerRawTransaction.load(deserializer);
      default:
        throw new Error(
          `Unknown variant index for RawTransactionWithData: ${index}`
        );
    }
  }
};
var MultiAgentRawTransaction = class _MultiAgentRawTransaction extends RawTransactionWithData {
  constructor(raw_txn, secondary_signer_addresses) {
    super();
    this.raw_txn = raw_txn;
    this.secondary_signer_addresses = secondary_signer_addresses;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.raw_txn.serialize(serializer);
    serializeVector(
      this.secondary_signer_addresses,
      serializer
    );
  }
  static load(deserializer) {
    const rawTxn = RawTransaction.deserialize(deserializer);
    const secondarySignerAddresses = deserializeVector(
      deserializer,
      AccountAddress
    );
    return new _MultiAgentRawTransaction(rawTxn, secondarySignerAddresses);
  }
};
var FeePayerRawTransaction = class _FeePayerRawTransaction extends RawTransactionWithData {
  constructor(raw_txn, secondary_signer_addresses, fee_payer_address) {
    super();
    this.raw_txn = raw_txn;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.fee_payer_address = fee_payer_address;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    this.raw_txn.serialize(serializer);
    serializeVector(
      this.secondary_signer_addresses,
      serializer
    );
    this.fee_payer_address.serialize(serializer);
  }
  static load(deserializer) {
    const rawTxn = RawTransaction.deserialize(deserializer);
    const secondarySignerAddresses = deserializeVector(
      deserializer,
      AccountAddress
    );
    const feePayerAddress = AccountAddress.deserialize(deserializer);
    return new _FeePayerRawTransaction(
      rawTxn,
      secondarySignerAddresses,
      feePayerAddress
    );
  }
};
var TransactionPayload = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionPayloadScript.load(deserializer);
      case 2:
        return TransactionPayloadEntryFunction.load(deserializer);
      case 3:
        return TransactionPayloadMultisig.load(deserializer);
      case 4:
        return TransactionPayloadAutomationRegistration.load(deserializer);
      default:
        throw new Error(
          `Unknown variant index for TransactionPayload: ${index}`
        );
    }
  }
};
var TransactionPayloadScript = class _TransactionPayloadScript extends TransactionPayload {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = Script.deserialize(deserializer);
    return new _TransactionPayloadScript(value);
  }
};
var TransactionPayloadEntryFunction = class _TransactionPayloadEntryFunction extends TransactionPayload {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = EntryFunction.deserialize(deserializer);
    return new _TransactionPayloadEntryFunction(value);
  }
};
var TransactionPayloadMultisig = class _TransactionPayloadMultisig extends TransactionPayload {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = MultiSig.deserialize(deserializer);
    return new _TransactionPayloadMultisig(value);
  }
};
var TransactionPayloadAutomationRegistration = class _TransactionPayloadAutomationRegistration extends TransactionPayload {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(4);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = AutomationRegistrationParams.deserialize(deserializer);
    return new _TransactionPayloadAutomationRegistration(value);
  }
};
var AutomationRegistrationParams = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return AutomationRegistrationParamsV1.load(deserializer);
      default:
        throw new Error(
          `Unknown variant index for AutomationRegistrationParams: ${index}`
        );
    }
  }
};
var AutomationRegistrationParamsV1 = class _AutomationRegistrationParamsV1 extends AutomationRegistrationParams {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = AutomationRegistrationParamsV1Data.deserialize(deserializer);
    return new _AutomationRegistrationParamsV1(value);
  }
};
var AutomationRegistrationParamsV1Data = class _AutomationRegistrationParamsV1Data {
  constructor(automated_function, max_gas_amount, gas_price_cap, automation_fee_cap_for_epoch, expiration_timestamp_secs, aux_data) {
    this.automated_function = automated_function;
    this.max_gas_amount = max_gas_amount;
    this.gas_price_cap = gas_price_cap;
    this.automation_fee_cap_for_epoch = automation_fee_cap_for_epoch;
    this.expiration_timestamp_secs = expiration_timestamp_secs;
    this.aux_data = aux_data;
  }
  serialize(serializer) {
    this.automated_function.serialize(serializer);
    serializer.serializeU64(this.max_gas_amount);
    serializer.serializeU64(this.gas_price_cap);
    serializer.serializeU64(this.automation_fee_cap_for_epoch);
    serializer.serializeU64(this.expiration_timestamp_secs);
    serializeVectorOfBytes(this.aux_data, serializer);
  }
  static deserialize(deserializer) {
    const automated_function = EntryFunction.deserialize(deserializer);
    const max_gas_amount = deserializer.deserializeU64();
    const gas_price_cap = deserializer.deserializeU64();
    const automation_fee_cap_for_epoch = deserializer.deserializeU64();
    const expiration_timestamp_secs = deserializer.deserializeU64();
    const aux_data = deserializeVectorOfBytes(deserializer);
    return new _AutomationRegistrationParamsV1Data(
      automated_function,
      max_gas_amount,
      gas_price_cap,
      automation_fee_cap_for_epoch,
      expiration_timestamp_secs,
      aux_data
    );
  }
};
var ChainId = class _ChainId {
  constructor(value) {
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU8(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeU8();
    return new _ChainId(value);
  }
};
var TransactionArgument = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionArgumentU8.load(deserializer);
      case 1:
        return TransactionArgumentU64.load(deserializer);
      case 2:
        return TransactionArgumentU128.load(deserializer);
      case 3:
        return TransactionArgumentAddress.load(deserializer);
      case 4:
        return TransactionArgumentU8Vector.load(deserializer);
      case 5:
        return TransactionArgumentBool.load(deserializer);
      case 6:
        return TransactionArgumentU16.load(deserializer);
      case 7:
        return TransactionArgumentU32.load(deserializer);
      case 8:
        return TransactionArgumentU256.load(deserializer);
      default:
        throw new Error(
          `Unknown variant index for TransactionArgument: ${index}`
        );
    }
  }
};
var TransactionArgumentU8 = class _TransactionArgumentU8 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    serializer.serializeU8(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU8();
    return new _TransactionArgumentU8(value);
  }
};
var TransactionArgumentU16 = class _TransactionArgumentU16 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(6);
    serializer.serializeU16(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU16();
    return new _TransactionArgumentU16(value);
  }
};
var TransactionArgumentU32 = class _TransactionArgumentU32 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(7);
    serializer.serializeU32(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU32();
    return new _TransactionArgumentU32(value);
  }
};
var TransactionArgumentU64 = class _TransactionArgumentU64 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    serializer.serializeU64(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU64();
    return new _TransactionArgumentU64(value);
  }
};
var TransactionArgumentU128 = class _TransactionArgumentU128 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
    serializer.serializeU128(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU128();
    return new _TransactionArgumentU128(value);
  }
};
var TransactionArgumentU256 = class _TransactionArgumentU256 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(8);
    serializer.serializeU256(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU256();
    return new _TransactionArgumentU256(value);
  }
};
var TransactionArgumentAddress = class _TransactionArgumentAddress extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = AccountAddress.deserialize(deserializer);
    return new _TransactionArgumentAddress(value);
  }
};
var TransactionArgumentU8Vector = class _TransactionArgumentU8Vector extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(4);
    serializer.serializeBytes(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeBytes();
    return new _TransactionArgumentU8Vector(value);
  }
};
var TransactionArgumentBool = class _TransactionArgumentBool extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(5);
    serializer.serializeBool(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeBool();
    return new _TransactionArgumentBool(value);
  }
};
var Transaction = class {
  getHashSalt() {
    const hash = sha3Hash.create();
    hash.update("SUPRA::Transaction");
    return hash.digest();
  }
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return UserTransaction.load(deserializer);
      default:
        throw new Error(`Unknown variant index for Transaction: ${index}`);
    }
  }
};
var UserTransaction = class _UserTransaction extends Transaction {
  constructor(value) {
    super();
    this.value = value;
  }
  hash() {
    const hash = sha3Hash.create();
    hash.update(this.getHashSalt());
    hash.update(bcsToBytes(this));
    return hash.digest();
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    return new _UserTransaction(SignedTransaction.deserialize(deserializer));
  }
};

// src/supra_types/abi.ts
var TypeArgumentABI = class _TypeArgumentABI {
  /**
   * Constructs a TypeArgumentABI instance.
   * @param name
   */
  constructor(name) {
    this.name = name;
  }
  serialize(serializer) {
    serializer.serializeStr(this.name);
  }
  static deserialize(deserializer) {
    const name = deserializer.deserializeStr();
    return new _TypeArgumentABI(name);
  }
};
var ArgumentABI = class _ArgumentABI {
  /**
   * Constructs an ArgumentABI instance.
   * @param name
   * @param type_tag
   */
  constructor(name, type_tag) {
    this.name = name;
    this.type_tag = type_tag;
  }
  serialize(serializer) {
    serializer.serializeStr(this.name);
    this.type_tag.serialize(serializer);
  }
  static deserialize(deserializer) {
    const name = deserializer.deserializeStr();
    const typeTag = TypeTag.deserialize(deserializer);
    return new _ArgumentABI(name, typeTag);
  }
};
var ScriptABI = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionScriptABI.load(deserializer);
      case 1:
        return EntryFunctionABI.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
    }
  }
};
var TransactionScriptABI = class _TransactionScriptABI extends ScriptABI {
  /**
   * Constructs a TransactionScriptABI instance.
   * @param name Entry function name
   * @param doc
   * @param code
   * @param ty_args
   * @param args
   */
  constructor(name, doc, code, ty_args, args) {
    super();
    this.name = name;
    this.doc = doc;
    this.code = code;
    this.ty_args = ty_args;
    this.args = args;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    serializer.serializeStr(this.name);
    serializer.serializeStr(this.doc);
    serializer.serializeBytes(this.code);
    serializeVector(this.ty_args, serializer);
    serializeVector(this.args, serializer);
  }
  static load(deserializer) {
    const name = deserializer.deserializeStr();
    const doc = deserializer.deserializeStr();
    const code = deserializer.deserializeBytes();
    const tyArgs = deserializeVector(deserializer, TypeArgumentABI);
    const args = deserializeVector(deserializer, ArgumentABI);
    return new _TransactionScriptABI(name, doc, code, tyArgs, args);
  }
};
var EntryFunctionABI = class _EntryFunctionABI extends ScriptABI {
  /**
   * Constructs a EntryFunctionABI instance
   * @param name
   * @param module_name Fully qualified module id
   * @param doc
   * @param ty_args
   * @param args
   */
  constructor(name, module_name, doc, ty_args, args) {
    super();
    this.name = name;
    this.module_name = module_name;
    this.doc = doc;
    this.ty_args = ty_args;
    this.args = args;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    serializer.serializeStr(this.name);
    this.module_name.serialize(serializer);
    serializer.serializeStr(this.doc);
    serializeVector(this.ty_args, serializer);
    serializeVector(this.args, serializer);
  }
  static load(deserializer) {
    const name = deserializer.deserializeStr();
    const moduleName = ModuleId.deserialize(deserializer);
    const doc = deserializer.deserializeStr();
    const tyArgs = deserializeVector(deserializer, TypeArgumentABI);
    const args = deserializeVector(deserializer, ArgumentABI);
    return new _EntryFunctionABI(name, moduleName, doc, tyArgs, args);
  }
};

// src/supra_types/authentication_key.ts
import { sha3_256 as sha3Hash2 } from "@noble/hashes/sha3";
var _AuthenticationKey = class _AuthenticationKey {
  constructor(bytes) {
    if (bytes.length !== _AuthenticationKey.LENGTH) {
      throw new Error("Expected a byte array of length 32");
    }
    this.bytes = bytes;
  }
  /**
   * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
   * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
   * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
   */
  static fromMultiEd25519PublicKey(publicKey) {
    const pubKeyBytes = publicKey.toBytes();
    const bytes = new Uint8Array(pubKeyBytes.length + 1);
    bytes.set(pubKeyBytes);
    bytes.set([_AuthenticationKey.MULTI_ED25519_SCHEME], pubKeyBytes.length);
    const hash = sha3Hash2.create();
    hash.update(bytes);
    return new _AuthenticationKey(hash.digest());
  }
  static fromEd25519PublicKey(publicKey) {
    const pubKeyBytes = publicKey.value;
    const bytes = new Uint8Array(pubKeyBytes.length + 1);
    bytes.set(pubKeyBytes);
    bytes.set([_AuthenticationKey.ED25519_SCHEME], pubKeyBytes.length);
    const hash = sha3Hash2.create();
    hash.update(bytes);
    return new _AuthenticationKey(hash.digest());
  }
  /**
   * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
   * AuthenticationKey bytes are directly translated to AccountAddress.
   */
  derivedAddress() {
    return HexString.fromUint8Array(this.bytes);
  }
};
_AuthenticationKey.LENGTH = 32;
_AuthenticationKey.MULTI_ED25519_SCHEME = 1;
_AuthenticationKey.ED25519_SCHEME = 0;
_AuthenticationKey.DERIVE_RESOURCE_ACCOUNT_SCHEME = 255;
var AuthenticationKey = _AuthenticationKey;

// src/supra_types/rotation_proof_challenge.ts
var RotationProofChallenge = class {
  constructor(accountAddress, moduleName, structName, sequenceNumber, originator, currentAuthKey, newPublicKey) {
    this.accountAddress = accountAddress;
    this.moduleName = moduleName;
    this.structName = structName;
    this.sequenceNumber = sequenceNumber;
    this.originator = originator;
    this.currentAuthKey = currentAuthKey;
    this.newPublicKey = newPublicKey;
  }
  serialize(serializer) {
    this.accountAddress.serialize(serializer);
    serializer.serializeStr(this.moduleName);
    serializer.serializeStr(this.structName);
    serializer.serializeU64(this.sequenceNumber);
    this.originator.serialize(serializer);
    this.currentAuthKey.serialize(serializer);
    serializer.serializeBytes(this.newPublicKey);
  }
};

// src/account/supra_account.ts
var _SupraAccount = class _SupraAccount {
  static fromSupraAccountObject(obj) {
    return new _SupraAccount(HexString.ensure(obj.privateKeyHex).toUint8Array(), obj.address);
  }
  /**
   * Check's if the derive path is valid
   */
  static isValidPath(path) {
    return /^m\/44'\/637'\/[0-9]+'\/[0-9]+'\/[0-9]+'+$/.test(path);
  }
  /**
   * Creates new account with bip44 path and mnemonics,
   * @param path. (e.g. m/44'/637'/0'/0'/0')
   * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
   * @param mnemonics.
   * @returns SupraAccount
   */
  static fromDerivePath(path, mnemonics) {
    if (!_SupraAccount.isValidPath(path)) {
      throw new Error("Invalid derivation path");
    }
    const normalizeMnemonics = mnemonics.trim().split(/\s+/).map((part) => part.toLowerCase()).join(" ");
    const { key } = derivePath(path, bytesToHex2(bip39.mnemonicToSeedSync(normalizeMnemonics)));
    return new _SupraAccount(key);
  }
  /**
   * Creates new account instance. Constructor allows passing in an address,
   * to handle account key rotation, where auth_key != public_key
   * @param privateKeyBytes  Private key from which account key pair will be generated.
   * If not specified, new key pair is going to be created.
   * @param address Account address (e.g. 0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591).
   * If not specified, a new one will be generated from public key
   */
  constructor(privateKeyBytes, address) {
    if (privateKeyBytes) {
      this.signingKey = nacl2.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32));
    } else {
      this.signingKey = nacl2.sign.keyPair();
    }
    this.accountAddress = HexString.ensure(address || this.authKey().hex());
  }
  /**
   * This is the key by which Supra account is referenced.
   * It is the 32-byte of the SHA-3 256 cryptographic hash
   * of the public key(s) concatenated with a signature scheme identifier byte
   * @returns Address associated with the given account
   */
  address() {
    return this.accountAddress;
  }
  authKey() {
    const pubKey = new Ed25519PublicKey(this.signingKey.publicKey);
    const authKey = AuthenticationKey.fromEd25519PublicKey(pubKey);
    return authKey.derivedAddress();
  }
  /**
   * Takes source address and seeds and returns the resource account address
   * @param sourceAddress Address used to derive the resource account
   * @param seed The seed bytes
   * @returns The resource account address
   */
  static getResourceAccountAddress(sourceAddress, seed) {
    const source = bcsToBytes(AccountAddress.fromHex(sourceAddress));
    const bytes = new Uint8Array([...source, ...seed, AuthenticationKey.DERIVE_RESOURCE_ACCOUNT_SCHEME]);
    const hash = sha3Hash3.create();
    hash.update(bytes);
    return HexString.fromUint8Array(hash.digest());
  }
  /**
   * Takes creator address and collection name and returns the collection id hash.
   * Collection id hash are generated as sha256 hash of (`creator_address::collection_name`)
   *
   * @param creatorAddress Collection creator address
   * @param collectionName The collection name
   * @returns The collection id hash
   */
  static getCollectionID(creatorAddress, collectionName) {
    const seed = new TextEncoder().encode(`${creatorAddress}::${collectionName}`);
    const hash = sha256.create();
    hash.update(seed);
    return HexString.fromUint8Array(hash.digest());
  }
  /**
   * This key is generated with Ed25519 scheme.
   * Public key is used to check a signature of transaction, signed by given account
   * @returns The public key for the associated account
   */
  pubKey() {
    return HexString.fromUint8Array(this.signingKey.publicKey);
  }
  /**
   * Signs specified `buffer` with account's private key
   * @param buffer A buffer to sign
   * @returns A signature HexString
   */
  signBuffer(buffer) {
    const signature = nacl2.sign.detached(buffer, this.signingKey.secretKey);
    return HexString.fromUint8Array(signature);
  }
  /**
   * Signs specified `hexString` with account's private key
   * @param hexString A regular string or HexString to sign
   * @returns A signature HexString
   */
  signHexString(hexString) {
    const toSign = HexString.ensure(hexString).toUint8Array();
    return this.signBuffer(toSign);
  }
  /**
   * Verifies the signature of the message with the public key of the account
   * @param message a signed message
   * @param signature the signature of the message
   */
  verifySignature(message, signature) {
    const rawMessage = HexString.ensure(message).toUint8Array();
    const rawSignature = HexString.ensure(signature).toUint8Array();
    return nacl2.sign.detached.verify(rawMessage, rawSignature, this.signingKey.publicKey);
  }
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
  toPrivateKeyObject() {
    return {
      address: this.address().hex(),
      publicKeyHex: this.pubKey().hex(),
      privateKeyHex: HexString.fromUint8Array(this.signingKey.secretKey.slice(0, 32)).hex()
    };
  }
};
__decorateClass([
  Memoize()
], _SupraAccount.prototype, "authKey", 1);
var SupraAccount = _SupraAccount;
function getAddressFromAccountOrAddress(accountOrAddress) {
  return accountOrAddress instanceof SupraAccount ? accountOrAddress.address() : HexString.ensure(accountOrAddress);
}

// src/transaction_builder/builder.ts
import { sha3_256 as sha3Hash4 } from "@noble/hashes/sha3";

// src/transaction_builder/builder_utils.ts
function assertType(val, types, message) {
  if (!types?.includes(typeof val)) {
    throw new Error(
      message || `Invalid arg: ${val} type should be ${types instanceof Array ? types.join(" or ") : types}`
    );
  }
}
function ensureBoolean(val) {
  assertType(val, ["boolean", "string"]);
  if (typeof val === "boolean") {
    return val;
  }
  if (val === "true") {
    return true;
  }
  if (val === "false") {
    return false;
  }
  throw new Error("Invalid boolean string.");
}
function ensureNumber(val) {
  assertType(val, ["number", "string"]);
  if (typeof val === "number") {
    return val;
  }
  const res = Number.parseInt(val, 10);
  if (Number.isNaN(res)) {
    throw new Error("Invalid number string.");
  }
  return res;
}
function ensureBigInt(val) {
  assertType(val, ["number", "bigint", "string"]);
  return BigInt(val);
}
function serializeArg(argVal, argType, serializer) {
  serializeArgInner(argVal, argType, serializer, 0);
}
function serializeArgInner(argVal, argType, serializer, depth) {
  if (argType instanceof TypeTagBool) {
    serializer.serializeBool(ensureBoolean(argVal));
  } else if (argType instanceof TypeTagU8) {
    serializer.serializeU8(ensureNumber(argVal));
  } else if (argType instanceof TypeTagU16) {
    serializer.serializeU16(ensureNumber(argVal));
  } else if (argType instanceof TypeTagU32) {
    serializer.serializeU32(ensureNumber(argVal));
  } else if (argType instanceof TypeTagU64) {
    serializer.serializeU64(ensureBigInt(argVal));
  } else if (argType instanceof TypeTagU128) {
    serializer.serializeU128(ensureBigInt(argVal));
  } else if (argType instanceof TypeTagU256) {
    serializer.serializeU256(ensureBigInt(argVal));
  } else if (argType instanceof TypeTagAddress) {
    serializeAddress(argVal, serializer);
  } else if (argType instanceof TypeTagVector) {
    serializeVector2(argVal, argType, serializer, depth);
  } else if (argType instanceof TypeTagStruct) {
    serializeStruct(argVal, argType, serializer, depth);
  } else {
    throw new Error("Unsupported arg type.");
  }
}
function serializeAddress(argVal, serializer) {
  let addr;
  if (typeof argVal === "string" || argVal instanceof HexString) {
    addr = AccountAddress.fromHex(argVal);
  } else if (argVal instanceof AccountAddress) {
    addr = argVal;
  } else {
    throw new Error("Invalid account address.");
  }
  addr.serialize(serializer);
}
function serializeVector2(argVal, argType, serializer, depth) {
  if (argType.value instanceof TypeTagU8) {
    if (argVal instanceof Uint8Array) {
      serializer.serializeBytes(argVal);
      return;
    }
    if (argVal instanceof HexString) {
      serializer.serializeBytes(argVal.toUint8Array());
      return;
    }
    if (typeof argVal === "string") {
      serializer.serializeStr(argVal);
      return;
    }
  }
  if (!Array.isArray(argVal)) {
    throw new Error("Invalid vector args.");
  }
  serializer.serializeU32AsUleb128(argVal.length);
  argVal.forEach((arg) => serializeArgInner(arg, argType.value, serializer, depth + 1));
}
function serializeStruct(argVal, argType, serializer, depth) {
  const { address, module_name: moduleName, name, type_args: typeArgs } = argType.value;
  const structType = `${HexString.fromUint8Array(address.address).toShortString()}::${moduleName.value}::${name.value}`;
  if (structType === "0x1::string::String") {
    assertType(argVal, ["string"]);
    serializer.serializeStr(argVal);
  } else if (structType === "0x1::object::Object") {
    serializeAddress(argVal, serializer);
  } else if (structType === "0x1::option::Option") {
    if (typeArgs.length !== 1) {
      throw new Error(`Option has the wrong number of type arguments ${typeArgs.length}`);
    }
    serializeOption(argVal, typeArgs[0], serializer, depth);
  } else {
    throw new Error("Unsupported struct type in function argument");
  }
}
function serializeOption(argVal, argType, serializer, depth) {
  if (argVal === void 0 || argVal === null) {
    serializer.serializeU32AsUleb128(0);
  } else {
    serializer.serializeU32AsUleb128(1);
    serializeArgInner(argVal, argType, serializer, depth + 1);
  }
}
function argToTransactionArgument(argVal, argType) {
  if (argType instanceof TypeTagBool) {
    return new TransactionArgumentBool(ensureBoolean(argVal));
  }
  if (argType instanceof TypeTagU8) {
    return new TransactionArgumentU8(ensureNumber(argVal));
  }
  if (argType instanceof TypeTagU16) {
    return new TransactionArgumentU16(ensureNumber(argVal));
  }
  if (argType instanceof TypeTagU32) {
    return new TransactionArgumentU32(ensureNumber(argVal));
  }
  if (argType instanceof TypeTagU64) {
    return new TransactionArgumentU64(ensureBigInt(argVal));
  }
  if (argType instanceof TypeTagU128) {
    return new TransactionArgumentU128(ensureBigInt(argVal));
  }
  if (argType instanceof TypeTagU256) {
    return new TransactionArgumentU256(ensureBigInt(argVal));
  }
  if (argType instanceof TypeTagAddress) {
    let addr;
    if (typeof argVal === "string" || argVal instanceof HexString) {
      addr = AccountAddress.fromHex(argVal);
    } else if (argVal instanceof AccountAddress) {
      addr = argVal;
    } else {
      throw new Error("Invalid account address.");
    }
    return new TransactionArgumentAddress(addr);
  }
  if (argType instanceof TypeTagVector && argType.value instanceof TypeTagU8) {
    if (!(argVal instanceof Uint8Array)) {
      throw new Error(`${argVal} should be an instance of Uint8Array`);
    }
    return new TransactionArgumentU8Vector(argVal);
  }
  throw new Error("Unknown type for TransactionArgument.");
}

// src/transaction_builder/builder.ts
var RAW_TRANSACTION_SALT = "SUPRA::RawTransaction";
var RAW_TRANSACTION_WITH_DATA_SALT = "SUPRA::RawTransactionWithData";
var TransactionBuilder = class {
  constructor(signingFunction, rawTxnBuilder) {
    this.rawTxnBuilder = rawTxnBuilder;
    this.signingFunction = signingFunction;
  }
  /**
   * Builds a RawTransaction. Relays the call to TransactionBuilderABI.build
   * @param func
   * @param ty_tags
   * @param args
   */
  build(func, ty_tags, args) {
    if (!this.rawTxnBuilder) {
      throw new Error("this.rawTxnBuilder doesn't exist.");
    }
    return this.rawTxnBuilder.build(func, ty_tags, args);
  }
  /** Generates a Signing Message out of a raw transaction. */
  static getSigningMessage(rawTxn) {
    const hash = sha3Hash4.create();
    if (rawTxn instanceof RawTransaction) {
      hash.update(RAW_TRANSACTION_SALT);
    } else if (rawTxn instanceof MultiAgentRawTransaction) {
      hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
    } else if (rawTxn instanceof FeePayerRawTransaction) {
      hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
    } else {
      throw new Error("Unknown transaction type.");
    }
    const prefix = hash.digest();
    const body = bcsToBytes(rawTxn);
    const mergedArray = new Uint8Array(prefix.length + body.length);
    mergedArray.set(prefix);
    mergedArray.set(body, prefix.length);
    return mergedArray;
  }
};
var TransactionBuilderEd25519 = class extends TransactionBuilder {
  constructor(signingFunction, publicKey, rawTxnBuilder) {
    super(signingFunction, rawTxnBuilder);
    this.publicKey = publicKey;
  }
  rawToSigned(rawTxn) {
    const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
    const signature = this.signingFunction(signingMessage);
    const authenticator = new TransactionAuthenticatorEd25519(
      new Ed25519PublicKey(this.publicKey),
      signature
    );
    return new SignedTransaction(rawTxn, authenticator);
  }
  /** Signs a raw transaction and returns a bcs serialized transaction. */
  sign(rawTxn) {
    return bcsToBytes(this.rawToSigned(rawTxn));
  }
};
var TransactionBuilderMultiEd25519 = class extends TransactionBuilder {
  constructor(signingFunction, publicKey) {
    super(signingFunction);
    this.publicKey = publicKey;
  }
  rawToSigned(rawTxn) {
    const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
    const signature = this.signingFunction(signingMessage);
    const authenticator = new TransactionAuthenticatorMultiEd25519(this.publicKey, signature);
    return new SignedTransaction(rawTxn, authenticator);
  }
  /** Signs a raw transaction and returns a bcs serialized transaction. */
  sign(rawTxn) {
    return bcsToBytes(this.rawToSigned(rawTxn));
  }
};
var TransactionBuilderABI = class _TransactionBuilderABI {
  /**
   * Constructs a TransactionBuilderABI instance
   * @param abis List of binary ABIs.
   * @param builderConfig Configs for creating a raw transaction.
   */
  constructor(abis, builderConfig) {
    this.abiMap = /* @__PURE__ */ new Map();
    abis.forEach((abi) => {
      const deserializer = new Deserializer(abi);
      const scriptABI = ScriptABI.deserialize(deserializer);
      let k;
      if (scriptABI instanceof EntryFunctionABI) {
        const funcABI = scriptABI;
        const { address: addr, name: moduleName } = funcABI.module_name;
        k = `${HexString.fromUint8Array(addr.address).toShortString()}::${moduleName.value}::${funcABI.name}`;
      } else {
        const funcABI = scriptABI;
        k = funcABI.name;
      }
      if (this.abiMap.has(k)) {
        throw new Error("Found conflicting ABI interfaces");
      }
      this.abiMap.set(k, scriptABI);
    });
    this.builderConfig = {
      maxGasAmount: BigInt(DEFAULT_MAX_GAS_AMOUNT),
      expSecFromNow: DEFAULT_TXN_EXP_SEC_FROM_NOW,
      ...builderConfig
    };
  }
  static toBCSArgs(abiArgs, args) {
    if (abiArgs.length !== args.length) {
      throw new Error("Wrong number of args provided.");
    }
    return args.map((arg, i) => {
      const serializer = new Serializer();
      serializeArg(arg, abiArgs[i].type_tag, serializer);
      return serializer.getBytes();
    });
  }
  static toTransactionArguments(abiArgs, args) {
    if (abiArgs.length !== args.length) {
      throw new Error("Wrong number of args provided.");
    }
    return args.map((arg, i) => argToTransactionArgument(arg, abiArgs[i].type_tag));
  }
  setSequenceNumber(seqNumber) {
    this.builderConfig.sequenceNumber = BigInt(seqNumber);
  }
  /**
   * Builds a TransactionPayload. For dApps, chain ID and account sequence numbers are only known to the wallet.
   * Instead of building a RawTransaction (requires chainID and sequenceNumber), dApps can build a TransactionPayload
   * and pass the payload to the wallet for signing and sending.
   * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
   * @param ty_tags TypeTag strings
   * @param args Function arguments
   * @returns TransactionPayload
   */
  buildTransactionPayload(func, ty_tags, args) {
    const typeTags = ty_tags.map((ty_arg) => new TypeTagParser(ty_arg).parseTypeTag());
    let payload;
    if (!this.abiMap.has(func)) {
      throw new Error(`Cannot find function: ${func}`);
    }
    const scriptABI = this.abiMap.get(func);
    if (scriptABI instanceof EntryFunctionABI) {
      const funcABI = scriptABI;
      const bcsArgs = _TransactionBuilderABI.toBCSArgs(funcABI.args, args);
      payload = new TransactionPayloadEntryFunction(
        new EntryFunction(funcABI.module_name, new Identifier(funcABI.name), typeTags, bcsArgs)
      );
    } else if (scriptABI instanceof TransactionScriptABI) {
      const funcABI = scriptABI;
      const scriptArgs = _TransactionBuilderABI.toTransactionArguments(funcABI.args, args);
      payload = new TransactionPayloadScript(new Script(funcABI.code, typeTags, scriptArgs));
    } else {
      throw new Error("Unknown ABI format.");
    }
    return payload;
  }
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
  build(func, ty_tags, args) {
    const { sender, sequenceNumber, gasUnitPrice, maxGasAmount, expSecFromNow, chainId } = this.builderConfig;
    if (!gasUnitPrice) {
      throw new Error("No gasUnitPrice provided.");
    }
    const senderAccount = sender instanceof AccountAddress ? sender : AccountAddress.fromHex(sender);
    const expTimestampSec = BigInt(Math.floor(Date.now() / 1e3) + Number(expSecFromNow));
    const payload = this.buildTransactionPayload(func, ty_tags, args);
    if (payload) {
      return new RawTransaction(
        senderAccount,
        BigInt(sequenceNumber),
        payload,
        BigInt(maxGasAmount),
        BigInt(gasUnitPrice),
        expTimestampSec,
        new ChainId(Number(chainId))
      );
    }
    throw new Error("Invalid ABI.");
  }
};
var TransactionBuilderRemoteABI = class {
  // We don't want the builder to depend on the actual AptosClient. There might be circular dependencies.
  constructor(aptosClient, builderConfig) {
    this.aptosClient = aptosClient;
    this.builderConfig = builderConfig;
  }
  async fetchABI(addr) {
    const modules = await this.aptosClient.getAccountModules(addr);
    const abis = modules.map((module) => module.abi).flatMap(
      (abi) => abi.exposed_functions.filter((ef) => ef.is_entry).map(
        (ef) => ({
          fullName: `${abi.address}::${abi.name}::${ef.name}`,
          ...ef
        })
      )
    );
    const abiMap = /* @__PURE__ */ new Map();
    abis.forEach((abi) => {
      abiMap.set(abi.fullName, abi);
    });
    return abiMap;
  }
  /**
   * Builds a raw transaction. Only support script function a.k.a entry function payloads
   *
   * @param func fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer
   * @param ty_tags
   * @param args
   * @returns RawTransaction
   */
  async build(func, ty_tags, args) {
    const normlize = (s) => s.replace(/^0[xX]0*/g, "0x");
    func = normlize(func);
    const funcNameParts = func.split("::");
    if (funcNameParts.length !== 3) {
      throw new Error(
        // eslint-disable-next-line max-len
        "'func' needs to be a fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer"
      );
    }
    const [addr, module] = func.split("::");
    const abiMap = await this.fetchABI(addr);
    if (!abiMap.has(func)) {
      throw new Error(`${func} doesn't exist.`);
    }
    const funcAbi = abiMap.get(func);
    const abiArgs = funcAbi.params.filter((param) => param !== "signer" && param !== "&signer");
    const typeArgABIs = abiArgs.map(
      (abiArg, i) => new ArgumentABI(`var${i}`, new TypeTagParser(abiArg, ty_tags).parseTypeTag())
    );
    const entryFunctionABI = new EntryFunctionABI(
      funcAbi.name,
      ModuleId.fromStr(`${addr}::${module}`),
      "",
      // Doc string
      funcAbi.generic_type_params.map((_, i) => new TypeArgumentABI(`${i}`)),
      typeArgABIs
    );
    const { sender, ...rest } = this.builderConfig;
    const senderAddress = sender instanceof AccountAddress ? HexString.fromUint8Array(sender.address) : sender;
    const [{ sequence_number: sequenceNumber }, chainId, { gas_estimate: gasUnitPrice }] = await Promise.all([
      rest?.sequenceNumber ? Promise.resolve({ sequence_number: rest?.sequenceNumber }) : this.aptosClient.getAccount(senderAddress),
      rest?.chainId ? Promise.resolve(rest?.chainId) : this.aptosClient.getChainId(),
      rest?.gasUnitPrice ? Promise.resolve({ gas_estimate: rest?.gasUnitPrice }) : this.aptosClient.estimateGasPrice()
    ]);
    const builderABI = new TransactionBuilderABI([bcsToBytes(entryFunctionABI)], {
      sender,
      sequenceNumber,
      chainId,
      gasUnitPrice: BigInt(gasUnitPrice),
      ...rest
    });
    return builderABI.build(func, ty_tags, args);
  }
};
__decorateClass([
  MemoizeExpiring(10 * 60 * 1e3)
], TransactionBuilderRemoteABI.prototype, "fetchABI", 1);

// src/generated/index.ts
var generated_exports = {};
__export(generated_exports, {
  AptosErrorCode: () => AptosErrorCode,
  MoveFunctionVisibility: () => MoveFunctionVisibility,
  RoleType: () => RoleType
});

// src/generated/models/AptosErrorCode.ts
var AptosErrorCode = /* @__PURE__ */ ((AptosErrorCode2) => {
  AptosErrorCode2["ACCOUNT_NOT_FOUND"] = "account_not_found";
  AptosErrorCode2["RESOURCE_NOT_FOUND"] = "resource_not_found";
  AptosErrorCode2["MODULE_NOT_FOUND"] = "module_not_found";
  AptosErrorCode2["STRUCT_FIELD_NOT_FOUND"] = "struct_field_not_found";
  AptosErrorCode2["VERSION_NOT_FOUND"] = "version_not_found";
  AptosErrorCode2["TRANSACTION_NOT_FOUND"] = "transaction_not_found";
  AptosErrorCode2["TABLE_ITEM_NOT_FOUND"] = "table_item_not_found";
  AptosErrorCode2["BLOCK_NOT_FOUND"] = "block_not_found";
  AptosErrorCode2["STATE_VALUE_NOT_FOUND"] = "state_value_not_found";
  AptosErrorCode2["VERSION_PRUNED"] = "version_pruned";
  AptosErrorCode2["BLOCK_PRUNED"] = "block_pruned";
  AptosErrorCode2["INVALID_INPUT"] = "invalid_input";
  AptosErrorCode2["INVALID_TRANSACTION_UPDATE"] = "invalid_transaction_update";
  AptosErrorCode2["SEQUENCE_NUMBER_TOO_OLD"] = "sequence_number_too_old";
  AptosErrorCode2["VM_ERROR"] = "vm_error";
  AptosErrorCode2["HEALTH_CHECK_FAILED"] = "health_check_failed";
  AptosErrorCode2["MEMPOOL_IS_FULL"] = "mempool_is_full";
  AptosErrorCode2["INTERNAL_ERROR"] = "internal_error";
  AptosErrorCode2["WEB_FRAMEWORK_ERROR"] = "web_framework_error";
  AptosErrorCode2["BCS_NOT_SUPPORTED"] = "bcs_not_supported";
  AptosErrorCode2["API_DISABLED"] = "api_disabled";
  return AptosErrorCode2;
})(AptosErrorCode || {});

// src/generated/models/MoveFunctionVisibility.ts
var MoveFunctionVisibility = /* @__PURE__ */ ((MoveFunctionVisibility2) => {
  MoveFunctionVisibility2["PRIVATE"] = "private";
  MoveFunctionVisibility2["PUBLIC"] = "public";
  MoveFunctionVisibility2["FRIEND"] = "friend";
  return MoveFunctionVisibility2;
})(MoveFunctionVisibility || {});

// src/generated/models/RoleType.ts
var RoleType = /* @__PURE__ */ ((RoleType2) => {
  RoleType2["VALIDATOR"] = "validator";
  RoleType2["FULL_NODE"] = "full_node";
  return RoleType2;
})(RoleType || {});
export {
  bcs_exports as BCS,
  CKDPriv,
  HexString,
  SupraAccount,
  TransactionBuilder,
  TransactionBuilderABI,
  TransactionBuilderEd25519,
  TransactionBuilderMultiEd25519,
  TransactionBuilderRemoteABI,
  supra_types_exports as TxnBuilderTypes,
  TypeTagParser,
  generated_exports as Types,
  argToTransactionArgument,
  derivePath,
  ensureBigInt,
  ensureBoolean,
  ensureNumber,
  getAddressFromAccountOrAddress,
  getMasterKeyFromSeed,
  getPublicKey,
  isValidPath,
  serializeArg
};
//# sourceMappingURL=index.mjs.map