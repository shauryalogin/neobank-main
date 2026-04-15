"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

export default function TransferPage() {
  const router = useRouter();
  const [form, setForm] = useState({ toAccount: "", amount: "", note: "" });
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
      } else setError(data.message || "Transfer failed.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginBottom: "24px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b6355",
    letterSpacing: "0.01em",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F9F8F6", fontFamily: "Inter, sans-serif", color: "#1A1A1A" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "48px 64px", maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Send money</h1>
          <p style={{ fontSize: 16, color: "#70685C" }}>Transfer funds to any Neobank account instantly.</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
          
          {/* Main Form Card */}
          <div style={{ 
            background: "white", 
            borderRadius: 20, 
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(132, 125, 110, 0.08)",
            border: "1px solid #EDEAE4" 
          }}>
            {success && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "16px 20px", marginBottom: 32, fontSize: 14, color: "#15803D", display: "flex", alignItems: "center", gap: 12 }}>
                <span>✨</span>
                <span dangerouslySetInnerHTML={{ __html: `Transfer to <b>${form.toAccount}</b> completed.` }} />
              </div>
            )}
            
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "16px 20px", marginBottom: 32, fontSize: 14, color: "#DC2626", display: "flex", alignItems: "center", gap: 12 }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={inputContainerStyle}>
                <label style={labelStyle}>Recipient account number</label>
                <input
                  className="custom-input"
                  type="text"
                  placeholder="NEO-XXXX-XXXX"
                  value={form.toAccount}
                  onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
                  required
                />
              </div>

              <div style={inputContainerStyle}>
                <label style={labelStyle}>Amount (USD)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#A39A8B", fontWeight: 500 }}>$</span>
                  <input
                    className="custom-input"
                    style={{ paddingLeft: "32px" }}
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={inputContainerStyle}>
                <label style={labelStyle}>Note <span style={{ fontWeight: 400, color: "#A39A8B" }}>(optional)</span></label>
                <input
                  className="custom-input"
                  type="text"
                  placeholder="What's this for?"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 12,
                  background: "#1A1A1A",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  marginTop: "8px"
                }}
              >
                {loading ? "Processing..." : "Confirm Transfer"}
              </button>
            </form>
          </div>

          {/* Sidebar Info Panels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Balance Card */}
            <div style={{ 
              background: "white", 
              border: "1px solid #EDEAE4", 
              borderRadius: 20, 
              padding: "24px",
              boxShadow: "0 4px 12px rgba(132, 125, 110, 0.04)"
            }}>
              <div style={{ fontSize: 11, color: "#8A7F6E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Available Balance</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
                ${parseFloat(user?.balance || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 13, color: "#A39A8B", marginTop: 8, fontFamily: "monospace" }}>{user?.account_number}</div>
            </div>

            {/* Info Badges */}
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 16, padding: "20px", fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
              <strong style={{ display: "block", marginBottom: 4 }}>Instant Transfer</strong>
              Transfers to Neobank members are completed in real-time with zero fees.
            </div>

            <div style={{ background: "white", border: "1px solid #EDEAE4", borderRadius: 16, padding: "20px", fontSize: 13, color: "#70685C", lineHeight: 1.5 }}>
              <strong style={{ display: "block", color: "#1A1A1A", marginBottom: 4 }}>Security Notice</strong>
              Large transfers may be held for up to 24 hours for manual verification.
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #EDEAE4;
          borderRadius: 16px;
          fontSize: 15px;
          background: #FAFAFA;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
        }
        .custom-input:focus {
          background: white;
          border-color: #1A1A1A;
          box-shadow: 0 0 0 4px rgba(26, 26, 26, 0.05);
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}