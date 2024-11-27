
import * as uri from 'valid-url';

import {
  SiwaError,
  SiwaErrorType,
  SiwaResponse,
  VerifyOpts,
  VerifyOptsKeys,
  VerifyParams,
  VerifyParamsKeys,
} from './types';
import {
  verifySignature,
  generateNonce,
  checkInvalidKeys,
  isValidISO8601Date,
} from './utils';
import { ParsedMessage } from './parsers';
import { parseIntegerNumber } from './aux-utils';

export class SiwaMessage {
  /**RFC 3986 URI scheme for the authority that is requesting the signing. */
  scheme?: string;
  /**RFC 4501 dns authority that is requesting the signing. */
  domain: string;
  /**Algorand address performing the signing conformant to capitalization */
  address: string;
  /**Human-readable ASCII assertion that the user will sign, and it must not
   * contain `\n`. */
  statement?: string;
  /**RFC 3986 URI referring to the resource that is the subject of the signing
   *  (as in the __subject__ of a claim). */
  uri: string;
  /**Current version of the message. */
  version: string;
  /**EIP-155 Chain ID to which the session is bound, and the network where
   * Contract Accounts must be resolved. */
  chainId: number;
  /**Randomized token used to prevent replay attacks, at least 8 alphanumeric
   * characters. */
  nonce: string;
  /**ISO 8601 datetime string of the current time. */
  issuedAt?: string;
  /**ISO 8601 datetime string that, if present, indicates when the signed
   * authentication message is no longer valid. */
  expirationTime?: string;
  /**ISO 8601 datetime string that, if present, indicates when the signed
   * authentication message will become valid. */
  notBefore?: string;
  /**System-specific identifier that may be used to uniquely refer to the
   * sign-in request. */
  requestId?: string;
  /**List of information or references to information the user wishes to have
   * resolved as part of authentication by the relying party. They are
   * expressed as RFC 3986 URIs separated by `\n- `. */
  resources?: Array<string>;

  /**
   * Creates a parsed Sign-In with Algorand Message (EIP-4361) object from a
   * string or an object. If a string is used an ABNF parser is called to
   * validate the parameter, otherwise the fields are attributed.
   * @param param {string | SiwaMessage} Sign message as a string or an object.
   */
  constructor(param: string | Partial<SiwaMessage>) {
    if (typeof param === 'string') {
      const parsedMessage = new ParsedMessage(param);
      this.domain = parsedMessage.domain;
      this.address = parsedMessage.address;
      this.statement = parsedMessage.statement;
      this.uri = parsedMessage.uri;
      this.version = parsedMessage.version;
      this.nonce = parsedMessage.nonce;
      this.issuedAt = parsedMessage.issuedAt;
      this.expirationTime = parsedMessage.expirationTime;
      this.notBefore = parsedMessage.notBefore;
      this.requestId = parsedMessage.requestId;
      this.chainId = parsedMessage.chainId;
      this.resources = parsedMessage.resources;
    } else {
      this.scheme = param?.scheme;
      this.domain = param.domain;
      this.address = param.address;
      this.statement = param?.statement;
      this.uri = param.uri;
      this.version = param.version;
      this.chainId = param.chainId;
      this.nonce = param.nonce;
      this.issuedAt = param?.issuedAt;
      this.expirationTime = param?.expirationTime;
      this.notBefore = param?.notBefore;
      this.requestId = param?.requestId;
      this.resources = param?.resources;
      if (typeof this.chainId === 'string') {
        this.chainId = parseIntegerNumber(this.chainId);
      }
    }
    this.nonce = this.nonce || generateNonce();
    this.validateMessage();
  }

  /**
   * This function can be used to retrieve an EIP-4361 formated message for
   * signature, although you can call it directly it's advised to use
   * [prepareMessage()] instead which will resolve to the correct method based
   * on the [type] attribute of this object, in case of other formats being
   * implemented.
   * @returns {string} EIP-4361 formated message, ready for EIP-191 signing.
   */
  toMessage(): string {
    /** Validates all fields of the object */
    this.validateMessage();
    const headerPrefx = this.scheme ? `${this.scheme}://${this.domain}` : this.domain;
    const header = `${headerPrefx} wants you to sign in with your Algorand account:`;
    const uriField = `URI: ${this.uri}`;
    let prefix = [header, this.address].join('\n');
    const versionField = `Version: ${this.version}`;

    if (!this.nonce) {
      this.nonce = generateNonce();
    }

    const chainField = `Chain ID: ` + this.chainId || '1';

    const nonceField = `Nonce: ${this.nonce}`;

    const suffixArray = [uriField, versionField, chainField, nonceField];

    this.issuedAt = this.issuedAt || new Date().toISOString();

    suffixArray.push(`Issued At: ${this.issuedAt}`);

    if (this.expirationTime) {
      const expiryField = `Expiration Time: ${this.expirationTime}`;

      suffixArray.push(expiryField);
    }

    if (this.notBefore) {
      suffixArray.push(`Not Before: ${this.notBefore}`);
    }

    if (this.requestId) {
      suffixArray.push(`Request ID: ${this.requestId}`);
    }

    if (this.resources) {
      suffixArray.push(
        [`Resources:`, ...this.resources.map(x => `- ${x}`)].join('\n')
      );
    }

    const suffix = suffixArray.join('\n');
    prefix = [prefix, this.statement].join('\n\n');
    if (this.statement) {
      prefix += '\n';
    }
    return [prefix, suffix].join('\n');
  }

