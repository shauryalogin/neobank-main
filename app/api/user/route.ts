import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { getUserFromToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  // 🟠 VULNERABLE: Token not properly verified; decode-only fallback in verifyToken
  const decoded: any = getUserFromToken(token);

  // 🟠 VULNERABLE: Also accepts session cookie as fallback — no real validation
  const sessionCookie = req.cookies.get('session')?.value;
  const userId = decoded?.id || sessionCookie;

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();

    // 🔴 VULNERABLE: userId not validated, IDOR possible via cookie manipulation
    const query = `SELECT id, username, email, role, balance, account_number, created_at FROM users WHERE id=${userId}`;
    const [rows]: any = await db.query(query);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message, stack: err.stack }, { status: 500 });
  }
}
