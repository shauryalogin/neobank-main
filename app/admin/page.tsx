'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { if (data.users) setUsers(data.users); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Admin Panel</h1>
              <p style={{ fontSize: 16, color: '#70685C' }}>Internal Management Dashboard — oversee user activity and database records.</p>
            </div>
            <Link href="/admin/logs" style={{ 
              padding: '12px 24px', 
              background: 'white', 
              border: '1px solid #EDEAE4', 
              borderRadius: 14, 
              fontSize: 14, 
              fontWeight: 600, 
              color: '#1A1A1A', 
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}>
              View server logs →
            </Link>
          </div>
        </div>

        {/* High-Impact Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Users', value: users.length || '—' },
            { label: 'Active Sessions', value: '3' },
            { label: 'Transfers (24h)', value: '12' },
            { label: 'Total Platform Volume', value: '$48,920' },
          ].map(stat => (
            <div key={stat.label} style={{ 
              background: 'white', 
              border: '1px solid #EDEAE4', 
              borderRadius: 20, 
              padding: '28px',
              boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)'
            }}>
              <div style={{ fontSize: 12, color: '#8A7F6E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* User Management Table */}
        <div style={{ 
          background: 'white', 
          border: '1px solid #EDEAE4', 
          borderRadius: 24, 
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(132, 125, 110, 0.08)'
        }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #F5F3EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Database Records</h2>
            <div style={{ fontSize: 13, background: '#F9F8F6', padding: '4px 12px', borderRadius: 99, fontWeight: 600, color: '#8A7F6E' }}>
              {users.length} total objects
            </div>
          </div>
          
          {loading ? (
            <div style={{ padding: 64, textAlign: 'center' }}>
               <div className="spinner" style={{ border: '3px solid #EDEAE4', borderTop: '3px solid #1A1A1A', borderRadius: '50%', width: 24, height: 24, animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
               <p style={{ color: '#8A7F6E', fontSize: 14 }}>Fetching secure records...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#F9F8F6' }}>
                    {['ID', 'User Identity', 'Role', 'Account Balance', 'Plaintext Password'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '16px 32px', fontSize: 11, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className="row" style={{ borderBottom: i < users.length - 1 ? '1px solid #F5F3EF' : 'none', transition: 'background 0.2s' }}>
                      <td style={{ padding: '20px 32px', color: '#8A7F6E', fontFamily: 'monospace' }}>#{u.id}</td>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ fontWeight: 700, color: '#1A1A1A' }}>{u.username}</div>
                        <div style={{ fontSize: 12, color: '#8A7F6E' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: 8, 
                          fontSize: 11, 
                          fontWeight: 700, 
                          textTransform: 'uppercase',
                          background: u.role === 'admin' ? '#1A1A1A' : '#F0F9FF', 
                          color: u.role === 'admin' ? 'white' : '#075985' 
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        ${parseFloat(u.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ 
                          fontFamily: 'monospace', 
                          fontSize: 13, 
                          background: '#FFF1F2', 
                          color: '#991B1B', 
                          padding: '4px 8px', 
                          borderRadius: 6 
                        }}>
                          {u.password}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .row:hover { background-color: #FAFAFA; }
      `}</style>
    </div>
  );
}