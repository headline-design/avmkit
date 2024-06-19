import { sealData, unsealData } from 'iron-session';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const APP_NAME = 'AlgoStackSSR';
export const COOKIE_NAME = 'web3session';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET cannot be empty.');
}

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID cannot be empty.');
}

export const SESSION_OPTIONS = {
  ttl: 60 * 60 * 24 * 30, // 30 days
  password: process.env.SESSION_SECRET!,
};

export type ISiwaSession = {
  nonce?: string;
  chainId?: number;
  address?: string;
  teamId?: string;
  userId?: string;
};

class SiwaSession {
  nonce?: string;
  chainId?: number;
  address?: string;
  teamId?: string;
  userId?: string;
  algoAddress: string | undefined;
  nfd?: string;

  constructor(session?: ISiwaSession) {
    this.nonce = session?.nonce;
    this.chainId = session?.chainId;
    this.address = session?.address;
    this.teamId = session?.teamId;
    this.userId = session?.userId;
  }

  static async fromCookies(cookies: ReadonlyRequestCookies): Promise<SiwaSession> {
    const sessionCookie = cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) throw new Error('Not authenticated');
    return new SiwaSession(await unsealData<ISiwaSession>(sessionCookie, SESSION_OPTIONS));
  }

  static async fromRequest(req: NextRequest): Promise<SiwaSession> {
    const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) return new SiwaSession();
    return new SiwaSession(await unsealData<ISiwaSession>(sessionCookie, SESSION_OPTIONS));
  }

  clear(res: NextResponse | ResponseCookies): Promise<void> {
    this.nonce = undefined;
    this.chainId = undefined;
    this.address = undefined;
    this.teamId = undefined;
    this.userId = undefined;

    return this.persist(res);
  }

  toJSON(): ISiwaSession {
    return {
      nonce: this.nonce,
      address: this.address,
      chainId: this.chainId,
      teamId: this.teamId,
      userId: this.userId,
    };
  }

  async persist(res: NextResponse | ResponseCookies): Promise<void> {
    let cookies: ResponseCookies;
    if (isCookies(res)) cookies = res;
    else cookies = res.cookies;

    cookies.set(COOKIE_NAME, await sealData(this.toJSON(), SESSION_OPTIONS), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

const isCookies = (cookies: NextResponse | ResponseCookies): cookies is ResponseCookies => {
  return (cookies as ResponseCookies).set !== undefined;
};

export default SiwaSession;
