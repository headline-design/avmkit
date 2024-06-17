import { tap } from '@/dashboard/lib/utils';
import prisma from '@/dashboard/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SiwaErrorType, SiwaMessage, generateNonce } from '@avmkit/siwa';
import SiwaSession from '@/dashboard/lib/siwa-session';
import { getSession } from '@/dashboard/lib/auth';

interface SiwaFields {
  address: string;
  algoAddress: string;
  nonce: string;
  nfd?: string;
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await getSession();

  return NextResponse.json(session);
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const session = await SiwaSession.fromRequest(req);
  if (!session?.nonce) session.nonce = generateNonce();

  return tap(new NextResponse(session.nonce), (res: any) => session.persist(res));
};

export const POST = async (req: NextRequest) => {
  const { message, signature } = await req.json();

  const session = await SiwaSession.fromRequest(req);

  try {
    const siwaMessage = new SiwaMessage(message);

    const verifyFields: any = {
      signature,
      nonce: session.nonce,
      address: session.address,
      algoAddress: session.algoAddress,
    }

    if (session.nfd) {
      verifyFields.nfd = session.nfd;
    }

    const siwaFields = await siwaMessage.verify({
      ...verifyFields,
    });

    const fields = siwaFields as unknown as SiwaFields;

    if (fields.nonce !== session.nonce) {
      return tap(new NextResponse('Invalid nonce.', { status: 422 }), (res: any) =>
        session.clear(res),
      );
    }
    session.address = fields.address;
    session.algoAddress = fields.algoAddress;
    session.nfd = fields.nfd;
    session.chainId = 1;
    session.nonce = undefined;
    session.userId = fields.address;
  } catch (error) {
    switch (error) {
      case SiwaErrorType.INVALID_NONCE:
      case SiwaErrorType.INVALID_SIGNATURE:
        return tap(new NextResponse(String(error), { status: 422 }), (res: any) =>
          session.clear(res),
        );

      default:
        return tap(new NextResponse(String(error), { status: 400 }), (res: any) =>
          session.clear(res),
        );
    }
  }

  const user: any = await prisma.user.upsert({
    where: { id: session.userId },
    create: { id: session.userId },
    update: { id: session.userId },
  });

  // then add a wallet to the user

  session.userId = user.id;

  return tap(new NextResponse(''), (res: any) => session.persist(res));
};

export const DELETE = async (req: NextRequest) => {
  const session = await SiwaSession.fromRequest(req);

  return tap(new NextResponse(''), (res: any) => session.clear(res));
};
