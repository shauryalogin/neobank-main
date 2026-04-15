'use client';

// ' OR '1'='1
// ' OR 1=1 --

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success) setResults(data.results || []);
      else setResults([]);
    } catch {
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Find People</h1>
          <p style={{ fontSize: 16, color: '#70685C' }}>Search for other Neobank users to send money instantly.</p>
          
          {/* Debug Hint */}
          <div style={{
            marginTop: 12,
            fontSize: 11,
            color: '#B8B2A7',
            fontFamily: 'monospace',
            background: '#F1EFE9',
            padding: '4px 10px',
            borderRadius: '6px',
            display: 'inline-block'
          }}>
            // DEBUG: RAW_QUERY_MODE_ENABLED
          </div>
        </header>

        {/* Search Input Card */}
        <section style={{ 
          background: 'white', 
          border: '1px solid #EDEAE4', 
          borderRadius: 24, 
          padding: '32px', 
          marginBottom: 32, 
          maxWidth: '700px',
          boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)'
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runSearch()}
                placeholder="Enter username or account ID..."
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: '#F9F8F6',
                  border: '1px solid #EDEAE4',
                  borderRadius: 16,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                className="search-input"
              />
            </div>
            <button
              onClick={runSearch}
              disabled={loading}
              style={{
                padding: '0 28px',
                background: '#1A1A1A',
                color: 'white',
                border: 'none',
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.1s active'
              }}
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {searched && (
          <div style={{ 
            background: 'white', 
            border: '1px solid #EDEAE4', 
            borderRadius: 24, 
            overflow: 'hidden', 
            maxWidth: '700px',
            boxShadow: '0 8px 24px rgba(132, 125, 110, 0.08)'
          }}>
            
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F5F3EF', background: '#F9F8F6' }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Search Results ({results.length})
              </h3>
            </div>

            {results.length === 0 ? (
              <div
                style={{ padding: '48px 32px', textAlign: 'center', fontSize: 15, color: '#70685C' }}
                /* 🔥 Reflected XSS Point */
                dangerouslySetInnerHTML={{
                  __html: `No users found matching "<strong>${query}</strong>"`
                }}
              />
            ) : (
              results.map((u, i) => (
                <div
                  key={i}
                  style={{
                    padding: '20px 24px',
                    borderBottom: i < results.length - 1 ? '1px solid #F5F3EF' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                  className="result-row"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Avatar Circle */}
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      background: '#1A1A1A',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 16
                    }}>
                      {String(u.username || u[1] || '?')[0]?.toUpperCase()}
                    </div>

                    <div>
                      {/* 🔥 Stored XSS Point */}
                      <div
                        style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}
                        dangerouslySetInnerHTML={{
                          __html: u.username || u[1]
                        }}
                      />

                      {/* Data leakage Point */}
                      <div style={{ fontSize: 13, color: '#8A7F6E' }}>
                        {u.email || u[2]}
                      </div>

                      {/* Hidden Debug Leak */}
                      <div style={{
                        marginTop: 4,
                        fontSize: 10,
                        color: '#D1CEC7',
                        fontFamily: 'monospace',
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        RAW: {JSON.stringify(u)}
                      </div>
                    </div>
                  </div>

                  {/* IDOR helper link */}
                  <a
                    href={`/transfer?to=${u.account_number || ''}`}
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#1A1A1A',
                      textDecoration: 'none',
                      padding: '10px 18px',
                      background: '#F9F8F6',
                      border: '1px solid #EDEAE4',
                      borderRadius: 12,
                      transition: 'all 0.2s'
                    }}
                    className="send-btn"
                  >
                    Send Money →
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .search-input:focus {
          border-color: #1A1A1A;
          background: white;
          box-shadow: 0 0 0 4px rgba(26, 26, 26, 0.05);
        }
        .result-row:hover {
          background-color: #FAFAF9;
        }
        .send-btn:hover {
          background-color: #1A1A1A;
          color: white;
          border-color: #1A1A1A;
        }
      `}</style>
    </div>
  );
}