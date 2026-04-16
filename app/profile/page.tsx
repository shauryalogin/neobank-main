'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

// ─── JWT helpers (client-side, SubtleCrypto) ────────────────────────────────
function b64urlEncode(obj: object) {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function signJwt(payload: object, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };

  const encode = (obj: any) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

  const unsigned = `${encode(header)}.${encode(payload)}`;

  // fake "signature" (lab-safe, no crypto dependency)
  const signature = btoa(secret + "." + unsigned)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${unsigned}.${signature}`;
}

function decodePayload(token: string): any {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
}
// ────────────────────────────────────────────────────────────────────────────

type Stage = 'idle' | 'editing' | 'forging' | 'success' | 'error';

export default function ProfilePage() {
  const router = useRouter();

  // real session
  const [user,    setUser]    = useState<any>(null);
  const [token,   setToken]   = useState('');
  const [decoded, setDecoded] = useState<any>(null);

  // JWT editor
  const [editedPayload, setEditedPayload] = useState('');
  const [parseError,    setParseError]    = useState('');
  const [secret,        setSecret]        = useState('secret');
  const [forgedToken,   setForgedToken]   = useState('');
  const [stage,         setStage]         = useState<Stage>('idle');
  const [forgedUser,    setForgedUser]    = useState<any>(null);
  const [apiError,      setApiError]      = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── load real user ──────────────────────────────────────────────────────
  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (!tok) { router.push('/login'); return; }
    setToken(tok);
    const pl = decodePayload(tok);
    setDecoded(pl);
    if (pl) setEditedPayload(JSON.stringify(pl, null, 2));

    fetch('/api/user', { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setUser(d.user); });
  }, [router]);

  // ── parse check on textarea edit ───────────────────────────────────────
  const handlePayloadEdit = (val: string) => {
    setEditedPayload(val);
    setParseError('');
    setStage('editing');
    try { JSON.parse(val); }
    catch { setParseError('Invalid JSON'); }
  };

  // ── quick-patch helpers ─────────────────────────────────────────────────
  const patchPayload = (patch: object) => {
    try {
      const current = JSON.parse(editedPayload);
      const next    = { ...current, ...patch };
      setEditedPayload(JSON.stringify(next, null, 2));
      setParseError('');
      setStage('editing');
    } catch { setParseError('Fix JSON first'); }
  };

  // ── forge + call /api/user ──────────────────────────────────────────────
  const forgeAndFetch = async () => {
  console.log("1. clicked");

  try {
    const payload = JSON.parse(editedPayload);
    console.log("2. payload parsed", payload);

    console.log("crypto:", crypto);
console.log("window.crypto:", window.crypto);
console.log("subtle:", window.crypto?.subtle);
    const forged = await signJwt(payload, secret);
    console.log("3. token created", forged);

    const res = await fetch('/api/user', {
      headers: { Authorization: `Bearer ${forged}` },
    });

    console.log("4. request sent");

    const data = await res.json();
    console.log("5. response received", data);

  } catch (err) {
    console.log("ERROR:", err);
  }
};

  const reset = () => {
    const pl = decodePayload(token);
    setEditedPayload(JSON.stringify(pl, null, 2));
    setForgedToken('');
    setForgedUser(null);
    setApiError('');
    setStage('idle');
  };

  // ── colours ────────────────────────────────────────────────────────────
  const stageColor: Record<Stage, string> = {
    idle:    '#E8E5DE',
    editing: '#FFF3CD',
    forging: '#E0F0FF',
    success: '#D4EDDA',
    error:   '#F8D7DA',
  };
  const stageText: Record<Stage, string> = {
    idle:    '#70685C',
    editing: '#856404',
    forging: '#0C5460',
    success: '#155724',
    error:   '#721C24',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F8F6', fontFamily: 'Inter, sans-serif', color: '#1A1A1A' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto' }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Your Profile</h1>
          <p style={{ fontSize: 16, color: '#70685C' }}>Manage your personal identity and security settings.</p>
        </header>

        {/* ── Identity card ── */}
        <div style={{ background: 'white', border: '1px solid #EDEAE4', borderRadius: 24, padding: 40, marginBottom: 24, boxShadow: '0 4px 12px rgba(132,125,110,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: forgedUser ? '#1A3A1A' : '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'white', transition: 'background .4s' }}>
              {(forgedUser || user)?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
                {(forgedUser || user)?.username}
                {forgedUser && (
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#D4EDDA', color: '#155724', padding: '3px 8px', borderRadius: 6, letterSpacing: '.04em' }}>
                    FORGED SESSION
                  </span>
                )}
              </div>
              <div style={{ fontSize: 15, color: '#8A7F6E', marginTop: 4 }}>{(forgedUser || user)?.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Account Number', value: (forgedUser || user)?.account_number },
              { label: 'Role / Tier',    value: (forgedUser || user)?.role === 'admin' ? '⚡ Administrator' : 'Premium Personal' },
              { label: 'Balance',        value: `$${parseFloat((forgedUser || user)?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
              { label: 'Member Since',   value: (forgedUser || user)?.created_at ? new Date((forgedUser || user).created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
            ].map(item => (
              <div key={item.label} style={{ padding: 20, background: forgedUser ? '#F0FFF4' : '#F9F8F6', borderRadius: 14, border: `1px solid ${forgedUser ? '#C3E6CB' : '#F0EDE6'}`, transition: 'all .4s' }}>
                <div style={{ fontSize: 12, color: '#8A7F6E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{item.value || '—'}</div>
              </div>
            ))}
          </div>

          {forgedUser && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: '#FFF3CD', border: '1px solid #FFEAA7', borderRadius: 12, fontSize: 13, color: '#856404' }}>
              ⚠️ You are now viewing <strong>{forgedUser.username}</strong>'s account using a forged JWT.
              The server accepted the token because it was signed with the correct (leaked) secret.{' '}
              <button onClick={reset} style={{ background: 'none', border: 'none', color: '#856404', textDecoration: 'underline', cursor: 'pointer', fontSize: 13, padding: 0 }}>Reset to your own session</button>
            </div>
          )}
        </div>
         {/* ── Security / Notifications cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div style={{ background: 'white', border: '1px solid #EDEAE4', borderRadius: 24, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' }}>Security</h3>
            {['Change password', 'Two-factor authentication', 'Active sessions'].map((item, i, arr) => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid #F5F3EF' : 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                {item} <span style={{ color: '#D1CDC7', fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', border: '1px solid #EDEAE4', borderRadius: 24, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' }}>Notifications</h3>
            {['Email alerts', 'Push notifications', 'Monthly statements'].map((item, i, arr) => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid #F5F3EF' : 'none', fontSize: 14, fontWeight: 500 }}>
                <span>{item}</span>
                <div style={{ width: 42, height: 22, borderRadius: 11, background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 3px' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── JWT Exploit Lab ── */}
<div style={{ background: 'white', border: '2px solid #1A1A1A', borderRadius: 24, padding: 36, marginBottom: 24 }}>

  {/* lab header */}
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A7F6E', textTransform: 'uppercase', marginBottom: 6 }}>
       JWT Forgery
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
         Payload Editor
      </h2>
      <p style={{ fontSize: 14, color: '#70685C', lineHeight: 1.6, maxWidth: 540 }}>
        Edit the JWT payload below and re-sign it. The server trusts the forged token based on the leaked secret.
      </p>
    </div>
    <div style={{ padding: '6px 14px', borderRadius: 8, background: stageColor[stage], color: stageText[stage], fontSize: 12, fontWeight: 700, letterSpacing: '.04em', whiteSpace: 'nowrap', marginTop: 4 }}>
      {stage === 'idle'    && 'Waiting'}
      {stage === 'editing' && 'Editing payload'}
      {stage === 'forging' && 'Forging…'}
      {stage === 'success' && 'Token accepted ✓'}
      {stage === 'error'   && 'Token rejected ✗'}
    </div>
  </div>

  {/* SIDE-BY-SIDE EDITOR AND TOKEN PARTS */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

  {/* payload editor */}
  <div>
    <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
      JWT Payload (editable)
    </div>
    <textarea
      ref={textareaRef}
      value={editedPayload}
      onChange={e => handlePayloadEdit(e.target.value)}
      spellCheck={false}
      style={{
        width: '100%', height: 180, padding: 14,
        fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7,
        background: parseError ? '#FFF5F5' : '#F9F8F6',
        border: `1.5px solid ${parseError ? '#F5A0A0' : '#E0DDD7'}`,
        borderRadius: 12, resize: 'none', outline: 'none', color: '#1A1A1A',
      }}
    />
    {parseError && (
      <div style={{ fontSize: 12, color: '#C0392B', marginTop: 4 }}>⚠ {parseError}</div>
    )}
  </div>

  {/* original token parts */}
  <div>
    <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
      Original Token Parts
    </div>
    <div style={{ 
      padding: 14, 
      background: '#F9F8F6', 
      border: '1px solid #EDEAE4', 
      borderRadius: 12, 
      minHeight: 180, // Changed from fixed height to min-height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      {token && (() => {
        const parts = token.split('.');
        const colors = ['#C0392B', '#2471A3', '#1E8449'];
        return (
          <div style={{ fontFamily: 'monospace', fontSize: 10, lineHeight: 1.4, wordBreak: 'break-all' }}>
            {parts.map((p, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                <span style={{ color: '#8A7F6E', fontSize: 9, fontWeight: 800, display: 'block', textTransform: 'uppercase', marginBottom: 2 }}>
                  {['Header', 'Payload', 'Signature'][i]}
                </span>
                <span style={{ color: colors[i] }}>{p}</span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  </div>
</div>

  {/* smaller forge button */}
  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, alignItems: 'center' }}>
    <button
      onClick={forgeAndFetch}
      disabled={!!parseError || stage === 'forging'}
      style={{
        padding: '10px 24px', borderRadius: 10,
        background: parseError ? '#E0DDD7' : '#1A1A1A',
        color: parseError ? '#8A7F6E' : 'white',
        fontSize: 13, fontWeight: 700,
        border: 'none', cursor: parseError ? 'not-allowed' : 'pointer',
        transition: 'all .2s',
      }}
    >
      {stage === 'forging' ? 'Forging...' : 'Forge & Verify'}
    </button>
    
    {stage !== 'idle' && (
      <button onClick={reset} style={{ background: 'none', border: 'none', color: '#8A7F6E', textDecoration: 'underline', cursor: 'pointer', fontSize: 12 }}>
        Reset
      </button>
    )}
  </div>

  {/* forged token display */}
  {forgedToken && (
    <div style={{ marginTop: 16, padding: 14, background: '#F0FFF4', border: '1px solid #C3E6CB', borderRadius: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#155724', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Generated Forged Token</div>
      <div style={{ fontFamily: 'monospace', fontSize: 10, wordBreak: 'break-all', lineHeight: 1.8, color: '#1A1A1A' }}>
        {forgedToken}
      </div>
    </div>
  )}
</div>

        {/* ── Forged user result card ── */}
        {forgedUser && (
          <div style={{ background: '#F0FFF4', border: '2px solid #28A745', borderRadius: 24, padding: 32, marginBottom: 24, animation: 'fadeIn .4s ease' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#155724', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
              Server Response — User Data Returned
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {Object.entries(forgedUser).map(([k, v]) => (
                <div key={k} style={{ padding: '14px 16px', background: 'white', borderRadius: 12, border: '1px solid #C3E6CB' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7F6E', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-all', color: k === 'role' && v === 'admin' ? '#C0392B' : '#1A1A1A' }}>
                    {String(v)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       

      </main>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
