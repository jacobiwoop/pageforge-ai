import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isCheckingAuth, login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ email: '', password: '', full_name: '' });
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-4 text-black">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-neon-dark)]" />
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Initializing secure connection...</span>
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
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 sm:p-6 z-[9999] overflow-y-auto">
        <div className="w-full max-w-[440px] bg-white border-4 border-black shadow-[12px_12px_0px_#000] p-6 sm:p-10 my-8 animate-in fade-in zoom-in duration-300">
           <div className="text-center space-y-2 mb-8">
              <div className="inline-block p-4 bg-[var(--color-neon)] brutalist-border-thick rounded-none mb-4 rotate-3">
                 <Sparkles className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic leading-none">PAGEFORGE</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Identify to proceed</p>
           </div>

           <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-black uppercase px-1">Full Name</label>
                  <input 
                    required
                    value={authData.full_name}
                    onChange={(e) => setAuthData({...authData, full_name: e.target.value})}
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full bg-white border-2 border-black p-4 text-sm font-bold text-black focus:outline-none focus:bg-[var(--color-neon)]/10 transition-all brutalist-input-autofill"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-black uppercase px-1">Email Address</label>
                <input 
                  required
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-white border-2 border-black p-4 text-sm font-bold text-black focus:outline-none focus:bg-[var(--color-neon)]/10 transition-all brutalist-input-autofill"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-black uppercase px-1">Password</label>
                <div className="relative">
                  <input 
                    required
                    value={authData.password}
                    onChange={(e) => setAuthData({...authData, password: e.target.value})}
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="w-full bg-white border-2 border-black p-4 text-sm font-bold text-black focus:outline-none focus:bg-[var(--color-neon)]/10 transition-all brutalist-input-autofill"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-red-600 text-[11px] font-bold rounded-none flex items-center justify-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   {authError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-black hover:bg-[var(--color-neon)] text-white hover:text-black font-black py-4 border-2 border-black uppercase text-sm tracking-widest transition-all shadow-[6px_6px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95"
              >
                {authMode === 'login' ? 'Sign In' : 'Register'}
              </button>
           </form>

           <div className="text-center pt-6">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-[11px] font-black text-gray-400 hover:text-black uppercase transition-colors flex flex-col items-center gap-1 mx-auto group"
              >
                <span>{authMode === 'login' ? "Don't have an account?" : "Already have an ID?"}</span>
                <span className="text-black border-b-2 border-transparent group-hover:border-black transition-colors">
                  {authMode === 'login' ? 'Create one now' : 'Sign in here'}
                </span>
              </button>
           </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
