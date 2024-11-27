// src/utils.ts
import algosdk from 'algosdk';
import { randomStringForEntropy } from '@stablelib/random';
import type { SiwaMessage } from './client';

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
 * Verifies a signature against a message using an Algorand public key.
 * @param message The EIP-4361 original message that was signed.
 * @param address The Algorand public address.
 * @param signature The signature in base64 format.
 * @param nfd The Domain Name for address resolution (optional).
 * @returns {Promise<boolean>} Checks for the Algorand address (if it exists) if
 * the signature is valid for given address.
 */

export const verifySignature = async (
  message: SiwaMessage,
  address: string,
  signature: string,
  nfd?: string,
): Promise<boolean> => {

  const hashedMessage = new Uint8Array(
    Buffer.from(JSON.stringify(message.prepareMessage()))
  );
  const signatureUint8Array = Uint8Array.from(
    atob(signature)
      .split('')
      .map((char) => char.charCodeAt(0))
  );

  if (nfd !== "undefined") {
    if (!validateNFDAddress(address, nfd)) {
      console.log('NFD validation failed');
      return false
    }
  }

  try {
    const isValid = algosdk.verifyBytes(
      new Uint8Array(Buffer.from(hashedMessage)),
      signatureUint8Array,
      address
    );

    console.log('Verification result:', isValid);
    return isValid; // Returns true or false based on the signature verification
  } catch (error) {
    console.error('Verification failed:', error);
    return false;
  }
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
