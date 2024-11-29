import NextAuth, { getServerSession, type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/dashboard/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { UserProps } from '@/dashboard/lib/types';
import { getSearchParams } from '@/dashboard/lib/utils';
import { hashToken } from './crypto';
import { ratelimit } from './upstash';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiwaMessage } from '@avmkit/siwa';
import { SiweMessage } from 'siwe';

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

interface Credentials {
  message?: string;
  signature?: string;
  address?: string;
  nfd?: string;
}

export interface SIWAResult {
  success: boolean;
  data: {
    address?: string;
    chainId?: any;
    domain?: string;
    message?: string;
    signature?: string;
    nfd?: string;
  };
}

export interface Session {
  user: {
    email: string;
    id: string;
    name: string;
    gh_username?: string;
    nfd?: string;
    accessToken?: string;
    image?: string;
  };
}

export interface Profile {
  id?: number;
  name?: string;
  email?: string;
  avatar_url?: string;
  login?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "algorand",
      name: "Algorand",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        domain: {
          label: "Domain",
          type: "text",
          placeholder: "example.com",
        },
        provider: {
          label: "Provider",
          type: "text",
          placeholder: "Unknown",
        },
        nfd: {
          label: "NFD",
          type: "text",
          placeholder: "HELLO_WORLD",
        },

      },
      async authorize(credentials, req) {
        try {
          const siwa = new SiwaMessage(JSON.parse(credentials.message || "{}"));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
          const validDomain =
            siwa?.domain === nextAuthUrl.host ? nextAuthUrl.host : undefined;

          const verifyData: any = {
            signature: credentials.signature,
            domain: validDomain,
            nonce: siwa?.nonce,
            provider: credentials.provider,
          };

          console.log("VerifyData", verifyData);

          if (credentials?.nfd && credentials.nfd !== "null" && credentials.nfd !== "undefined") {
            verifyData.nfd = credentials.nfd;
          }

          // VerifyParams
          const { data: fields, success } = await siwa.verify({ ...verifyData });

          console.log("result", success);

          if (fields && success) {
            const authResult = await handleWalletAuth(fields, "AVM");
            return authResult;
          }
        } catch (error) {
          console.error("Algorand auth error:", error);
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "ethereum",
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}"),
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
          const validDomain =
            siwe?.domain === nextAuthUrl.host ? nextAuthUrl.host : undefined;

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: validDomain,
            nonce: siwe.nonce,
          });

          if (result.success) {
            return await handleWalletAuth(result.data, "EVM");
          }
        } catch (error) {
          console.error("Ethereum auth error:", error);
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    TwitterProvider({
      clientId: process.env.AUTH_TWITTER_ID as string,
      clientSecret: process.env.AUTH_TWITTER_SECRET as string,
      version: "2.0",
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: { scope: "read:user user:email repo" },
      },
      profile(profile: any) {
        return {
          id: (profile as Profile).id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          gh_username: profile.login,
        };
      },
    }),
  ],
  pages: {
    signIn: ``,
    verifyRequest: ``,
    error: "",
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: VERCEL_DEPLOYMENT ? "algostack-evm.vercel.app" : "localhost",
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        const session = await getSession();
        if (!session?.user.id) return false;
        user.email =
          session.user.email ||
          `${user.name || session.user.id}@${account.provider}-provider.com`;
      }

      if (
        [
          "google",
          "github",
          "twitter",
          "discord",
          "algorand",
          "ethereum",
        ].includes(account?.provider)
      ) {
        await handleOAuthSignIn(user, account, profile);
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (!token.email) return {};

      if (account?.provider) {
        token.provider = account.provider;
      }
      if (account?.provider === "github") {
        token.accessToken = account.access_token;
        token.githubId = (profile as Profile).id.toString();
      }

      if (user) token.user = user;

      // refresh the user's data if they update their name / email
      if (token.trigger === "update") {
        const refreshedUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            wallets: true,
          },
        });
        if (refreshedUser) {
          token.user = refreshedUser;
        } else {
          return {};
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(typeof token.user === "object" ? token.user : {}),
        // Add the provider information here
      };
      return session;
    },
  },
};

async function handleWalletAuth(
  data: any,
  vm: "AVM" | "EVM",
) {
  const address =
    vm === "AVM"
      ? data.address
      : vm === "EVM"
        ? data.address
        : data.address;
  const session = await getSession();
  const emailProvider = vm.toLowerCase();
  const chainId =
    vm === "AVM"
      ? data.chainId
      : vm === "EVM"
        ? data.chainId
        : 0;

  let wallet = await prisma.wallet.findUnique({ where: { address } });

  // If wallet does not exist, check for user or create user and wallet
  if (!wallet) {
    let user: any;

    // Check if user exists
    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
    }

    if (!user) {
      // Create user associated with the wallet
      user = await prisma.user.create({
        data: {
          name: address,
          email: `${address}@${emailProvider}.web3`,
        },
      });
    }

    // Create wallet associated with the found or newly created user
    const userWallet = await prisma.wallet.create({
      data: {
        address,
        hexAddress: data.address,
        chainId: chainId,
        userId: user.id,
      },
    });

    // add wallet.status to the userWallet object
    wallet = userWallet;

    const profile = {
      ...user,
      wallets: [userWallet],
    };

    return profile;
  } else {
    return await prisma.user.findUnique({
      where: { id: wallet.userId },
      include: { wallets: { where: { address: wallet.address } } },
    });
  }
}

