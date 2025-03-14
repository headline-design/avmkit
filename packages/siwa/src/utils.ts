// src/utils.ts
import algosdk from 'algosdk';
import { randomStringForEntropy } from '@stablelib/random';
import type { SiwaMessage } from './client';
import { verifySignedTransaction } from './aux-utils';

/**
 * Signs a message using an Algorand private key.
 * @param message The message to be signed.
 * @param privateKey The Algorand private key in base64 format.
 * @returns The signature in base64 format.
 */
export const signMessage = async (
  message: string,
  privateKey: string
): Promise<string> => {
  const decodedPrivateKey = algosdk.mnemonicToSecretKey(privateKey).sk;
  const binaryMessage = new TextEncoder().encode(message);
  const signature = algosdk.signBytes(binaryMessage, decodedPrivateKey);
  return Buffer.from(signature).toString('base64');
};

const ISO8601 =
  /^(?<date>[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(.[0-9]+)?(([Zz])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;


/**
 * Verifies a signature against a message or transaction.
 * @param message The SIWA message.
 * @param signature The signature in base64 format.
 * @param provider The Algorand wallet used for signing.
 * @param encodedTransaction The encoded transaction in Base64 format.
 * @param nfd The optional NFD domain for address resolution.
 * @returns True if the signature is valid, otherwise false.
 */
export const verifySignature = async (
  message: SiwaMessage,
  signature: string,
  provider: string,
  encodedTransaction?: string,
  nfd?: string
): Promise<boolean> => {
  // Prepare hashed message bytes for Kibisis
  const hashedMessage = new Uint8Array(Buffer.from(JSON.stringify(message.prepareMessage())));

  // Decode the signature from base64 to Uint8Array
  const signatureUint8Array = Uint8Array.from(atob(signature).split("").map((char) => char.charCodeAt(0)));

  // Optional NFD validation
  if (nfd && !(await validateNFDAddress(message.address, nfd))) {
    return false; // Direct return on failure
  }

  // Handle provider-specific verification
  if (provider === "Kibisis") {
    try {
      const isValid = algosdk.verifyBytes(hashedMessage, signatureUint8Array, message.address);
      return isValid; // Return isValid (boolean) in Kibisis
    } catch (error) {
      return false; // Return false if verification fails
    }
  }

  if (provider === "Lute" || provider === "Defly" || provider === "Pera") {
    if (!encodedTransaction) {
      return false; // Return false if no encodedTransaction is provided
    }

    try {
      const packTransaction = Buffer.from(encodedTransaction, "base64");
      const decodedTransaction = algosdk.decodeSignedTransaction(packTransaction);
      const transactionResult = verifySignedTransaction(decodedTransaction);
      if (!transactionResult) {
        return false; // Return false if verification fails
      }

      const { isValid: isTransactionValid, signature: txnSignature } = transactionResult;
      // Check if the transaction signature matches the provided signature

      const isSignatureValid = txnSignature === signature; // Compare the signatures
      const isValid = isTransactionValid && isSignatureValid; // Combine the results

      return isValid;
    } catch (error) {
      return false; // Return false if verification fails
    }
  }

  return false; // Return false if the provider is not recognized
};


/**
 * This method leverages a native CSPRNG with support for both browser and Node.js
 * environments in order generate a cryptographically secure nonce for use in the
 * SiwaMessage in order to prevent replay attacks.
 *
 * 96 bits has been chosen as a number to sufficiently balance size and security considerations
 * relative to the lifespan of it's usage.
 *
 * @returns cryptographically generated random nonce with 96 bits of entropy encoded with
 * an alphanumeric character set.
 */
export const generateNonce = (): string => {
  const nonce = randomStringForEntropy(96);
  if (!nonce || nonce.length < 8) {
    throw new Error('Error during nonce creation.');
  }
  return nonce;
};

/**
 * This method matches the given date string against the ISO-8601 regex and also
 * performs checks if it's a valid date.
 * @param inputDate any string to be validated against ISO-8601
 * @returns boolean indicating if the providade date is valid and conformant to ISO-8601
 */
export const isValidISO8601Date = (inputDate: string): boolean => {
  /* Split groups and make sure inputDate is in ISO8601 format */
  const inputMatch = ISO8601.exec(inputDate);

  /* if inputMatch is null the date is not ISO-8601 */
  if (!inputDate) {
    return false;
  }

  /* Creates a date object with input date to parse for invalid days e.g. Feb, 30 -> Mar, 01 */
  const inputDateParsed = new Date(inputMatch.groups.date).toISOString();

  /* Get groups from new parsed date to compare with the original input */
  const parsedInputMatch = ISO8601.exec(inputDateParsed);

  /* Compare remaining fields */
  return inputMatch.groups.date === parsedInputMatch.groups.date;
};

export const checkInvalidKeys = <T>(
  obj: T,
  keys: Array<keyof T>
): Array<keyof T> => {
  const invalidKeys: Array<keyof T> = [];
  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key as keyof T)) {
      invalidKeys.push(key as keyof T);
    }
  });
  return invalidKeys;
};

