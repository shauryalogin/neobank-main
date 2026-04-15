'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    
    Promise.all([
      fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`/api/transactions`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([userData, txnData]) => {
      if (userData.success) {
        setUser(userData.user);
        localStorage.setItem('user', JSON.stringify(userData.user));
      }
      if (txnData.success) setTxns((txnData.transactions || []).slice(0, 5));
    }).finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div className="spinner" style={{ border: '3px solid #EDEAE4', borderTop: '3px solid #1A1A1A', borderRadius: '50%', width: 24, height: 24, animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#8A7F6E', fontSize: 14, fontWeight: 500 }}>Preparing your dashboard...</span>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );

  const balance = parseFloat(user?.balance || '0');
  const income = txns.filter(t => t.type === 'credit').reduce((s, t) => s + parseFloat(t.amount), 0);
  const spent = txns.filter(t => t.type === 'debit').reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Good morning, {user?.username} 
          </h1>
          <p style={{ fontSize: 16, color: '#70685C' }}>Here is what is happening with your account today.</p>
        </header>

        {/* Hero Balance Card */}
        <div style={{ 
          background: '#1A1A1A', 
          borderRadius: 24, 
          padding: '40px', 
          marginBottom: 32, 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#8A7F6E', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total balance</div>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ marginTop: 20, fontSize: 14, color: '#8A7F6E', fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '99px', display: 'inline-block' }}>
              {user?.account_number}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 48, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 48 }}>
            <div>
              <div style={{ fontSize: 12, color: '#8A7F6E', marginBottom: 8, fontWeight: 600 }}>Income</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80', fontVariantNumeric: 'tabular-nums' }}>+${income.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8A7F6E', marginBottom: 8, fontWeight: 600 }}>Expenses</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#F87171', fontVariantNumeric: 'tabular-nums' }}>-${spent.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { href: '/transfer', label: 'Send money', icon: '↗', color: '#1A1A1A' },
            { href: '/transactions', label: 'History', icon: '▤', color: '#1A1A1A' },
            { href: '/search', label: 'Find people', icon: '⌕', color: '#1A1A1A' },
          ].map(a => (
            <Link key={a.href} href={a.href} className="action-card" style={{ 
              background: 'white', 
              border: '1px solid #EDEAE4', 
              borderRadius: 20, 
              padding: '24px', 
              textDecoration: 'none', 
              color: '#1A1A1A', 
              display: 'flex', 
              flexDirection: 'column' as const,
              gap: 16,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)'
            }}>
              <span style={{ fontSize: 24, background: '#F9F8F6', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>{a.icon}</span> 
              <span style={{ fontWeight: 600, fontSize: 15 }}>{a.label}</span>
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link href="/admin" className="action-card" style={{ background: 'white', border: '1px solid #EDEAE4', borderRadius: 20, padding: '24px', textDecoration: 'none', color: '#1A1A1A', display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
              <span style={{ fontSize: 24, background: '#FFF7ED', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>⚙</span> 
              <span style={{ fontWeight: 600, fontSize: 15 }}>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Recent Transactions List */}
        <div style={{ 
          background: 'white', 
          border: '1px solid #EDEAE4', 
          borderRadius: 24, 
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(132, 125, 110, 0.08)'
        }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #F5F3EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Recent Activity</h2>
            <Link href="/transactions" style={{ fontSize: 14, color: '#8A7F6E', textDecoration: 'none', fontWeight: 600 }}>View all activity</Link>
          </div>
          
          {txns.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center', color: '#8A7F6E' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🧊</div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>No transactions found for this account.</p>
            </div>
          ) : (
            <div>
              {txns.map((t, i) => (
                <div key={i} className="txn-row" style={{ 
                  padding: '20px 32px', 
                  borderBottom: i < txns.length - 1 ? '1px solid #F5F3EF' : 'none', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  transition: 'background 0.2s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ 
                      width: 42, height: 42, borderRadius: 12, 
                      background: t.type === 'credit' ? '#F0FDF4' : '#FFF1F2', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: 18, fontWeight: 'bold',
                      color: t.type === 'credit' ? '#166534' : '#991B1B'
                    }}>
                      {t.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{t.description}</div>
                      <div style={{ fontSize: 13, color: '#8A7F6E', marginTop: 2 }}>{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.type === 'credit' ? '#15803D' : '#1A1A1A', fontVariantNumeric: 'tabular-nums' }}>
                    {t.type === 'credit' ? '+' : '-'}${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .action-card:hover {
          border-color: #1A1A1A !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(132, 125, 110, 0.12) !important;
        }
        .txn-row:hover {
          background-color: #FAFAFA;
        }
      `}</style>
    </div>
  );
}