  /**
   * This method parses all the fields in the object and creates a messaging for signing
   * message according with the type defined.
   * @returns {string} Returns a message ready to be signed according with the
   * type defined in the object.
   */
  prepareMessage(): string {
    let message: string;
    switch (this.version) {
      case '1': {
        message = this.toMessage();
        break;
      }

      default: {
        message = this.toMessage();
        break;
      }
    }
    return message;
  }

  /**
   * @deprecated
   * Verifies the integrity of the object by matching its signature.
   * @param signature Signature to match the address in the message.
   * @param provider Wallet provider to be used for validation
   */
  async validate(signature: string) {
    console.warn(
      'validate() has been deprecated, please update your code to use verify(). validate() may be removed in future versions.'
    );
    return this.verify({ signature }, { suppressExceptions: false })
      .then(({ data }) => data)
      .catch(({ error }) => {
        throw error;
      });
  }

  /**
   * Verifies the integrity of the object by matching its signature.
   * @param params Parameters to verify the integrity of the message, signature is required.
   * @returns {Promise<SiwaMessage>} This object if valid.
   */
  async verify(
    params: VerifyParams,
    opts: VerifyOpts = { suppressExceptions: false },
  ): Promise<SiwaResponse> {
    return new Promise<SiwaResponse>((resolve, reject) => {
      const fail = (result) => {
        //console.log('---result at 212', result);
        if (opts.suppressExceptions) {
          return resolve(result);
        } else {
          return reject(result);
        }
      };

      const invalidParams: Array<keyof VerifyParams> =
        checkInvalidKeys<VerifyParams>(params, VerifyParamsKeys);
      if (invalidParams.length > 0) {
        fail({
          success: false,
          data: this,
          error: new Error(
            `${invalidParams.join(
              ', '
            )} is/are not valid key(s) for VerifyParams.`
          ),
        });
      }

      const invalidOpts: Array<keyof VerifyOpts> = checkInvalidKeys<VerifyOpts>(
        opts,
        VerifyOptsKeys
      );
      if (invalidParams.length > 0) {
        fail({
          success: false,
          data: this,
          error: new Error(
            `${invalidOpts.join(', ')} is/are not valid key(s) for VerifyOpts.`
          ),
        });
      }

      const { signature, address, scheme, domain, nonce, time, nfd, provider, encodedTransaction } = params;



      /** Scheme for domain binding */
      if (scheme && scheme !== this.scheme) {
        fail({
          success: false,
          data: this,
          error: new SiwaError(
            SiwaErrorType.SCHEME_MISMATCH,
            scheme,
            this.scheme
          ),
        });
      }

      /** Domain binding */
      if (domain && domain !== this.domain) {
        fail({
          success: false,
          data: this,
          error: new SiwaError(
            SiwaErrorType.DOMAIN_MISMATCH,
            domain,
            this.domain
          ),
        });
      }

      /** Nonce binding */
      if (nonce && nonce !== this.nonce) {
        fail({
          success: false,
          data: this,
          error: new SiwaError(SiwaErrorType.NONCE_MISMATCH, nonce, this.nonce),
        });
      }

      /** Check time or now */
      const checkTime = new Date(time || new Date());

      /** Message not expired */
      if (this.expirationTime) {
        const expirationDate = new Date(this.expirationTime);
        if (checkTime.getTime() >= expirationDate.getTime()) {
          fail({
            success: false,
            data: this,
            error: new SiwaError(
              SiwaErrorType.EXPIRED_MESSAGE,
              `${checkTime.toISOString()} < ${expirationDate.toISOString()}`,
              `${checkTime.toISOString()} >= ${expirationDate.toISOString()}`
            ),
          });
        }
      }

      /** Message is valid already */
      if (this.notBefore) {
        const notBefore = new Date(this.notBefore);
        if (checkTime.getTime() < notBefore.getTime()) {
          fail({
            success: false,
            data: this,
            error: new SiwaError(
              SiwaErrorType.NOT_YET_VALID_MESSAGE,
              `${checkTime.toISOString()} >= ${notBefore.toISOString()}`,
              `${checkTime.toISOString()} < ${notBefore.toISOString()}`
            ),
          });
        }
      }
      let EIP4361Message;
      try {
        EIP4361Message = this.prepareMessage();
      } catch (e) {
        fail({
          success: false,
          data: this,
          error: e,
        });
      }

      /** Recover address from signature */
      let addr;
      try {
        addr = address;
      } catch (e) {
        console.error(e);
      }
      /** Match signature with message's address */
      if (addr === this.address) {
        return resolve({
          success: true,
          data: this,
        });
      } else {
        const EIP1271Promise = verifySignature(
          this,
          signature,
          provider,
          encodedTransaction,
          nfd
        )
          .then(isValid => {
            if (!isValid) {
              return {
                success: false,
                data: { ...this, nfd },
                error: new SiwaError(
                  SiwaErrorType.INVALID_SIGNATURE,
                  addr,
                  `Resolved address to be ${this.address}`
                ),
              };
            }
            const returnData: any = { ...this };

            if (nfd !== "undefined") {
              returnData.nfd = nfd;
            }
            return {
              success: true,
              data: { ...returnData },
            };
          })
          .catch(error => {
            return {
              success: false,
              data: this,
              error,
            };
          });

        Promise.all([
          EIP1271Promise,
          opts
            ?.verificationFallback?.(params, opts, this, EIP1271Promise)
            ?.then(res => res)
            ?.catch((res: SiwaResponse) => res),
        ]).then(([EIP1271Response, fallbackResponse]) => {
          if (fallbackResponse) {
            if (fallbackResponse.success) {
              return resolve(fallbackResponse);
            } else {
              fail(fallbackResponse);
            }
          } else {
            if (EIP1271Response.success) {
              return resolve(EIP1271Response);
            } else {
              fail(EIP1271Response);
            }
          }
        });
      }
    });
  }

