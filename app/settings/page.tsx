'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, [router]);

  const Section = ({ title, children }: any) => (
    <div style={{ 
      background: 'white', 
      border: '1px solid #EDEAE4', 
      borderRadius: 24, 
      padding: '32px', 
      marginBottom: 24,
      boxShadow: '0 4px 12px rgba(132, 125, 110, 0.04)'
    }}>
      <h3 style={{ 
        fontSize: 18, 
        fontWeight: 700, 
        letterSpacing: '-0.02em', 
        marginBottom: 24, 
        color: '#1A1A1A'
      }}>{title}</h3>
      {children}
    </div>
  );

  const Row = ({ label, desc, children }: any) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 20,
      paddingBottom: 20,
      borderBottom: '1px solid #F5F3EF'
    }}>
      <div style={{ paddingRight: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{label}</div>
        {desc && <div style={{ fontSize: 13, color: '#8A7F6E', marginTop: 4, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ on = true }) => (
    <div style={{ 
      width: 44, 
      height: 24, 
      borderRadius: 12, 
      background: on ? '#1A1A1A' : '#EDEAE4', 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 3px', 
      cursor: 'pointer', 
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      justifyContent: on ? 'flex-end' : 'flex-start'
    }}>
      <div style={{ 
        width: 18, 
        height: 18, 
        borderRadius: '50%', 
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Settings</h1>
          <p style={{ fontSize: 16, color: '#70685C' }}>Manage your account preferences and security.</p>
        </header>

        <div style={{ maxWidth: 720 }}>
          <Section title="Appearance">
            <Row label="Dark mode" desc="Switch to a darker interface (Coming soon)"><Toggle on={false} /></Row>
            <Row label="Compact view" desc="Show more information with less spacing"><Toggle on={false} /></Row>
          </Section>

          <Section title="Privacy">
            <Row label="Hide balance on overview" desc="Show asterisks instead of your actual balance"><Toggle on={false} /></Row>
            <Row label="Activity status" desc="Let others see when you were last active"><Toggle /></Row>
          </Section>

          <Section title="Payments">
            <Row label="Require confirmation" desc="Ask for a final confirmation before sending money"><Toggle /></Row>
            <Row label="Daily limit alerts" desc="Notify when you reach 80% of your daily limit"><Toggle /></Row>
          </Section>

          <Section title="Danger zone">
            <div style={{ 
              padding: '24px', 
              background: '#FFF1F2', 
              border: '1px solid #FECACA', 
              borderRadius: 20 
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#991B1B' }}>Close account</div>
              <p style={{ fontSize: 14, color: '#B91C1C', marginBottom: 20, lineHeight: 1.5 }}>
                This will permanently delete your Neobank account and all transaction history. 
                This action is irreversible.
              </p>
              <button style={{ 
                padding: '12px 24px', 
                background: '#DC2626', 
                color: 'white', 
                border: 'none', 
                borderRadius: 12, 
                fontSize: 14, 
                fontWeight: 600, 
                cursor: 'pointer', 
                fontFamily: 'inherit',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Permanently delete account
              </button>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}