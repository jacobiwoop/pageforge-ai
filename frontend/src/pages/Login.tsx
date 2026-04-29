import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Eye, EyeOff, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login({ email, password });
    setIsLoading(false);
    
    if (res.success) {
      navigate("/app");
    } else {
      setError(res.error || "Identifiants invalides");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      {/* Left Side: Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C3AFF] via-[#FF3A8C] to-[#FF6B35] animate-[gradient_8s_ease_infinite] bg-[length:200%_200%] opacity-80" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 text-center w-full max-w-lg">
          <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#FF3A8C]" />
            </div>
            <span className="font-black text-4xl tracking-tight">PageForge</span>
          </div>
          
          <h2 className="text-5xl font-black mb-8 leading-tight drop-shadow-xl text-white">
            Vos pages produit,<br />générées en 10 secondes.
          </h2>

          <div className="relative mt-12 w-full aspect-video rounded-xl bg-[#111111]/80 backdrop-blur-md border border-white/20 shadow-2xl p-4 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            {/* Editor Mockup */}
            <div className="w-full h-4 flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="w-full flex gap-4 h-full pb-4">
              <div className="w-1/3 bg-white/5 rounded-md" />
              <div className="w-2/3 bg-white/10 rounded-md" />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur border border-white/10 text-xs font-bold text-white/90 shadow-lg">✦ +2 400 boutiques</span>
            <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur border border-white/10 text-xs font-bold text-white/90 shadow-lg">⭐ 4.9/5</span>
            <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur border border-white/10 text-xs font-bold text-white/90 shadow-lg">⚡ 10 sec</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur PageForge</h1>
            <p className="text-[#888888]">Connectez-vous pour continuer</p>
          </div>

          <div className="space-y-4 mb-8">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continuer avec Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-medium bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Continuer avec Facebook
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative bg-[#0A0A0A] px-4 text-sm text-[#888888]">ou</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#888888]">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3A8C] transition-colors"
                placeholder="vous@exemple.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#888888]">Mot de passe</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3A8C] transition-colors"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded accent-[#FF3A8C] w-4 h-4 bg-[#111111] border-white/10" />
                <span className="text-[#888888]">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-[#FF3A8C] hover:underline">Mot de passe oublié ?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-primary font-bold text-white shadow-lg mt-4 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center mt-8 text-[#888888] text-sm">
            Pas encore de compte ? <Link to="/onboarding" className="text-white hover:underline font-medium">Créer un compte →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

