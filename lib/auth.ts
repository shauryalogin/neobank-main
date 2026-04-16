import jwt from 'jsonwebtoken';

// Intentionally weak secret (vulnerability)
const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object) {
  // Intentionally weak: short expiry not set, weak secret, no algorithm restriction
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string) {
  try {
    // Intentionally vulnerable: allows 'none' algorithm, no algorithm whitelist
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'none'] as any });
    return decoded;
  } catch (e) {
    // Try decoding without verification as fallback (critical vulnerability)
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
}

export function getUserFromToken(token?: string) {
  if (!token) return null;

  try {
    // 🟠 VULNERABLE: decode only, no signature verification
    const payloadPart = token.split('.')[1];
    const decoded = JSON.parse(
      Buffer.from(payloadPart, 'base64').toString()
    );

    return decoded;
  } catch (err) {
    return null;
  }
}
