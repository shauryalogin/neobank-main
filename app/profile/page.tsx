'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [token, setToken] = useState<string | null>(null);
const [decoded, setDecoded] = useState<any>(null);

useEffect(() => {
  const t = localStorage.getItem("token");
  setToken(t);

  if (t) {
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      setDecoded(payload);
    } catch (e) {
      setDecoded(null);
    }
  }
}, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.success) setUser(data.user); });
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Your Profile</h1>
          <p style={{ fontSize: 16, color: '#70685C' }}>Manage your personal identity and security settings.</p>
        </header>

        <div style={{ maxWidth: 860 }}>
          {/* Main Identity Card */}
          <div style={{ 
            background: 'white', 
            border: '1px solid #EDEAE4', 
            borderRadius: 24, 
            padding: '40px', 
            marginBottom: 24,
            boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 20, 
                background: '#1A1A1A', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 32, 
                fontWeight: 800, 
                color: 'white',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}>
                {user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{user?.username}</div>
                <div style={{ fontSize: 15, color: '#8A7F6E', marginTop: 4 }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Account Number', value: user?.account_number },
                { label: 'Tier', value: user?.role === 'admin' ? 'Administrator' : 'Premium Personal' },
                { label: 'Available Balance', value: `$${parseFloat(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
                { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024' },
              ].map(item => (
                <div key={item.label} style={{ padding: '20px', background: '#F9F8F6', borderRadius: 14, border: '1px solid #F0EDE6' }}>
                  <div style={{ fontSize: 12, color: '#8A7F6E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{item.value || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Security Card */}
            <div style={{ background: 'white', border: '1px solid #EDEAE4', borderRadius: 24, padding: 32, boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' }}>Security</h3>
              {['Change password', 'Two-factor authentication', 'Active sessions'].map(item => (
                <div key={item} className="list-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '16px 0', 
                  borderBottom: '1px solid #F5F3EF', 
                  fontSize: 14, 
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}>
                  {item} <span style={{ color: '#D1CDC7', fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>

            {/* Notifications Card */}
            <div style={{ background: 'white', border: '1px solid #EDEAE4', borderRadius: 24, padding: 32, boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' }}>Notifications</h3>
              {['Email alerts', 'Push notifications', 'Monthly statements'].map(item => (
                <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F5F3EF', fontSize: 14, fontWeight: 500 }}>
                  <span>{item}</span>
                  <div style={{ 
                    width: 42, 
                    height: 22, 
                    borderRadius: 11, 
                    background: '#1A1A1A', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    padding: '0 3px' 
                  }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
  marginTop: 24,
  background: "white",
  border: "1px solid #EDEAE4",
  borderRadius: 24,
  padding: 32
}}>
  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
    🔐 Security Lab: JWT Inspector
  </h3>

  {token ? (
    <>
      <div style={{
        fontSize: 12,
        color: "#8A7F6E",
        marginBottom: 12,
        wordBreak: "break-all"
      }}>
        {token}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }}>
        <div style={{ background: "#F9F8F6", padding: 16, borderRadius: 12 }}>
          <strong>Decoded Payload</strong>
          <pre style={{ fontSize: 12, marginTop: 10 }}>
            {JSON.stringify(decoded, null, 2)}
          </pre>
        </div>

        <div style={{ background: "#FFF7ED", padding: 16, borderRadius: 12 }}>
          <strong>⚠️ Security Notes</strong>
          <ul style={{ fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
            <li>JWT is not encrypted, only encoded</li>
            <li>Payload can be read by anyone</li>
            <li>Server must validate signature</li>
            <li>Never trust role/permission from frontend</li>
          </ul>
        </div>
      </div>
    </>
  ) : (
    <div style={{ fontSize: 13, color: "#8A7F6E" }}>
      No token found
    </div>
  )}
</div>
      </main>

      <style jsx>{`
        .list-item:hover {
          color: #8A7F6E;
        }
        .list-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}