import { create, getNumericDate, verify } from "https://deno.land/x/djwt@v2.4/mod.ts";

export const secret = Deno.env.get("EXO_JWT_SECRET");

if (!secret) throw new Error("Env EXO_JWT_SECRET must be defined.");

export async function createJwt(payload: Record<string, unknown>): Promise<string> {
  return await create(
    { alg: "HS256", typ: "JWT" },
    { exp: computeExpiry(60 * 60 * 24), ...payload },
    await computeKey()
  );
}

export async function verifyJwt(jwt: string): Promise<Record<string, unknown>> {
  return await verify(jwt, await computeKey());
}

async function computeKey() {
  const encoder = new TextEncoder();
  const keyBuf = encoder.encode(secret);
  return await crypto.subtle.importKey("raw", keyBuf, { name: "HMAC", hash: "SHA-256" }, true, [
    "sign",
    "verify",
  ]);
}

export function computeExpiry(expirationPeriodSeconds: number): number {
  return getNumericDate(expirationPeriodSeconds);
}
