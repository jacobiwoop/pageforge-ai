import React, { useState, useEffect, useRef } from 'react';
import { Link2, FileText, Zap, ArrowRight, Loader2, Terminal as TerminalIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogEntry {
  message: string;
  time: string;
  type: 'info' | 'success' | 'error';
}

export default function Generate() {
  const [mode, setMode] = useState<'link' | 'text'>('link');
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const logCountRef = useRef<number>(0);

  const API_BASE = "http://localhost:8000";

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    setLogs([{ message: "INITIALIZATION_NEURAL_PIPE...", time: new Date().toLocaleTimeString(), type: 'info' }]);
    logCountRef.current = 0;
    setResultUrl(null);
    setProgress(5);

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, user_id: "demo_user" })
      });
      const data = await response.json();
      setSessionId(data.session_id);
    } catch (err) {
      setLogs(prev => [...prev, { message: "CONNECTION_FAILURE_TO_CORE_AI", time: new Date().toLocaleTimeString(), type: 'error' }]);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let interval: number | null = null;

    if (sessionId && isGenerating) {
      interval = window.setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/status/${sessionId}`);
          
          if (res.status === 404) {
             setIsGenerating(false);
             setSessionId(null);
             if (interval) clearInterval(interval);
             setLogs(prev => [...prev, { message: "SESSION_EXPIRED_OR_SERVER_RESTART", time: new Date().toLocaleTimeString(), type: 'error' }]);
             return;
          }

          if (!res.ok) return;
          const data = await res.json();
          
          if (data?.logs && Array.isArray(data.logs)) {
            const currentCount = logCountRef.current;
            if (data.logs.length > currentCount) {
              const newLogs = data.logs.slice(currentCount).map((l: string) => ({
                message: l.split('] ')[1] || l,
                time: l.match(/\[(.*?)\]/)?.[1] || new Date().toLocaleTimeString(),
                type: l.includes('ERREUR') || l.includes('❌') ? 'error' : (l.includes('réussie') || l.includes('Succès') || l.includes('✅') || l.includes('✨') ? 'success' : 'info') as 'info' | 'success' | 'error'
              }));
              logCountRef.current = data.logs.length;
              setLogs(prev => [...prev, ...newLogs]);
            }
          }
          
          if (data?.progress !== undefined) setProgress(data.progress);

          if (data.status === 'completed') {
            setIsGenerating(false);
            setSessionId(null);
            setResultUrl(data.result_url);
            if (interval) clearInterval(interval);
          } else if (data.status === 'failed') {
            setIsGenerating(false);
            setSessionId(null);
            if (interval) clearInterval(interval);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 1500);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [sessionId, isGenerating]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2">GENERATE_UNIT</h1>
        <p className="text-sm font-mono text-gray-500 uppercase">MULTI_AGENT_ORCHESTRATION_INTERFACE</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white brutalist-border p-8 brutalist-shadow">
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setMode('link')}
                className={cn(
                  "flex-1 py-4 brutalist-border flex items-center justify-center gap-2 font-bold uppercase transition-all",
                  mode === 'link' ? "bg-[var(--color-neon)] brutalist-shadow-sm translate-x-[-2px] translate-y-[-2px]" : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <Link2 className="w-5 h-5" />
                LINK_INJECT
              </button>
              <button 
                onClick={() => setMode('text')}
                className={cn(
                  "flex-1 py-4 brutalist-border flex items-center justify-center gap-2 font-bold uppercase transition-all",
                  mode === 'text' ? "bg-[var(--color-neon)] brutalist-shadow-sm translate-x-[-2px] translate-y-[-2px]" : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <FileText className="w-5 h-5" />
                DESC_INJECT
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              {mode === 'link' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider">SOURCE_URL_INPUT</label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="url" 
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://french.alibaba.com/product-detail/..." 
                      className="w-full pl-12 pr-4 py-4 brutalist-border bg-[#f4f4f5] font-mono text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-neon)]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider">RAW_DESCRIPTION_FLUX</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Describe the product specifics..." 
                    className="w-full p-4 brutalist-border bg-[#f4f4f5] font-mono text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-neon)] resize-none"
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full py-5 bg-black text-[var(--color-neon)] brutalist-border brutalist-shadow flex items-center justify-center gap-3 font-bold text-lg uppercase hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    PROCESSING_STREAM...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    START_ORCHESTRATION
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {(isGenerating || logs.length > 0) && (
            <div className="bg-black text-[#00FF41] brutalist-border brutalist-shadow p-6 font-mono text-sm overflow-hidden h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-[#00FF41]/30 pb-2">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4" />
                  <span className="uppercase tracking-widest text-xs font-bold">Activity_Flux_V1.0</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-[10px] animate-pulse">● SYSTEM_ONLINE</div>
                   <div className="text-[10px]">{progress}%</div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#00FF41]/20">
                {logs.map((log, i) => (
                  <div key={i} className={cn(
                    "flex gap-3 animate-in fade-in slide-in-from-left-1 duration-200",
                    log.type === 'error' ? "text-red-500" : log.type === 'success' ? "text-white font-bold" : ""
                  )}>
                    <span className="opacity-40 select-none">[{log.time}]</span>
                    <span className="flex-1 tracking-tight">
                      {log.type === 'success' && <CheckCircle2 className="inline w-3 h-3 mr-1" />}
                      {log.type === 'error' && <AlertCircle className="inline w-3 h-3 mr-1" />}
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {resultUrl && (
                <div className="mt-4 pt-4 border-t border-[#00FF41]/30 animate-in bounce-in">
                  <a 
                    href={`${API_BASE}${resultUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between bg-[#00FF41] text-black px-4 py-3 font-bold uppercase text-xs hover:bg-white transition-colors"
                  >
                    <span>Page_Generation_Complete_View_Result</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white brutalist-border p-6 border-r-8 border-b-8 border-black">
            <h3 className="font-bold uppercase mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--color-neon)]" />
              SYSTEM_INTEL
            </h3>
            <div className="space-y-4 text-xs font-mono uppercase">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Model</span>
                <span className="font-bold">Qwen_3.5_Cloud</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Session_Lock</span>
                <span className="font-bold">Multi_ISO_Active</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Latency</span>
                <span className="font-bold">~24ms</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-neon)] brutalist-border p-6 brutalist-shadow">
            <h3 className="font-bold uppercase mb-2">QUICK_TIP</h3>
            <p className="text-xs font-mono leading-relaxed">
              Use high-quality product links with detailed specifications to get the best AI copywriting results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
