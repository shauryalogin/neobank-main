'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [showPayloads, setShowPayloads] = useState(false);
  const [activePayload, setActivePayload] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => setUsers(d.users || []));
  }, []);

  const handleSearch = async () => {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
    setSearched(true);
  };

  const payloads = [
    { label: "Dump All", val: "' OR '1'='1" },
    { label: "UNION: Notes", val: "' UNION SELECT id,note,note,note FROM admin_notes--" },
    { label: "UNION: Logs", val: "' UNION SELECT id,action,ip,details FROM server_logs--" },
    { label: "DB Info", val: "' UNION SELECT 1,database(),version(),user()--" },
    { label: "Schema", val: "' UNION SELECT 1,table_name,table_schema,NULL FROM information_schema.tables--" },
    { label: "Time-Based", val: "admin' AND SLEEP(3)--" },
  ];

  const inject = (val: string) => { 
    setQuery(val); 
    setActivePayload(val); 
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>User Management</h1>
              <p style={{ fontSize: 14, color: '#8A7F6E', fontFamily: 'monospace' }}>// MODULE: AUTH_BYPASS_SEARCH // DB: EXPOSED</p>
            </div>
            <Link href="/admin" style={{ 
              padding: '12px 24px', 
              background: 'white', 
              border: '1px solid #EDEAE4', 
              borderRadius: 14, 
              fontSize: 13, 
              fontWeight: 600, 
              color: '#1A1A1A', 
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              Admin Root
            </Link>
          </div>
        </header>

        {/* SQLi Vulnerability Dossier - The "Warning" Card */}
        <section style={{ 
          marginBottom: 32, 
          borderRadius: 24, 
          border: '1px solid #FDE68A', 
          background: '#FFFBEB', 
          padding: '32px',
          boxShadow: '0 4px 20px rgba(251, 191, 36, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ 
    padding: '4px 8px', // Replaced px/py with standard padding
    borderRadius: 8, 
    background: '#F59E0B', 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 900 
  }}>CRITICAL VULN</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SQL Injection + Data Exposure</span>
          </div>
          
          <p style={{ fontSize: 14, color: '#92400E', lineHeight: 1.6, marginBottom: 24, opacity: 0.9 }}>
            The search endpoint performs direct string concatenation. This allows for <strong>Full Database Pivot</strong>. 
            Sensitive credentials are currently stored in <strong>Plaintext</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button 
              onClick={() => setShowPayloads(!showPayloads)}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#B45309', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              {showPayloads ? '[ - ] Collapse Payloads' : '[ + ] Expand Injection Payloads'}
            </button>

            {showPayloads && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {payloads.map(p => (
                  <button
                    key={p.val}
                    onClick={() => inject(p.val)}
                    style={{ 
                      padding: '12px', 
                      borderRadius: 12, 
                      border: '1px solid',
                      fontSize: 11,
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      background: activePayload === p.val ? '#F59E0B' : 'white',
                      borderColor: activePayload === p.val ? '#F59E0B' : '#FDE68A',
                      color: activePayload === p.val ? 'white' : '#92400E'
                    }}
                  >
                    ⚡ {p.label}
                  </button>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: 16, border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <span style={{ fontSize: 18 }}>🚩</span>
              <span style={{ fontSize: 12, color: '#92400E', fontWeight: 500 }}>
                HINT: Pivot to <code style={{ color: '#2563EB', fontWeight: 700 }}>admin_notes</code> for system secrets.
              </span>
            </div>
          </div>
        </section>

        {/* Search Interface */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ 
            padding: '32px', 
            borderRadius: 24, 
            background: 'white', 
            border: '1px solid #EDEAE4', 
            boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)' 
          }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <input
                type="text"
                placeholder="Intercept Query..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ 
                  flex: 1, 
                  background: '#F9F8F6', 
                  border: '1px solid #EDEAE4', 
                  borderRadius: 16, 
                  padding: '16px 20px', 
                  fontFamily: 'monospace', 
                  fontSize: 14, 
                  color: '#1A1A1A',
                  outline: 'none'
                }}
              />
              <button 
                onClick={handleSearch}
                style={{ 
                  padding: '0 32px', 
                  background: '#1A1A1A', 
                  color: 'white', 
                  borderRadius: 16, 
                  fontSize: 14, 
                  fontWeight: 700, 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
              >
                Execute
              </button>
            </div>

            {searched && (
              <div style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase' }}>Intercepted Results</h3>
                  <span style={{ fontSize: 12, color: '#8A7F6E', fontFamily: 'monospace' }}>Rows: {results.length}</span>
                </div>
                
                <div style={{ borderRadius: 20, border: '1px solid #F5F3EF', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'monospace' }}>
                    <thead style={{ background: '#F9F8F6', borderBottom: '1px solid #F5F3EF' }}>
                      <tr>
                        {['RAW_01', 'RAW_02', 'RAW_03', 'RAW_04'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: '#8A7F6E', fontSize: 11 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F9F8F6' }}>
                          <td style={{ padding: '12px 20px', color: '#8A7F6E' }}>{r.id ?? r[0]}</td>
                          <td style={{ padding: '12px 20px', color: '#2563EB', fontWeight: 600 }}>{r.username ?? r[1]}</td>
                          <td style={{ padding: '12px 20px', color: '#DC2626', fontWeight: 700 }}>{r.password ?? r[2]}</td>
                          <td style={{ padding: '12px 20px', color: '#1A1A1A' }}>{r.role ?? r[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Master Database Table */}
        <section style={{ 
          background: 'white', 
          border: '1px solid #EDEAE4', 
          borderRadius: 24, 
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(132, 125, 110, 0.08)'
        }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #F5F3EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Master User Table</h2>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>Encryption: Disabled</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead style={{ background: '#F9F8F6' }}>
              <tr>
                {['UID', 'Alias', 'Credentials', 'Identity'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '16px 32px', fontSize: 11, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F5F3EF' }}>
                  <td style={{ padding: '20px 32px', color: '#8A7F6E', fontFamily: 'monospace', fontSize: 12 }}>#{u.id}</td>
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ fontWeight: 700 }}>{u.username}</div>
                    <div style={{ fontSize: 12, color: '#8A7F6E' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <span style={{ padding: '6px 10px', borderRadius: 8, background: '#FEF2F2', color: '#B91C1C', fontFamily: 'monospace', fontSize: 13, border: '1px solid #FEE2E2' }}>
                      {u.password}
                    </span>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      background: u.role === 'admin' ? '#1A1A1A' : '#EFF6FF', 
                      color: u.role === 'admin' ? 'white' : '#1E40AF' 
                    }}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}