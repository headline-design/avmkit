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
import { siwaMessage } from '@avmkit/siwa';

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

Check out our [full guide](https://siwa.org/help) on how to implement SIWA into your dapp!

## Support

- [Siwa](https://siwa.org/)
- [Algorand Foundation](https://developer.algorand.org/)

## Recognition

This project is supported by the [Algorand Foundation](https://algorand.foundation/). This work has been performed with support from the Algorand Foundation xGov Grants Program
