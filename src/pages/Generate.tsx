import React, { useState, useEffect, useRef } from 'react';
import { 
  Link2, FileText, Zap, ArrowRight, Loader2, Terminal as TerminalIcon, 
  CheckCircle2, AlertCircle, Layout, Code2, Eye, FileJson, FileCode, Search,
  ChevronRight, Download, Maximize2, History, MessageSquare, Send, Sparkles, FolderTree, ArrowLeft, ChevronDown, ChevronUp
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Types
interface LogEntry {
  message: string;
  time: string;
  type: 'info' | 'success' | 'error';
}

interface SessionFile {
  name: string;
  size: number;
  url: string;
  ext: string;
}

interface Stage {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

// Highlighting is now handled by react-syntax-highlighter

export default function Generate() {
  const { sessionId: routeSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<'form' | 'split'>('form');
  const [formMode, setFormMode] = useState<'link' | 'text'>('link');
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionFiles, setSessionFiles] = useState<SessionFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SessionFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [previewTab, setPreviewTab] = useState<'preview' | 'code'>('preview');
  const [chatInput, setChatInput] = useState('');

  // Pipeline Stages
  const [stages, setStages] = useState<Stage[]>([
    { id: 'scrape', name: 'Scraping target data', status: 'pending' },
    { id: 'synthesis', name: 'Synthesizing product info', status: 'pending' },
    { id: 'design', name: 'Generating design system', status: 'pending' },
    { id: 'strategy', name: 'Defining marketing strategy', status: 'pending' },
    { id: 'plan', name: 'Planning page structure', status: 'pending' },
    { id: 'content', name: 'Generating module content', status: 'pending' },
    { id: 'code', name: 'Fusing style & code', status: 'pending' },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const logCountRef = useRef<number>(0);
  const API_BASE = "";

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    setIsPublished(false);
    setIsDirty(false);
    setLogs([{ message: "NEURAL_LINK_ESTABLISHED", time: new Date().toLocaleTimeString(), type: 'info' }]);
    logCountRef.current = 0;
    setProgress(5);
    setViewMode('split');
    
    // Reset stages
    setStages(prev => prev.map(s => ({ ...s, status: 'pending' })));

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, user_id: user?.id || "demo_user" })
      });
      const data = await response.json();
      setSessionId(data.session_id);
      navigate(`/generate/${data.session_id}`, { replace: true });
    } catch (err) {
      setLogs(prev => [...prev, { message: "CORE_FAILURE: API_UNREACHABLE", time: new Date().toLocaleTimeString(), type: 'error' }]);
      setIsGenerating(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !sessionId || isGenerating) return;
    const prompt = chatInput.trim();
    setChatInput('');
    setIsGenerating(true);
    setLogs(prev => [...prev, { message: `MODIFICATION_REQUEST: ${prompt}`, time: new Date().toLocaleTimeString(), type: 'info' }]);
    
    try {
      await fetch(`${API_BASE}/api/refactor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, prompt })
      });
    } catch (err) {
      setLogs(prev => [...prev, { message: "CORE_FAILURE: API_UNREACHABLE", time: new Date().toLocaleTimeString(), type: 'error' }]);
      setIsGenerating(false);
    }
  };

  const fetchSessionFiles = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/session/${id}/files`);
      if (res.ok) {
        const files = await res.json();
        setSessionFiles(files);
        // Only set default if no file is selected OR if the selected file doesn't belong to this latest session
        if ((!selectedFile || !files.find((f: SessionFile) => f.name === selectedFile.name)) && files.length > 0) {
          const mainFile = files.find((f: SessionFile) => f.name === 'final_page.html') || files[files.length - 1];
          setSelectedFile(mainFile);
        }
      }
    } catch (e) { console.error(e); }
  };

  // Logic to update stages based on logs/progress
  const updateStagesFromLogs = (logList: LogEntry[]) => {
    const logText = logList.map(l => l.message).join(' ');
    setStages(current => current.map(stage => {
      let status = stage.status;
      
      const markers: Record<string, { start: string, end: string }> = {
        scrape: { start: 'RÉCUPÉRATION', end: 'SYNTHÈSE' },
        synthesis: { start: 'SYNTHÈSE', end: 'DESIGN' },
        design: { start: 'DESIGN', end: 'STRATÉGIES' },
        strategy: { start: 'STRATÉGIES', end: 'PLANIFICATION' },
        plan: { start: 'PLANIFICATION', end: 'RÉDACTION' },
        content: { start: 'RÉDACTION', end: 'HTML FINAL' },
        code: { start: 'HTML FINAL', end: 'TERMINÉE' },
      };

      const m = markers[stage.id];
      if (logText.includes(m.end)) status = 'completed';
      else if (logText.includes(m.start)) status = 'active';
      
      // Final override
      if (logText.includes('PAGE TERMINÉE')) status = 'completed';
      if (logText.includes('ERREUR')) {
          // Find which one was active and mark it error
          if (status === 'active') status = 'error';
      }

      return { ...stage, status };
    }));
  };

  useEffect(() => {
    updateStagesFromLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (selectedFile) {
      fetch(`${API_BASE}${selectedFile.url}`)
        .then(res => res.text())
        .then(text => setFileContent(text))
        .catch(e => console.error(e));
    }
  }, [selectedFile]);

  useEffect(() => {
    let interval: number | null = null;
    if (sessionId && isGenerating) {
      interval = window.setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/status/${sessionId}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data?.logs) {
            const currentCount = logCountRef.current;
            if (data.logs.length > currentCount) {
              const newLogs = data.logs.slice(currentCount).map((l: string) => ({
                message: l.split('] ')[1] || l,
                time: l.match(/\[(.*?)\]/)?.[1] || new Date().toLocaleTimeString(),
                type: (l.includes('ERREUR') || l.includes('❌')) ? 'error' : (l.includes('réussie') || l.includes('Succès') || l.includes('✅') || l.includes('✨')) ? 'success' : 'info'
              }));
              logCountRef.current = data.logs.length;
              setLogs(prev => [...prev, ...newLogs]);
            }
          }
          if (data?.progress !== undefined) setProgress(data.progress);
          fetchSessionFiles(sessionId);
          
          // RE-FETCH selected file content to show "streaming" updates
          if (selectedFile) {
            try {
              const fileRes = await fetch(`${API_BASE}${selectedFile.url}`);
              if (fileRes.ok) {
                const text = await fileRes.text();
                if (text !== fileContent) setFileContent(text);
              }
            } catch (fe) { console.error("File update failed", fe); }
          }

          if (data.status === 'completed' || data.status === 'failed') {
            setIsGenerating(false);
            if (data.status === 'completed' && sessionId) {
               setIsDirty(true); // Any completion from orchestrator means local is newer
            }
            if (interval) clearInterval(interval);
          }
        } catch (e) { console.error(e); }
      }, 1500);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [sessionId, isGenerating]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, showDetails]);
  useEffect(() => {
    const sid = routeSessionId || new URLSearchParams(window.location.search).get('session_id');
    if (sid && sid !== sessionId) {
      setSessionId(sid);
      setViewMode('split');
      // Sync state from server
      fetch(`${API_BASE}/api/status/${sid}`)
        .then(res => res.json())
        .then(data => {
            if (data.logs) {
              const formattedLogs = data.logs.map((l: string) => ({
                message: l.split('] ')[1] || l,
                time: l.match(/\[(.*?)\]/)?.[1] || new Date().toLocaleTimeString(),
                type: (l.includes('ERREUR') || l.includes('❌')) ? 'error' : 
                      (l.includes('réussie') || l.includes('Succès') || l.includes('✅') || l.includes('✨')) ? 'success' : 'info'
              }));
              setLogs(formattedLogs);
              logCountRef.current = data.logs.length;
            }
            if (data.progress) setProgress(data.progress);
            if (data.url) setUrl(data.url);
            if (data.result_url && data.result_url.startsWith('http')) {
               setIsPublished(true);
               setIsDirty(false);
            }
            // If the status is still processing, make sure isGenerating is true to trigger polling
            if (data.status === 'processing' || data.status === 'starting') {
              setIsGenerating(true);
            }
        })
        .catch(err => console.error("Failed to recover session", err));
      fetchSessionFiles(sid);
    }
  }, [routeSessionId]);

  if (!user) {
    return null;
  }

  if (viewMode === 'split') {
    return (
      <div className="w-full h-[calc(100vh-120px)] flex bg-zinc-950 text-zinc-300 overflow-hidden font-sans relative z-10">
        
        {/* PANEL 1: CONVERSATIONAL CHAT */}
        <div className="w-80 lg:w-[450px] shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950 min-h-0">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Agent Chat</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded flex items-center gap-2">
                 <span className={cn("w-1.5 h-1.5 rounded-full", isGenerating ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")}></span>
                 {isGenerating ? 'PROCESSING' : 'IDLE'}
               </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* 1. User Message (The Link) */}
            <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-lg">
                  <p className="text-xs font-bold mb-1 opacity-70">Source Flux</p>
                  <p className="text-sm break-all font-mono">{url}</p>
               </div>
               <span className="text-[9px] font-bold text-zinc-600 uppercase px-2">{user.name} • Just now</span>
            </div>

            {/* 2. AI Pipeline Card */}
            <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
               <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none overflow-hidden shadow-2xl">
                  {/* Card Header */}
                  <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex justify-between items-center text-sm font-bold text-white">
                     <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Generating landing page
                     </div>
                     <Zap className="w-3.5 h-3.5 text-zinc-600" />
                  </div>

                  {/* Card Content - Progress Checklist */}
                  <div className="p-5 space-y-4">
                     {stages.map((stage, idx) => {
                        if (stage.status === 'pending' && idx > 0 && stages[idx-1].status !== 'completed') return null;
                        return (
                          <div key={stage.id} className="flex items-center gap-3 group animate-in fade-in slide-in-from-left-1">
                             <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                stage.status === 'completed' ? "bg-emerald-500/20 text-emerald-500" :
                                stage.status === 'active' ? "bg-blue-500/20 text-blue-400 animate-pulse" :
                                stage.status === 'error' ? "bg-red-500/20 text-red-500" : "bg-zinc-800 text-zinc-600"
                             )}>
                                {stage.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                                 stage.status === 'active' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                                 stage.status === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> :
                                 <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                             </div>
                             <span className={cn(
                                "text-xs font-medium transition-colors",
                                stage.status === 'active' ? "text-white" :
                                stage.status === 'completed' ? "text-zinc-400" : "text-zinc-600"
                             )}>
                                {stage.name}
                             </span>
                          </div>
                        );
                     })}
                  </div>

                  {/* Card Footer - Controls */}
                  <div className="p-3 bg-zinc-950/50 border-t border-zinc-800/50 flex gap-2">
                     <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                     >
                        {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {showDetails ? 'Hide Details' : 'Show Details'}
                     </button>
                     {!isGenerating && (
                       <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white [10px] font-bold uppercase tracking-wider rounded-lg transition-all">
                          Preview Result
                       </button>
                     )}
                  </div>
               </div>
               <span className="text-[9px] font-bold text-zinc-600 uppercase px-2">Agent-Cli • Working</span>
            </div>

            {/* 3. Detailed Logs (Collapsible) */}
            {showDetails && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 text-[10px] font-mono leading-relaxed opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                    <span className={cn(
                      log.type === 'error' ? "text-red-400" : 
                      log.type === 'success' ? "text-emerald-400" : "text-zinc-400"
                    )}>{log.message}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/10">
            <div className="relative group">
               <input 
                disabled={isGenerating || !sessionId} 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleChatSubmit();
                }}
                placeholder={isGenerating ? "Agent is processing current task..." : !sessionId ? "Waiting for active session..." : "Type a command to edit the page..."} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:opacity-50 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button 
                    onClick={handleChatSubmit}
                    disabled={isGenerating || !sessionId || !chatInput.trim()}
                    className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 flex items-center justify-center text-white disabled:text-zinc-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: COMPACT FILE EXPLORER */}
        {previewTab === 'code' && (
          <div className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col min-h-0">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <FolderTree className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">VFS_Explorer</span>
             </div>
             <Search className="w-3 h-3 text-zinc-600" />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {sessionFiles.map((file, i) => (
              <button
                key={i}
                onClick={() => setSelectedFile(file)}
                className={cn(
                  "w-full text-left p-2 rounded-md text-[11px] font-medium flex items-center gap-2 transition-all mb-0.5 group",
                  selectedFile?.name === file.name ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-300"
                )}
              >
                {file.ext === 'json' ? <FileJson className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-500" /> : 
                 file.url.includes('html') ? <Code2 className="w-3.5 h-3.5 text-rose-500/50 group-hover:text-rose-500" /> :
                 <FileCode className="w-3.5 h-3.5 text-blue-500/50 group-hover:text-blue-500" />}
                <span className="truncate">{file.name}</span>
                {selectedFile?.name === file.name && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* PANEL 3: MAIN VIEWER AREA */}
        <div className="flex-1 min-w-0 flex flex-col bg-zinc-950 min-h-0">
          <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md z-10 shadow-sm">
            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800/50">
              <button 
                onClick={() => setPreviewTab('preview')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                  previewTab === 'preview' ? "bg-zinc-800 text-white shadow-inner border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Eye className="w-3 h-3" />
                Preview
              </button>
              <button 
                onClick={() => setPreviewTab('code')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                  previewTab === 'code' ? "bg-zinc-800 text-white shadow-inner border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Code2 className="w-3 h-3" />
                Code
              </button>
            </div>
            
            <div className="flex items-center gap-4">
                {sessionId && !isGenerating && (
                 <button 
                    onClick={async () => {
                      setIsPublishing(true);
                      try {
                        const res = await fetch(`${API_BASE}/api/publish`, { method: 'POST', body: JSON.stringify({ session_id: sessionId }), headers: {'Content-Type': 'application/json'} });
                        const data = await res.json();
                        if (data.url) {
                          setIsPublished(true);
                          setIsDirty(false);
                          window.open(data.url, '_blank');
                        }
                      } finally {
                        setIsPublishing(false);
                      }
                    }}
                    disabled={isPublishing}
                    className={cn(
                      "flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-white transition-all px-5 py-2.5 rounded-lg",
                      isPublishing ? "bg-zinc-800" : 
                      isDirty ? "bg-blue-600 hover:bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.4)]" :
                      isPublished ? "bg-emerald-600 hover:bg-emerald-500" : "bg-zinc-800 hover:bg-zinc-700"
                    )}
                 >
                   {isPublishing ? <Loader2 className="w-4 h-4 animate-spin"/> : 
                    isDirty ? <Sparkles className="w-4 h-4 text-amber-300" /> :
                    isPublished ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Zap className="w-4 h-4 text-amber-300" />}
                   {isPublishing ? "Publishing..." : 
                    isDirty ? "Update Live Page" :
                    isPublished ? "Live on Vercel" : "Publish to Web"}
                 </button>
               )}
            </div>
          </div>

          <div className="flex-1 relative">
            {previewTab === 'preview' && selectedFile?.ext === 'html' ? (
              <div className="w-full h-full bg-white">
                <iframe src={`${API_BASE}${selectedFile.url}`} className="w-full h-full border-none" />
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto bg-zinc-950 custom-scrollbar absolute inset-0">
                <SyntaxHighlighter
                  language={selectedFile?.ext === 'html' ? 'xml' : selectedFile?.ext === 'js' || selectedFile?.ext === 'jsx' ? 'javascript' : selectedFile?.ext || 'text'}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '2rem', fontSize: '13px', background: 'transparent', minHeight: '100%' }}
                  showLineNumbers={true}
                >
                  {fileContent}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Initial Form Layout
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 md:px-0">
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-3xl">
         <div className="flex items-center gap-4 px-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-black">
               {user.name.charAt(0)}
            </div>
            <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase">Authenticated User</p>
               <p className="text-sm font-bold text-white tracking-tight">{user.name}</p>
            </div>
         </div>
         <button 
          onClick={logout}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
         >
           Identity_Purge (Logout)
         </button>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase text-white border-4 border-white inline-block px-4 py-2 italic bg-zinc-950 shadow-[8px_8px_0px_#10B981]">PAGEFORGE</h1>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] font-bold animate-pulse">Advanced Neural Orchestration Core V2.0</p>
      </div>

      <div className="bg-zinc-900 border-4 border-zinc-800 p-12 shadow-[12px_12px_0px_#000] rounded-3xl">
        <div className="flex gap-6 mb-10">
          <button 
            onClick={() => setFormMode('link')}
            className={cn(
              "flex-1 py-8 border-2 border-zinc-800 rounded-3xl flex items-center justify-center gap-4 font-black uppercase transition-all text-sm tracking-widest",
              formMode === 'link' ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] -translate-y-1" : "bg-zinc-950 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            )}
          >
            <Link2 className="w-6 h-6" />
            Inject Product Link
          </button>
          <button 
            onClick={() => setFormMode('text')}
            className={cn(
              "flex-1 py-8 border-2 border-zinc-800 rounded-3xl flex items-center justify-center gap-4 font-black uppercase transition-all text-sm tracking-widest",
              formMode === 'text' ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] -translate-y-1" : "bg-zinc-950 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            )}
          >
            <FileText className="w-6 h-6" />
            Direct Description
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Vectored_Input_Source</label>
               <span className="text-[9px] font-mono text-zinc-300">PROTO_VERSION: 1.0.4</span>
            </div>
            <div className="relative group">
              <input 
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={formMode === 'link' ? "https://www.alibaba.com/..." : "Describe the target..."}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:opacity-30"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isGenerating}
            className="w-full py-8 bg-emerald-600 text-white rounded-3xl shadow-[0_15px_40px_rgba(16,185,129,0.2)] flex items-center justify-center gap-6 font-black text-2xl uppercase hover:bg-emerald-500 hover:-translate-y-1 transition-all disabled:opacity-50 group border border-emerald-400/30"
          >
            {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 group-hover:scale-125 transition-transform" />}
            {isGenerating ? "ORCHESTRATING..." : "DEPLOY_NEURAL_AGENTS"}
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-3 gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="p-4 border-2 border-dashed border-zinc-800 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400">01</div>
            <div className="text-[10px] font-mono uppercase text-zinc-500">Multi-Agent<br/>Sync</div>
         </div>
         <div className="p-4 border-2 border-dashed border-zinc-800 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400">02</div>
            <div className="text-[10px] font-mono uppercase text-zinc-500">Real-time<br/>VFS Stream</div>
         </div>
         <div className="p-4 border-2 border-dashed border-zinc-800 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400">03</div>
            <div className="text-[10px] font-mono uppercase text-zinc-500">Dynamic<br/>UI Forge</div>
         </div>
      </div>
    </div>
  );
}
