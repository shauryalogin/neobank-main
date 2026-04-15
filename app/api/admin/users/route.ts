import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

// ⚙️ VULNERABLE: No authentication check whatsoever
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();

    // Returns ALL user data including passwords
    const [users]: any = await db.query(
      `SELECT id, username, password, email, role, balance, account_number, created_at FROM users`
    );

    return NextResponse.json({
      success: true,
      users,
      // Expose internal info
      server: 'NeoBank API v1.0',
      db: 'MySQL 8.0',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message, stack: err.stack }, { status: 500 });
  }
}
