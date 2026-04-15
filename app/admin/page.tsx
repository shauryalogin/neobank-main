'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No auth check — vulnerability baked in naturally
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { if (data.users) setUsers(data.users); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.6px', marginBottom: 4 }}>Admin panel</h1>
              <p style={{ fontSize: 14, color: '#8a7f6e' }}>Internal dashboard — manage users and platform activity.</p>
            </div>
            <Link href="/admin/logs" style={{ padding: '9px 18px', background: 'white', border: '1px solid #e8e4dc', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#1a1a1a', textDecoration: 'none' }}>
              View server logs →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total users', value: users.length || '—' },
            { label: 'Active today', value: '3' },
            { label: 'Transfers today', value: '12' },
            { label: 'Total volume', value: '$48,920' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', border: '1px solid #e8e4dc', borderRadius: 12, padding: '20px 22px' }}>
              <div style={{ fontSize: 12, color: '#8a7f6e', fontWeight: 500, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.8px' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* User table */}
        <div style={{ background: 'white', border: '1px solid #e8e4dc', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0ede6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px' }}>All users</h2>
            <span style={{ fontSize: 12, color: '#8a7f6e' }}>{users.length} total</span>
          </div>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#8a7f6e', fontSize: 14 }}>Loading...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0ede6' }}>
                  {['ID', 'Username', 'Email', 'Role', 'Balance', 'Password'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: '#8a7f6e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #f0ede6' : 'none' }}>
                    <td style={{ padding: '14px 20px', color: '#8a7f6e', fontWeight: 500 }}>#{u.id}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>{u.username}</td>
                    <td style={{ padding: '14px 20px', color: '#6b6355' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: u.role === 'admin' ? '#fef3c7' : '#f0f9ff', color: u.role === 'admin' ? '#92400e' : '#075985' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 500 }}>${parseFloat(u.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: 13, color: '#8a7f6e' }}>{u.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
