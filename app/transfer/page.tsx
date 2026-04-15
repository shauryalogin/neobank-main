'use client';
// THIS IN NOTE FIELD: <img src=x onerror=alert(document.cookie)>

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

export default function TransferPage() {
  const router = useRouter();

  const [form, setForm] = useState({ toAccount: "", amount: "", note: "" });
  const [lastTransfer, setLastTransfer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setLastTransfer(form);
        setSuccess(true);
        setForm({ toAccount: "", amount: "", note: "" });

        const fresh = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const freshData = await fresh.json();
        if (freshData.success) {
          setUser(freshData.user);
          localStorage.setItem("user", JSON.stringify(freshData.user));
        }
      } else {
        setError(data.message || "Transfer failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F9F8F6", fontFamily: "Inter, sans-serif", color: "#1A1A1A" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "48px 64px", maxWidth: "1200px", margin: "0 auto" }}>
        
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Send Money</h1>
          <p style={{ fontSize: 16, color: "#70685C" }}>
            Transfer funds to any Neobank account instantly.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", alignItems: "start" }}>
          
          {/* Main Transaction Card */}
          <div style={{ 
            background: "white", 
            borderRadius: 24, 
            padding: "40px", 
            border: "1px solid #EDEAE4",
            boxShadow: '0 8px 24px rgba(132, 125, 110, 0.08)'
          }}>
            
            {success && lastTransfer && (
              <div style={{ 
                background: "#F0FDF4", 
                border: "1px solid #BBF7D0", 
                borderRadius: 16, 
                padding: "16px 24px", 
                marginBottom: 32,
                color: '#166534',
                fontSize: 14,
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `Transfer to <b>${lastTransfer.toAccount}</b> completed. Note: ${lastTransfer.note}`,
                  }}
                />
              </div>
            )}

            {error && (
              <div style={{ 
                background: "#FEF2F2", 
                border: "1px solid #FECACA", 
                borderRadius: 16,
                padding: "16px 24px", 
                marginBottom: 32,
                color: '#991B1B',
                fontSize: 14,
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#8A7F6E", textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Recipient Account Number</label>
                <input
                  className="custom-input"
                  placeholder="e.g. 8829410"
                  value={form.toAccount}
                  onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#8A7F6E", textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Amount ($)</label>
                <input
                  className="custom-input"
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#8A7F6E", textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Note (Optional)</label>
                <input
                  className="custom-input"
                  placeholder="What's this for?"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  background: '#1A1A1A',
                  color: 'white',
                  border: 'none',
                  borderRadius: 16,
                  padding: '18px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.1s active',
                  marginTop: '12px'
                }}
              >
                {loading ? "Processing Securely..." : "Confirm Transfer"}
              </button>
            </form>
          </div>

          {/* Balance Context Card */}
          <div style={{ position: 'sticky', top: '48px' }}>
            <div style={{ 
              background: "#1A1A1A", 
              padding: '32px', 
              borderRadius: 24, 
              color: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Available Balance</div>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 24 }}>
                ${parseFloat(user?.balance || "0").toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Account ID</div>
                <div style={{ fontFamily: 'monospace', fontSize: 14 }}>{user?.account_number || '••••••••'}</div>
              </div>
            </div>
            
            <div style={{ marginTop: 20, padding: '0 12px' }}>
              <p style={{ fontSize: 13, color: '#8A7F6E', lineHeight: 1.5 }}>
                Funds are transferred instantly between Neobank accounts. Ensure the recipient ID is correct.
              </p>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        .custom-input {
          width: 100%;
          padding: 16px 20px;
          background: #F9F8F6;
          border: 1px solid #EDEAE4;
          border-radius: 16px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .custom-input:focus {
          border-color: #1A1A1A;
          background: white;
          box-shadow: 0 0 0 4px rgba(26, 26, 26, 0.05);
        }
      `}</style>
    </div>
  );
}