import { tap } from "@/dashboard/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { SiwaErrorType, SiwaMessage, generateNonce } from "@avmkit/siwa";
import SiwaSession from "@/dashboard/lib/siwa-session";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await SiwaSession.fromRequest(req);

  return NextResponse.json(session.toJSON());
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const session = await SiwaSession.fromRequest(req);
  if (!session?.nonce) session.nonce = generateNonce();

  return tap(new NextResponse(session.nonce), (res: any) =>
    session.persist(res),
  );
};

export const POST = async (req: NextRequest) => {
  const { message, signature, provider, nfd } =
    await req.json();

  const session = await SiwaSession.fromRequest(req);

  try {
    const siwa = new SiwaMessage(JSON.parse(message || "{}"));

    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
    const validDomain =
      siwa.domain === nextAuthUrl.host ? nextAuthUrl.host : undefined;

    const verifyData: any = {
      signature: signature,
      domain: validDomain,
      provider: provider,
      nonce: session.nonce,
    };

    console.log("verifyData", verifyData);

    if (nfd) {
      verifyData.nfd = nfd;
    }

    console.log("verifyData", verifyData);

    // VerifyParams
    const { data: fields } = await siwa.verify({ ...verifyData });

    console.log("fields", fields);

    if (fields.nonce !== session.nonce) {
      return tap(new NextResponse("Invalid nonce.", { status: 422 }), (res) =>
        session.clear(res),
      );
    }

    //@ts-ignore
    session.address = fields.address;
    session.chainId = fields.chainId;
    session.nonce = undefined;
  } catch (error) {
    switch (error) {
      case SiwaErrorType.INVALID_NONCE:
      case SiwaErrorType.INVALID_SIGNATURE:
        return tap(new NextResponse(String(error), { status: 422 }), (res) =>
          session.clear(res),
        );

      default:
        return tap(new NextResponse(String(error), { status: 400 }), (res) =>
          session.clear(res),
        );
    }
  }

  if (!session.address) {
    return tap(new NextResponse("Invalid address.", { status: 422 }), (res) =>
      session.clear(res),
    );
  }
  return tap(new NextResponse(""), (res) => session.persist(res));
};

export const DELETE = async (req: NextRequest) => {
  const session = await SiwaSession.fromRequest(req);
  if (!session) {
    console.error("Failed to retrieve Atlas session");
    return new NextResponse("Session not found", { status: 404 });
  }

  return tap(new NextResponse(""), (res) => session.clear(res));
};
