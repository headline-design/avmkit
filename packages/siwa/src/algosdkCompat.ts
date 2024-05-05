import {
  verifyBytes as algosdkVerifyMessage,
  encodeUnsignedTransaction as algosdkHashMessage,
  isValidAddress as algosdkGetAddress,
} from 'algosdk';

import algosdk from 'algosdk';

type Algosdk6BigNumberish = string | number | bigint;

// NB: This compatibility type omits the `Signature` class defined in algosdk;
// however, a `Signature` instance is compatible with the object type defined.
type Algosdk6SignatureLike =
  | string
  | {
      r: string;
      s: string;
      v: Algosdk6BigNumberish;
      yParity?: 0 | 1;
      yParityAndS?: string;
    }
  | {
      r: string;
      yParityAndS: string;
      yParity?: 0 | 1;
      s?: string;
      v?: number;
    }
  | {
      r: string;
      s: string;
      yParity: 0 | 1;
      v?: Algosdk6BigNumberish;
      yParityAndS?: string;
    };

export const verifyMessage =
  algosdk?.verifyBytes ??
  (algosdkVerifyMessage as unknown as (
    message: string | Uint8Array,
    sig: Algosdk6SignatureLike
  ) => string);

export const hashMessage =
  algosdk.encodeUnsignedTransaction ??
  (algosdkHashMessage as unknown as (message: Uint8Array | string) => string);

export const getAddress =
  algosdk.isValidAddress ??
  (algosdkGetAddress as unknown as (address: string | any) => string | any);
