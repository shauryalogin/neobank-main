import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { getUserFromToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
let token = authHeader?.replace('Bearer ', '');
console.log("SECRET:", process.env.JWT_SECRET);
if (!token) {
  token = req.cookies.get('token')?.value;
}

console.log("AUTH HEADER:", authHeader);
console.log("TOKEN FROM HEADER:", token);
console.log("COOKIE TOKEN:", req.cookies.get('token')?.value);

const decoded: any = getUserFromToken(token);

  console.log("TOKEN:", token);
  console.log("DECODED:", decoded);

  // 🔴 FORCE JWT USAGE (remove cookie fallback for clarity)
  const userId = decoded?.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized (no id in token)' },
      { status: 401 }
    );
  }

  try {
    const db = await getDb();

    // 🔴 VULNERABLE: SQL Injection + IDOR
    const query = `
      SELECT id, username, email, role, balance, account_number, created_at 
      FROM users 
      WHERE id=${userId}
    `;

    console.log("QUERY:", query);

    const [rows]: any = await db.query(query);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: rows[0],
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}