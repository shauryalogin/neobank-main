'use client';

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
    setLoading(true); setSearched(true);
    // query goes straight into SQL — vulnerable to injection
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) setResults(data.results || []);
      else setResults([]);
    } catch { setResults([]); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.6px', marginBottom: 4 }}>Find people</h1>
          <p style={{ fontSize: 14, color: '#8a7f6e' }}>Search for other Neobank users to send money.</p>
        </div>

        {/* Search box */}
        <div style={{ background: 'white', border: '1px solid #e8e4dc', borderRadius: 16, padding: '24px', marginBottom: 24, maxWidth: 600 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runSearch()}
              placeholder="Search by username..."
              style={{ flex: 1, padding: '11px 14px', border: '1px solid #e8e4dc', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            <button onClick={runSearch} disabled={loading} style={{ padding: '11px 20px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div style={{ background: 'white', border: '1px solid #e8e4dc', borderRadius: 16, overflow: 'hidden', maxWidth: 600 }}>
            {results.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#8a7f6e', fontSize: 14 }}>No users found for "{query}"</div>
            ) : (
              results.map((u, i) => (
                <div key={i} style={{ padding: '16px 24px', borderBottom: i < results.length - 1 ? '1px solid #f0ede6' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, color: '#6b6355', flexShrink: 0 }}>
                      {String(u.username || u[1] || '?')[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{u.username || u[1]}</div>
                      <div style={{ fontSize: 12, color: '#8a7f6e' }}>{u.email || u[2]}</div>
                    </div>
                  </div>
                  <a href={`/transfer`} style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', border: '1px solid #e8e4dc', borderRadius: 8 }}>
                    Send →
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
