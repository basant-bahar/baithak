import { computeExpiry, createJwt, verifyJwt } from "../utils/jwt.ts";

export async function createCode(email: string, secret: string): Promise<string> {
  const expiry = computeExpiry(60 * 60 * 24);
  const record = { email, expiry };
  return await createJwt(record, secret);
}

export async function verifyCode(email: string, code: string, secret: string): Promise<void> {
  try {
    const payload = await verifyJwt(code, secret);
    if (payload.email !== email) {
      throw new ExographError("Invalid code");
    }
  } catch (e) {
    throw new ExographError(e.message);
  }
}
