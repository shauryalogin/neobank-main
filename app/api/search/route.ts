import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // 🔴 VULNERABLE: Direct string concatenation in query
  // Exploit: ?query=' UNION SELECT id,note,note,note,note,note,note FROM admin_notes--
  // Exploit: ?query=' UNION SELECT username,password,email,role,balance,account_number,created_at FROM users--
  const query = searchParams.get('query') || '';

  try {
    const db = await getDb();

    const sql = `SELECT id, username, email, role, password, balance, account_number FROM users WHERE username LIKE '%${query}%'`;
    // console.log('[DEBUG] Search SQL:', sql);

    const [rows]: any = await db.query(sql);

    return NextResponse.json({
      success: true,
      results: rows,
      debug: { sql }, // 🔴 VULNERABLE: SQL query exposed in response
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}
