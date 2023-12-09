import { create, getNumericDate, verify } from "https://deno.land/x/djwt@v2.4/mod.ts";

export async function createJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  return await create(
    { alg: "HS256", typ: "JWT" },
    { exp: computeExpiry(60 * 60 * 24), ...payload },
    await computeKey(secret)
  );
}

export async function verifyJwt(jwt: string, secret: string): Promise<Record<string, unknown>> {
  return await verify(jwt, await computeKey(secret));
}

async function computeKey(secret: string) {
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