  /**
   * Validates the values of this object fields.
   * @throws Throws an {ErrorType} if a field is invalid.
   */
  private validateMessage(...args) {
    /** Checks if the user might be using the function to verify instead of validate. */
    if (args.length > 0) {
      throw new SiwaError(
        SiwaErrorType.UNABLE_TO_PARSE,
        `Unexpected argument in the validateMessage function.`
      );
    }

    /** `domain` check. */
    if (
      !this.domain ||
      this.domain.length === 0 ||
      !/[^#?]*/.test(this.domain)
    ) {
      throw new SiwaError(
        SiwaErrorType.INVALID_DOMAIN,
        `${this.domain} to be a valid domain.`
      );
    }

    /** Check if the URI is valid. */
    if (!uri.isUri(this.uri)) {
      throw new SiwaError(
        SiwaErrorType.INVALID_URI,
        `${this.uri} to be a valid uri.`
      );
    }

    /** Check if the version is 1. */
    if (this.version !== '1') {
      throw new SiwaError(
        SiwaErrorType.INVALID_MESSAGE_VERSION,
        '1',
        this.version
      );
    }

    /** Check if the nonce is alphanumeric and bigger then 8 characters */
    const nonce = this?.nonce?.match(/[a-zA-Z0-9]{8,}/);
    if (!nonce || this.nonce.length < 8 || nonce[0] !== this.nonce) {
      throw new SiwaError(
        SiwaErrorType.INVALID_NONCE,
        `Length > 8 (${nonce.length}). Alphanumeric.`,
        this.nonce
      );
    }

    /** `issuedAt` conforms to ISO-8601 and is a valid date. */
    if (this.issuedAt) {
      if (!isValidISO8601Date(this.issuedAt)) {
        throw new Error(SiwaErrorType.INVALID_TIME_FORMAT);
      }
    }

    /** `expirationTime` conforms to ISO-8601 and is a valid date. */
    if (this.expirationTime) {
      if (!isValidISO8601Date(this.expirationTime)) {
        throw new Error(SiwaErrorType.INVALID_TIME_FORMAT);
      }
    }

    /** `notBefore` conforms to ISO-8601 and is a valid date. */
    if (this.notBefore) {
      if (!isValidISO8601Date(this.notBefore)) {
        throw new Error(SiwaErrorType.INVALID_TIME_FORMAT);
      }
    }
  }
}