async function handleOAuthSignIn(user: any, account: any, profile: any) {
  const userExists = await prisma.user.findUnique({
    where: { email: user.email },
    select: { name: true, gh_username: true, gitProvider: true },
  });

  if (userExists && !userExists.name) {
    await prisma.user.update({
      where: { email: user.email },
      data: {
        name: profile?.name,
        gh_username: profile?.login,
        image: profile?.picture || profile?.avatar_url,
      },
    });
  }

  if (
    account?.provider === "github" &&
    userExists &&
    (!userExists.gh_username || !userExists.gitProvider)
  ) {
    await prisma.user.update({
      where: { email: user.email },
      data: {
        gh_username: profile?.login,
        gitProvider: "github",
      },
    });
  }
}

export default NextAuth(authOptions);

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      gh_username: string;
      email: string;
      image: string;
    };
  } | null>;
}

interface WithUsertNextApiHandler {
  (req: NextApiRequest, res: NextApiResponse, session: Session, user?: UserProps): any;
}

const withUserAuth =
  (
    handler: WithUsertNextApiHandler,
    {
      needUserDetails, // if the action needs the user's details
    }: {
      needUserDetails?: boolean;
    } = {},
  ) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      const session = await getSession();
      if (!session?.user.id) return res.status(401).end('Unauthorized: Login required.');

      if (req.method === 'GET') return handler(req, res, session);

      if (needUserDetails) {
        const user = (await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          select: {
            id: true,
            name: true,
            username: true,
            gh_username: true,
            email: true,
          },
        })) as UserProps;

        return handler(req, res, session, user);
      }

      return handler(req, res, session);
    };

export { withUserAuth };

interface WithAuthHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    session,
    domain,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
    domain: string;
  }): Promise<Response>;
}
export const withAuth =
  (
    handler: WithAuthHandler,
    {
      allowAnonymous, // special case for /api/services (POST /api/services) – allow no session
    }: {
      requiredRole?: Array<'owner' | 'member'>;
      needNotExceededUsage?: boolean;
      allowAnonymous?: boolean;
    } = {},
  ) =>
    async (req: Request, { params }: { params: Record<string, string> | undefined }) => {
      const searchParams = getSearchParams(req.url);
      const slug = params?.slug || searchParams.projectSlug;
      const domain = params?.domain || searchParams.domain;
      const key = searchParams.key;

      let session: Session | undefined;
      let headers = {};

      const authorizationHeader = req.headers.get('Authorization');
      if (authorizationHeader) {
        if (!authorizationHeader.includes('Bearer ')) {
          return new Response(
            "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://voiager.org ",
            {
              status: 400,
            },
          );
        }
        const apiKey = authorizationHeader.replace('Bearer ', '');

        const hashedKey = hashToken(apiKey, {
          noSecret: true,
        });

        const user = await prisma.user.findFirst({
          where: {
            tokens: {
              some: {
                hashedKey,
              },
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        if (!user) {
          return new Response('Unauthorized: Invalid API key.', {
            status: 401,
          });
        }

        const { success, limit, reset, remaining } = await ratelimit(10, '1 s').limit(apiKey);

        headers = {
          'Retry-After': reset.toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        };

        if (!success) {
          return new Response('Too many requests.', {
            status: 429,
            headers,
          });
        }
        await prisma.token.update({
          where: {
            hashedKey,
          },
          data: {
            lastUsed: new Date(),
          },
        });
        session = {
          user: {
            id: user.id,
            name: user.name || '',
            email: user.email || '',
          },
        };
      } else {
        session = await getSession();
        if (!session?.user.id) {
          // for demo services, we allow anonymous service creation
          if (allowAnonymous) {
            // @ts-expect-error
            return handler({
              req,
              params: params || {},
              searchParams,
              headers,
            });
          }

          return new Response('Unauthorized: Login required.', {
            status: 401,
            headers,
          });
        }
      }

      return handler({
        req,
        params: params || {},
        searchParams,
        headers,
        session,
        domain,
      });
    };

interface WithSessionHandler {
  ({
    req,
    params,
    searchParams,
    session,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    session: Session;
  }): Promise<Response>;
}

export const withSession =
  (handler: WithSessionHandler) =>
    async (req: Request, { params }: { params: Record<string, string> }) => {
      const session = await getSession();
      if (!session?.user.id) {
        return new Response('Unauthorized: Login required.', { status: 401 });
      }

      const searchParams = getSearchParams(req.url);
      return handler({ req, params, searchParams, session });
    };

// Pass secure keys to the JWT token
export const getAuthToken = async (req) => {
  const token = await getToken({ req });
  if (token) {
    return token;
  } else {
    // Not Signed in
    console.log('No token');
  }
};

//route handler for public data

export const withPrismaPublic =
  (
    handler: WithoutSessionHandler,
    options: {
      allowAnonymous?: boolean;
    } = {},
  ) =>
    async (req: Request, { params }: { params: Record<string, string> | undefined }) => {
      const searchParams = getSearchParams(req.url);
      const slug = params?.slug || searchParams.projectSlug;
      const domain = params?.domain || searchParams.domain;
      const key = searchParams.key;

      let headers = {};

      return handler({
        req,
        params: params || {},
        searchParams,
        headers,
        domain,
      });
    };

interface WithoutSessionHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    domain,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers: Record<string, string>;
    domain?: string;
  }): Promise<Response>;
}

export const withPublic =
  (handler: WithoutSessionHandler) =>
    async (req: Request, { params }: { params: Record<string, string> }) => {
      const searchParams = getSearchParams(req.url);
      return handler({
        req,
        params: params || {},
        searchParams,
        headers: {},
      });
    };