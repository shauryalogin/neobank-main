'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import Link from 'next/link';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(r => r.json())
      .then(data => {
        if (data.logs) setLogs(data.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Server Logs</h1>
            <p style={{ fontSize: 16, color: '#70685C' }}>Real-time platform activity and system events.</p>
          </div>
          <Link href="/admin" style={{ 
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
            ← Back to Admin
          </Link>
        </div>

        {/* Logs Table Container */}
        <div style={{ 
          background: 'white', 
          border: '1px solid #EDEAE4', 
          borderRadius: 24, 
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(132, 125, 110, 0.08)'
        }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #F5F3EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Activity Stream</h2>
            <div style={{ fontSize: 12, background: '#F9F8F6', padding: '4px 12px', borderRadius: 99, fontWeight: 600, color: '#8A7F6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Status: Active
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 64, textAlign: 'center' }}>
               <div style={{ border: '3px solid #EDEAE4', borderTop: '3px solid #1A1A1A', borderRadius: '50%', width: 24, height: 24, margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
               <p style={{ color: '#8A7F6E', fontSize: 14 }}>Polling server for latest events...</p>
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center', color: '#8A7F6E', fontSize: 14 }}>
              No platform activity recorded yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#F9F8F6' }}>
                    {['Timestamp', 'Action', 'Entity', 'Network ID', 'Event Details'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '16px 32px', fontSize: 11, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log.id} style={{ 
                      borderBottom: i < logs.length - 1 ? '1px solid #F5F3EF' : 'none',
                      transition: 'background 0.2s'
                    }}>
                      <td style={{ padding: '20px 32px', color: '#8A7F6E', fontSize: 12, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ 
                          fontWeight: 700, 
                          color: log.action.includes('DELETE') ? '#DC2626' : '#1A1A1A' 
                        }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px', color: '#6B6355', fontWeight: 500 }}>
                        User #{log.user_id}
                      </td>
                      <td style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: 13, color: '#8A7F6E' }}>
                        {log.ip}
                      </td>
                      <td style={{ 
                        padding: '20px 32px', 
                        color: '#70685C', 
                        maxWidth: 300, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        fontSize: 13
                      }}>
                        {log.details}
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
        tbody tr:hover { background-color: #FAFAFA; }
      `}</style>
    </div>
  );
}