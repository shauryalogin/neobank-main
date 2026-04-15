'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import Link from 'next/link';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs').then(r => r.json()).then(data => {
      if (data.logs) setLogs(data.logs);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.6px', marginBottom: 4 }}>Server logs</h1>
            <p style={{ fontSize: 14, color: '#8a7f6e' }}>All platform activity and events.</p>
          </div>
          <Link href="/admin" style={{ padding: '9px 18px', background: 'white', border: '1px solid #e8e4dc', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#1a1a1a', textDecoration: 'none' }}>
            ← Back to admin
          </Link>
        </div>

        <div style={{ background: 'white', border: '1px solid #e8e4dc', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0ede6' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Activity log</h2>
          </div>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#8a7f6e', fontSize: 14 }}>Loading...</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#8a7f6e', fontSize: 14 }}>No logs found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0ede6' }}>
                  {['Time', 'Action', 'User', 'IP', 'Details'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: '#8a7f6e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid #f0ede6' : 'none' }}>
                    <td style={{ padding: '13px 20px', color: '#8a7f6e', fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(log.created_at).toLocaleString()}</td>
                    <td style={{ padding: '13px 20px', fontWeight: 500 }}>{log.action}</td>
                    <td style={{ padding: '13px 20px', color: '#6b6355' }}>#{log.user_id}</td>
                    <td style={{ padding: '13px 20px', fontFamily: 'monospace', fontSize: 13, color: '#8a7f6e' }}>{log.ip}</td>
                    <td style={{ padding: '13px 20px', color: '#8a7f6e', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.details}</td>
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
