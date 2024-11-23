import { sealData, unsealData } from "iron-session";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const APP_NAME = 'AlgoStackSSR';
export const COOKIE_NAME = "web3EVMSession";

if (!process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET cannot be empty.");
}

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID cannot be empty.");
}

export const SESSION_OPTIONS = {
  ttl: 60 * 60 * 24 * 30, // 30 days
  password: process.env.SESSION_SECRET!,
};

export type ISession = {
  nonce?: string;
  chainId?: number;
  address?: string;
  teamId?: string;
  userId?: string;
};

class Session {
  nonce?: string;
  chainId?: number;
  address?: string;
  teamId?: string;
  userId?: string;

  constructor(session?: ISession) {
    this.nonce = session?.nonce;
    this.chainId = session?.chainId;
    this.address = session?.address;
    this.teamId = session?.teamId;
    this.userId = session?.userId;
  }

  static async fromCookies(cookies: ReadonlyRequestCookies): Promise<Session> {
    const sessionCookie = cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) {
      console.error("fromCookies: No session cookie found.");
      throw new Error("Not authenticated");
    }
    try {
      const sessionData = await unsealData<ISession>(
        sessionCookie,
        SESSION_OPTIONS,
      );
      return new Session(sessionData);
    } catch (error) {
      console.error("fromCookies: Failed to unseal session cookie", error);
      throw error;
    }
  }

  static async fromRequest(req: NextRequest): Promise<Session> {
    const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) {
      console.warn(
        "fromRequest: No session cookie found, returning new Session.",
      );
      return new Session();
    }
    try {
      const sessionData = await unsealData<ISession>(
        sessionCookie,
        SESSION_OPTIONS,
      );
      return new Session(sessionData);
    } catch (error) {
      console.error("fromRequest: Failed to unseal session cookie", error);
      throw error;
    }
  }

  clear(res: NextResponse | ResponseCookies): Promise<void> {
    this.nonce = undefined;
    this.chainId = undefined;
    this.address = undefined;
    this.teamId = undefined;
    this.userId = undefined;

    return this.persist(res);
  }

  toJSON(): ISession {
    const jsonSession = {
      nonce: this.nonce,
      address: this.address,
      chainId: this.chainId,
      teamId: this.teamId,
      userId: this.userId,
    };
    return jsonSession;
  }

  async persist(res: NextResponse | ResponseCookies): Promise<void> {
    let cookies: ResponseCookies;
    if (isCookies(res)) cookies = res;
    else cookies = res.cookies;

    try {
      const sealedData = await sealData(this.toJSON(), SESSION_OPTIONS);
      cookies.set(COOKIE_NAME, sealedData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    } catch (error) {
      console.error("persist: Error sealing or setting cookie", error);
      throw error;
    }
  }
}

const isCookies = (
  cookies: NextResponse | ResponseCookies,
): cookies is ResponseCookies => {
  return (cookies as ResponseCookies).set !== undefined;
};

export default Session;