export const validateNFDAddress = async (address: string, nfd: string): Promise<boolean> => {
  const nfdAddress = await resolveNFDToAddress(nfd);

  if (!nfdAddress) {
    console.log('NFD not found');
    return false;
  }
  return nfdAddress === address;
}

export const resolveAddressToNFD = async (address: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.nf.domains/nfd/lookup?address=${address}`,
      {
        method: "GET",
        headers: {},
      }
    );

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      return null; // Explicitly return null on HTTP error
    }

    const data = await response.json();

    // Check if data is not empty and has at least one key
    if (data && Object.keys(data).length > 0) {
      // Extract the first key of the data object
      const key = Object.keys(data)[0];

      // Check if the nested object has the name property
      if (data[key] && data[key].name) {
        const { name } = data[key];
        return name;
      } else {
        console.log("Name property not found in the response.");
      }
    } else {
      console.log("Response data is empty or malformed.");
    }
  } catch (error) {
    console.log("Error resolving address to NFD:", error);
  }
  return null; // Return null in case of any errors or unexpected data
};


export const resolveNFDToAddress = async (nfd: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.nf.domains/nfd/${nfd}`, {
      method: 'GET',
      headers: {},
    });

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      return null; // Explicitly return null on HTTP error
    }

    const data = await response.json();

    // Check if data is not empty and has the expected structure
    if (data && data.owner) {
      // Extract the owner property from the first result
      const owner = data.owner;

      if (owner) {
        return owner;
      } else {
        console.log("Owner property not found in the response.");
      }
    } else {
      console.log("Response data is empty or malformed.");
    }
  } catch (error) {
    console.error("Error resolving NFD to address:", error);
  }
  return null; // Return null in case of any errors
};

/**
 * Shape of the NFD record returned by the "lookup" endpoint.
 */
export interface NFDRecord {
  appID?: number;
  name?: string;
  owner?: string;
  properties?: {
    verified?: Record<string, any>;
    userDefined?: Record<string, any>;
    [key: string]: any;
  };
  [key: string]: any; // The NFD response can have many other fields
}

/**
 * Resolves an Algorand address to its full NFD record (if any).
 * If not found or on error, returns null.
 *
 * @param address The Algorand address to look up
 * @returns A full NFD record object or null if none found
 */
export const resolveAddressToFullNFD = async (
  address: string
): Promise<NFDRecord | null> => {
  try {
    const response = await fetch(
      `https://api.nf.domains/nfd/lookup?address=${address}`,
      {
        method: 'GET',
        headers: {},
      }
    );

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    // Data is keyed by address, e.g.: { "<address>": {...} }
    const keys = Object.keys(data);

    if (keys.length === 0) {
      console.log('NFD record not found or response malformed.');
      return null;
    }

    // We only asked for one address, so let's just read the first key
    const record = data[keys[0]];

    // Return the entire record object as is
    if (record && typeof record === 'object') {
      return record as NFDRecord;
    }

    return null;
  } catch (error) {
    console.error('Error resolving full NFD record:', error);
    return null;
  }
};



