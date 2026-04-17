import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isCheckingAuth, login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ email: '', password: '', full_name: '' });
  const [authError, setAuthError] = useState('');

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <span className="text-[10px] font-mono tracking-widest uppercase">Initializing neural auth...</span>
      </div>
    );
  }

  if (!user) {
    const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      const res = authMode === 'login' 
        ? await login(authData) 
        : await register(authData);
        
      if (!res.success) {
        setAuthError(res.error || 'Authentication failed');
      } else if (authMode === 'register') {
        setAuthMode('login');
        setAuthError('Account created! Please login.');
      }
    };

    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center p-6 z-[9999]">
        <div className="w-full max-w-md bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_#000] p-10 space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="text-center space-y-2">
             <div className="inline-block p-3 bg-zinc-800 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-emerald-400" />
             </div>
             <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">PAGEFORGE</h1>
             <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Identify to proceed</p>
           </div>

           <form onSubmit={handleAuthSubmit} className="space-y-6">
              {authMode === 'register' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Full Name</label>
                  <input 
                    required
                    value={authData.full_name}
                    onChange={(e) => setAuthData({...authData, full_name: e.target.value})}
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Neural ID (Email)</label>
                <input 
                  required
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  type="email" 
                  placeholder="name@nexus.com" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Access Protocol (Password)</label>
                <input 
                  required
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded-lg text-center flex items-center justify-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   {authError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl uppercase text-sm tracking-widest transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] active:scale-95"
              >
                {authMode === 'login' ? 'Infiltrate System (Login)' : 'Initialize Core (Register)'}
              </button>
           </form>

           <div className="text-center pt-4">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-[11px] font-bold text-zinc-600 hover:text-white uppercase transition-colors"
              >
                {authMode === 'login' ? "Don't have an ID? Register" : "Already have an ID? Login"}
              </button>
           </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
