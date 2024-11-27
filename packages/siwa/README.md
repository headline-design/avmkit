# Sign-In with Algorand (SIWA)

**@avmkit/siwa** is a package that lets you easily allow users to authenticate themselves with your off-chain services by signing in with their Algorand accounts.

## Problem & Motivation

When building our on-chain applications for users to connect with Algorand and other virtual machines, we needed a way for users to prove that they own an Algorand address before they can request resources relevant to that address. There was no solution that offered a good user experience, where users could easily understand what they are signing with their Algorand wallet. Inspired by Sign-In with Ethereum, we decided to build the right tool for the Algorand ecosystem.

## Features

- Construct human-readable sign-in messages
- Create messages in stringified JSON format
- Decode and parse string messages of both formats into JavaScript objects
- Basic validations (e.g., expiration)
- Utility functions to handle Algorand addresses
- Full TypeScript support

## Installation

```bash
npm install @avmkit/siwa
```

## Usage

### Frontend

```javascript
// 1. Import necessary modules
import { SiwaMessage } from '@avmkit/siwa';

// 2. Handle sign-in after `account` is selected
const handleSignIn = async () => {
  const siwa = new SiwaMessage({
    domain: 'localhost',
    uri: 'http://localhost:3000/sign-in',
    address: account.address,
    nonce, // a challenge generated from the backend
    statement: 'Welcome to my dApp!',
  });

  // Sign the message using the Algorand wallet
  const signedMessage = await siwa.sign(account);

  // API call to sign in with the backend
  await signIn(signedMessage);
};
```

### Backend

```javascript
// 1. Import SIWA utilities
import { SiwaMessage } from '@avmkit/siwa';

// 2. Backend handler to handle sign-in request
const verifyData: any = {
  signature: credentials.signature,
  domain: nextAuthUrl.host,
  algoAddress: credentials.algoAddress,
  algoSignature: credentials.algoSignature || '',
  nonce: await getCsrfToken({ req }),
};

if (credentials.nfd) {
  verifyData.nfd = credentials.nfd;
}

// VerifyParams
const result: any = await siwa.verify({
  ...verifyData,
});
```

## Documentation

Check out our [full guide](https://docs.siwa.org/help) on how to implement SIWA into your dapp!

## Support

- [Siwa](https://siwa.org/)
- [Algorand Foundation](https://developer.algorand.org/)
- [xGov Badge](https://github.com/headline-design/xgov-badge)

## Attribution

SIWA (Sign-In with Algorand) was inspired by and builds upon the concepts introduced by several other blockchain-based authentication protocols:

- **SIWE (Sign-In with Ethereum)**: SIWE, developed by Spruce Systems, Inc., pioneered the concept of using blockchain wallets for authentication. SIWA adapts many of the core principles introduced by SIWE to the Algorand ecosystem. For more information, visit [login.xyz](https://login.xyz/).

- **SIWS (Sign-In with Substrate)**: SIWS extends the concept to the Substrate ecosystem, which powers many parachains in the Polkadot and Kusama networks. While SIWA is specific to Algorand, it shares similar goals of providing decentralized authentication. More details can be found at [Talisman Github](https://github.com/TalismanSociety/siws).

- **SIWS (Sign-In with Solana)**: Another implementation of blockchain-based authentication, SIWS brings these concepts to the Solana ecosystem. SIWA draws inspiration from SIWS in adapting to a high-performance blockchain. For more information, visit [Phantom Github](https://github.com/phantom/sign-in-with-solana).

We acknowledge the contributions of these projects to the broader ecosystem of decentralized authentication and express our gratitude for paving the way for protocols like SIWA.

## Recognition

This project is supported by the [Algorand Foundation](https://algorand.foundation/). This work has been performed with support from the Algorand Foundation xGov Grants Program

  <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://github.com/headline-design/xgov-badge/blob/main/xgov-badge-github-banner.png?raw=true">
       <img alt="siws logo" src="https://github.com/headline-design/xgov-badge/blob/main/xgov-badge-primary.png?raw=true" width="auto" height="120">
  </picture>
