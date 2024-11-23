import Session from "@/dashboard/lib/siwe-session";
import { tap } from "@/dashboard/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { generateNonce, SiweErrorType, SiweMessage } from "siwe";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await Session.fromRequest(req);

  return NextResponse.json(session.toJSON());
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const session = await Session.fromRequest(req);
  if (!session?.nonce) session.nonce = generateNonce();

  return tap(new NextResponse(session.nonce), (res: any) =>
    session.persist(res),
  );
};

export const POST = async (req: NextRequest) => {
  const { message, signature } = await req.json();
  console.log("message", message);

  const session = await Session.fromRequest(req);

  console.log("session", session);

  try {
    const siwe = new SiweMessage(JSON.parse(message || "{}"));

    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
    const validDomain =
      siwe.domain === nextAuthUrl.host ? nextAuthUrl.host : undefined;
    const verifyData: any = {
      signature: signature,
      domain: validDomain,
      nonce: session.nonce,
    };

    // VerifyParams
    const { data: fields } = await siwe.verify({ ...verifyData });

    if (fields.nonce !== session.nonce) {
      return tap(new NextResponse("Invalid nonce.", { status: 422 }), (res) =>
        session.clear(res),
      );
    }

    session.address = fields.address;
    session.chainId = fields.chainId;
    session.nonce = undefined;

  } catch (error) {
    switch (error) {
      case SiweErrorType.INVALID_NONCE:
      case SiweErrorType.INVALID_SIGNATURE:
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
  const session = await Session.fromRequest(req);
  if (!session) {
    console.error("Failed to retrieve Atlas session");
    return new NextResponse("Session not found", { status: 404 });
  }

  return tap(new NextResponse(""), (res) => session.clear(res));
};
