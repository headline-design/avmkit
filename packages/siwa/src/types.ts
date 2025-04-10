import { SiwaMessage } from './client';

/**
 * Serializes a SiwaMessage object into a string suitable for signing and verifying.
 * @param message SiwaMessage object
 * @returns Serialized string representation of the message.
 */
export const serializeMessage = (message: SiwaMessage): string => {
  return `Message:
      Domain: ${message.domain}
      Scheme: ${message.scheme}
      Address: ${message.address}
      URI: ${message.uri}
      Statement: ${message.statement}
      Version: ${message.version}
      Nonce: ${message.nonce}`;
};

export interface VerifyParams {
  /** Signature of the message signed by the wallet */
  signature: string;

  /** Address of the wallet that signed the message */
  address?: string;

  /** RFC 4501 dns authority that is requesting the signing. */
  domain?: string;

  /** Randomized token used to prevent replay attacks, at least 8 alphanumeric characters. */
  nonce?: string;

  /**ISO 8601 datetime string of the current time. */
  time?: string;

  scheme?: string;

  /** Encoded transaction for signTransaction providers */
  encodedTransaction?: string;

  /** NFD for address resolution. */
  nfd?: string;
}

export const VerifyParamsKeys: Array<keyof VerifyParams> = [
  'signature',
  'address',
  'nfd',
  'encodedTransaction',
  'domain',
  'scheme',
  'nonce',
  'time',
];

export interface VerifyOpts {
  /** If the library should reject promises on errors, defaults to false */
  suppressExceptions?: boolean;

  /** Enables a custom verification function that will be ran alongside EIP-1271 check. */
  verificationFallback?: (
    params: VerifyParams,
    opts: VerifyOpts,
    message: SiwaMessage,
    EIP1271Promise: Promise<SiwaResponse>
  ) => Promise<SiwaResponse>;
}

export const VerifyOptsKeys: Array<keyof VerifyOpts> = [
  'suppressExceptions',
  'verificationFallback',
];

/**
 * Returned on verifications.
 */
export interface SiwaResponse {
  /** Boolean representing if the message was verified with success. */
  success: boolean;

  /** If present `success` MUST be false and will provide extra information on the failure reason. */
  error?: SiwaError;

  /** Original message that was verified. */
  data: SiwaMessage;
}

/**
 * Interface used to return errors in SiwaResponses.
 */
export class SiwaError {
  constructor(
    type: SiwaErrorType | string,
    expected?: string,
    received?: string
  ) {
    this.type = type;
    this.expected = expected;
    this.received = received;
  }

  /** Type of the error. */
  type: SiwaErrorType | string;

  /** Expected value or condition to pass. */
  expected?: string;

  /** Received value that caused the failure. */
  received?: string;
}

/**
 * Possible message error types.
 */
export enum SiwaErrorType {
  /** `expirationTime` is present and in the past. */
  EXPIRED_MESSAGE = 'Expired message.',

  /** `domain` is not a valid authority or is empty. */
  INVALID_DOMAIN = 'Invalid domain.',

  /** `domain` don't match the domain provided for verification. */
  DOMAIN_MISMATCH = 'Domain does not match provided domain for verification.',

  /** `nonce` don't match the nonce provided for verification. */
  NONCE_MISMATCH = 'Nonce does not match provided nonce for verification.',

  /** `address` is not a valid address. */
  INVALID_ADDRESS = 'Invalid address.',

  /** `address` does not match resolved NFD owner address. */
  ADDRESS_MISMATCH = 'Address does not match resolved NFD owner address.',

  /** `uri` does not conform to RFC 3986. */
  INVALID_URI = 'URI does not conform to RFC 3986.',

  /** `nonce` is smaller then 8 characters or is not alphanumeric */
  INVALID_NONCE = 'Nonce size smaller then 8 characters or is not alphanumeric.',

  /** `notBefore` is present and in the future. */
  NOT_YET_VALID_MESSAGE = 'Message is not valid yet.',

  /** Signature doesn't match the address of the message. */
  INVALID_SIGNATURE = 'Signature does not match address of the message.',

  /** `expirationTime`, `notBefore` or `issuedAt` not complient to ISO-8601. */
  INVALID_TIME_FORMAT = 'Invalid time format.',

  /** `version` is not 1. */
  INVALID_MESSAGE_VERSION = 'Invalid message version.',

  /** Thrown when some required field is missing. */
  UNABLE_TO_PARSE = 'Unable to parse the message.',

  /** `scheme` is not present or is not a valid scheme. */
  SCHEME_MISMATCH = 'Scheme does not match the expected scheme.',
}
