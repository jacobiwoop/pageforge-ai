import React, { useState, useEffect } from 'react';
import { Shield, Key, Cloud, LogOut, CheckCircle2, AlertCircle, Loader2, ExternalLink, RefreshCw, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Identifiant() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [opencodeKey, setOpencodeKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const API_BASE = "http://localhost:8000";

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/status`);
      const data = await res.json();
      setStatus(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleOllamaSignin = async () => {
    setActionLoading('ollama');
    try {
      const res = await fetch(`${API_BASE}/api/auth/ollama/signin`, { method: 'POST' });
      const data = await res.json();
      if (data.url) setOllamaUrl(data.url);
      fetchStatus();
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleOllamaSignout = async () => {
    setActionLoading('ollama');
    try {
      await fetch(`${API_BASE}/api/auth/ollama/signout`, { method: 'POST' });
      setOllamaUrl(null);
      fetchStatus();
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleOpencodeLogin = async () => {
    if (!opencodeKey) return;
    setActionLoading('opencode');
    try {
      const res = await fetch(`${API_BASE}/api/auth/opencode/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: opencodeKey })
      });
      if (res.ok) {
        setOpencodeKey('');
        fetchStatus();
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 animate-spin text-black" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b-4 border-black pb-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">IDENTITY_VAULT</h1>
          <p className="text-xs font-mono text-gray-500 mt-1 uppercase">AUTHENTICATION_GATEWAY_V1.0.4</p>
        </div>
        <Shield className="w-10 h-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* OLLAMA CLOUD SECTION */}
        <div className="bg-white brutalist-border p-8 flex flex-col brutalist-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Cloud className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-black uppercase">Ollama Cloud</h2>
          </div>

          <div className="flex-1 space-y-6">
            <div className={cn(
              "p-4 brutalist-border flex items-center gap-4 transition-colors",
              status?.ollama?.signed_in ? "bg-[#e0fc40]" : "bg-gray-100"
            )}>
              {status?.ollama?.signed_in ? <CheckCircle2 className="w-6 h-6 text-black" /> : <AlertCircle className="w-6 h-6 text-gray-400" />}
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Connect Status</p>
                <p className="font-bold tracking-tight">{status?.ollama?.signed_in ? 'AUTHENTICATED' : 'DISCONNECTED'}</p>
              </div>
            </div>

            {ollamaUrl && (
              <div className="p-4 bg-zinc-950 text-white rounded-none border-2 border-dashed border-zinc-700 animate-in zoom-in-95">
                <p className="text-[10px] font-mono text-zinc-500 mb-2 uppercase">Activation Link Required:</p>
                <div className="bg-zinc-900 p-2 brutalist-border border-zinc-800 mb-4">
                   <p className="text-[10px] font-mono break-all text-blue-400">{ollamaUrl}</p>
                </div>
                <a 
                  href={ollamaUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black text-xs font-black uppercase hover:bg-zinc-200 transition-colors"
                >
                  Authorize Browser <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <button 
                onClick={handleOllamaSignin}
                disabled={actionLoading === 'ollama'}
                className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5"
              >
                {actionLoading === 'ollama' ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                OLLAMA_SIGNIN_PROTOCOL
              </button>
              {status?.ollama?.signed_in && (
                <button 
                  onClick={handleOllamaSignout}
                  disabled={actionLoading === 'ollama'}
                  className="w-full py-4 bg-white border-2 border-black text-black font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  SIGN_OUT
                </button>
              )}
            </div>
          </div>
        </div>

        {/* OPENCODE SECTION */}
        <div className="bg-white brutalist-border p-8 flex flex-col brutalist-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-black uppercase">OpenCode API</h2>
          </div>

          <div className="flex-1 space-y-6">
            <div className={cn(
              "p-4 brutalist-border flex items-center gap-4 transition-colors",
              status?.opencode?.signed_in ? "bg-[#e0fc40]" : "bg-gray-100"
            )}>
              {status?.opencode?.signed_in ? <CheckCircle2 className="w-6 h-6 text-black" /> : <AlertCircle className="w-6 h-6 text-gray-400" />}
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Connect Status</p>
                <p className="font-bold tracking-tight">{status?.opencode?.signed_in ? `ACTIVE_SESSION (${status.opencode.provider})` : 'NO_CREDENTIALS'}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="text-[11px] font-black uppercase text-gray-500 mb-2 block tracking-widest">Inject API Key</label>
                <input 
                  type="password"
                  value={opencodeKey}
                  onChange={(e) => setOpencodeKey(e.target.value)}
                  placeholder="▪▪▪▪▪▪▪▪▪▪▪▪▪"
                  className="w-full brutalist-border p-4 font-mono text-sm focus:outline-none focus:bg-[#f4f4f5] border-black border-2"
                />
              </div>

              <button 
                onClick={handleOpencodeLogin}
                disabled={!opencodeKey || actionLoading === 'opencode'}
                className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:bg-gray-400"
              >
                {actionLoading === 'opencode' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                LOAD_CREDENTIALS
              </button>
              
              <div className="mt-6 p-4 bg-zinc-100 brutalist-border text-[9px] font-mono text-gray-500 uppercase leading-relaxed">
                <p className="font-black text-black mb-1">Warning:</p>
                Injecting a new key will immediately rewrite the local authentication profile.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REFRESH BAR */}
      <div className="flex justify-center p-4">
        <button 
          onClick={fetchStatus}
          className="text-[11px] font-black uppercase underline decoration-4 underline-offset-4 hover:text-emerald-600 transition-colors"
        >
          FORCE_VAULT_RESCAN
        </button>
      </div>
    </div>
  );
}
