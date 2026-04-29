import { 
  ArrowLeft, 
  MoreHorizontal, 
  Undo, 
  Redo, 
  Share, 
  Rocket, 
  Monitor, 
  Smartphone, 
  Tablet, 
  RefreshCw, 
  ExternalLink,
  Paperclip,
  Mic,
  Zap,
  Send,
  CheckCircle2,
  ChevronDown,
  Code,
  Eye,
  Search,
  Plus,
  Download,
  Settings,
  Folder,
  FileText,
  Sparkles
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SessionFile {
  name: string;
  size: number;
  url: string;
  ext: string;
}

const FileItem = ({ name, icon, indent = 0, active = false, onClick }: { name: string, icon: React.ReactNode, indent?: number, active?: boolean, onClick?: () => void }) => (
  <div onClick={onClick} className={`flex items-center gap-1.5 py-1 text-[13px] cursor-pointer hover:bg-white/5 ${active ? 'bg-[#37373D] text-white' : 'text-[#CCC]'}`} style={{ paddingLeft: `${indent * 12 + 12}px`, paddingRight: '12px' }}>
    <span className="w-4 h-4 flex items-center justify-center shrink-0">{icon}</span>
    <span className="truncate">{name}</span>
  </div>
);

const FolderItem = ({ name, indent = 0, isOpen = false }: { name: string, indent?: number, isOpen?: boolean }) => (
  <div className="flex items-center gap-1 py-1 text-[13px] cursor-pointer hover:bg-white/5 text-[#CCC]" style={{ paddingLeft: `${indent * 12 + 4}px`, paddingRight: '12px' }}>
    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${!isOpen && '-rotate-90'}`} />
    <Folder className="w-3.5 h-3.5 shrink-0 text-[#888]" />
    <span className="truncate ml-0.5">{name}</span>
  </div>
);

const FileTab = ({ name, icon, active = false, onClick }: { name: string, icon: React.ReactNode, active?: boolean, onClick?: () => void }) => (
  <div onClick={onClick} className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-[#1E1E1E] text-[13px] ${active ? 'bg-[#1E1E1E] text-white border-t-2 border-t-[#3B82F6]' : 'bg-[#2D2D2D] text-[#888] hover:bg-[#2D2D2D]/80 border-t-2 border-t-transparent'}`}>
    {icon}
    <span>{name}</span>
  </div>
);

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [device, setDevice] = useState("desktop");
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isGenerated, setIsGenerated] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: "user", text: "Je veux une page produit pour une nouvelle paire de sneakers urbaines, édition limitée 'VOLT'." },
    { id: 2, role: "assistant", text: "Je m'en occupe ! J'ai structuré la page avec un design haute conversion. Voici le résultat.", action: "Page générée" }
  ]);
  const [inputVal, setInputVal] = useState("");

  const [status, setStatus] = useState("draft");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const logCountRef = useRef(0);

  const [sessionFiles, setSessionFiles] = useState<SessionFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SessionFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!id || id === 'new') return;
    setIsPublishing(true);
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id })
      });
      const data = await response.json();
      if (response.ok && data.url) {
        setPublishedUrl(data.url);
      } else {
        alert(data.error || "Erreur lors de la publication");
      }
    } catch (error) {
      console.error("Erreur de publication:", error);
      alert("Impossible de joindre le serveur pour publier.");
    } finally {
      setIsPublishing(false);
    }
  };

  const fetchSessionFiles = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/session/${sessionId}/files`);
      if (res.ok) {
        const files = await res.json();
        setSessionFiles(files);
        
        // Use an updater function to access the latest selectedFile safely
        setSelectedFile((prevSelected) => {
          if ((!prevSelected || !files.find((f: SessionFile) => f.name === prevSelected.name)) && files.length > 0) {
            const mainFile = files.find((f: SessionFile) => f.name === 'final_page.html') || files[files.length - 1];
            return mainFile;
          }
          return prevSelected;
        });
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (selectedFile) {
      fetch(selectedFile.url)
        .then(res => res.text())
        .then(text => setFileContent(text))
        .catch(e => console.error(e));
    }
  }, [selectedFile]);

  // Écoute en temps réel du backend
  useEffect(() => {
    // Si on est sur la page de création, on ne fait rien
    if (!id || id === 'new') return;
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/status/${id}`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data.status);
          setProgress(data.progress);
          
          // Mise à jour du chat avec les vrais messages de l'IA !
          if (data.logs && data.logs.length > logCountRef.current) {
            const newLogs = data.logs.slice(logCountRef.current);
            const liveMessages = newLogs.map((log: string, index: number) => ({
              id: Date.now() + index,
              role: "assistant",
              text: log
            }));
            setMessages(prev => [...prev, ...liveMessages]);
            logCountRef.current = data.logs.length;
          }
          // Si l'IA a fini ou a échoué, on arrête le rafraîchissement
          if (data.status === "completed" || data.status === "failed") {
            setIsGenerated(data.status === "completed");
            if (data.result_url) {
              setResultUrl(data.result_url);
            }
          }
          fetchSessionFiles(id);
        }
      } catch (err) {
        console.error("Erreur de connexion au backend:", err);
      }
    };
    // On lance une première fois tout de suite
    fetchStatus();
    
    // Puis on demande au backend toutes les 2 secondes
    const intervalId = setInterval(() => {
      if (status !== 'completed' && status !== 'failed') {
        fetchStatus();
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [id, status]);

  const handleSend = async () => {
    if (!inputVal.trim() || !id || id === 'new') return;

    const userText = inputVal.trim();
    
    // 1. On ajoute immédiatement le message de l'utilisateur pour la fluidité (UX)
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: userText }]);
    setInputVal(""); // On vide le champ texte tout de suite

    try {
      // 2. On appelle le vrai backend
      const response = await fetch('/api/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: id, 
          prompt: userText 
        })
      });

      if (!response.ok) {
        throw new Error("Le serveur n'a pas pu traiter la demande");
      }

      // Note : On n'a pas besoin d'ajouter manuellement le message de l'assistant ici !
      // Pourquoi ? Parce que notre useEffect de "Polling" va détecter que le statut 
      // est repassé en 'processing' et il récupérera les nouveaux logs de l'IA automatiquement.
      
    } catch (err) {
      console.error("Erreur Chat:", err);
      // Initiative : Afficher l'erreur dans le chat pour que l'utilisateur comprenne
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: "assistant", 
        text: "Désolé, j'ai rencontré une difficulté technique pour traiter cette modification. Peux-tu réessayer ?" 
      }]);
    }
  };

  const handleStartGeneration = async () => {
    if (!url.trim()) return;
    setIsStarting(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
      });
      
      const data = await response.json();
      if (data.session_id) {
        navigate(`/app/editor/${data.session_id}`);
      }
    } catch (error) {
      console.error("Erreur de génération:", error);
      alert("Impossible de joindre l'IA.");
      setIsStarting(false);
    }
  };

  if (id === 'new') {
    return (
      <div className="flex flex-col h-screen bg-[#0A0A0A] text-white items-center justify-center p-6 relative overflow-hidden">
        {/* Un peu de lumière d'ambiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C3AFF]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <Link to="/app" className="absolute top-6 left-6 p-3 hover:bg-white/10 rounded-full text-[#888] hover:text-white transition-colors z-10">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        
        <div className="max-w-3xl w-full text-center space-y-8 z-10">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(108,58,255,0.4)]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">Forgez une nouvelle page</h1>
          <p className="text-xl text-[#888]">Collez l'URL de votre produit (Alibaba, Amazon, Shopify...) et laissez la magie opérer.</p>
          
          <div className="relative p-2 mt-12 rounded-2xl bg-[#111]/80 backdrop-blur border border-white/10 flex items-center gap-2 shadow-2xl focus-within:border-[#6C3AFF] transition-colors">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartGeneration()}
              placeholder="https://fr.aliexpress.com/item/..."
              className="w-full bg-transparent border-none outline-none py-5 px-6 text-white placeholder-[#555] text-xl"
            />
            <button 
              onClick={handleStartGeneration}
              disabled={isStarting}
              className="px-8 py-5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-transform hover:scale-105 flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isStarting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 fill-current" />
              )}
              {isStarting ? "Initialisation..." : "Générer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-white">
      {/* Top Bar Globale */}
      <div className="h-14 shrink-0 border-b border-white/5 flex items-center justify-between px-4 bg-[#0A0A0A]">
        <div className="flex items-center gap-4">
          <Link to="/app" className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#888] hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-bold cursor-text hover:bg-white/5 px-2 py-1 rounded">Volt Sneakers Promo</h1>
            <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider">Brouillon</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#888]">
          <button className="p-2 hover:text-white hover:bg-white/5 rounded"><Undo className="w-4 h-4" /></button>
          <button className="p-2 hover:text-white hover:bg-white/5 rounded"><Redo className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium hover:bg-white/5 rounded-lg flex items-center gap-2">
            <Share className="w-4 h-4" /> Partager
          </button>
          {publishedUrl ? (
            <a 
              href={publishedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-bold bg-green-500 rounded-lg shadow-lg flex items-center gap-2 line-clamp-1 text-white hover:bg-green-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Voir le site
            </a>
          ) : (
            <button 
              onClick={handlePublish}
              disabled={isPublishing || status !== 'completed'}
              className="px-4 py-2 text-sm font-bold bg-gradient-primary rounded-lg shadow-lg flex items-center gap-2 line-clamp-1 disabled:opacity-50"
            >
              {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              {isPublishing ? "Déploiement..." : "Publier"}
            </button>
          )}
        </div>
      </div>

      {/* 3 Columns Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Panel Gauche: Chat */}
        <div className="w-[320px] shrink-0 border-r border-white/5 flex flex-col bg-[#0A0A0A]">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold">Assistant IA</h2>
            <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-3 rounded-xl max-w-[90%] text-sm ${m.role === 'user' ? 'bg-[#1A1A1A] border border-white/10 text-white' : 'bg-transparent text-[#CCC]'}`}>
                    {m.text}
                  </div>
                  {m.action && (
                    <div className="mt-2 text-xs font-medium text-[#FF3A8C] flex items-center gap-1 bg-[#FF3A8C]/10 px-2 py-1 rounded">
                      <Zap className="w-3 h-3" /> {m.action}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-[#050505]">
            <div className="flex items-center gap-2 mb-3 overflow-x-auto hide-scrollbar">
              <button className="shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] hover:bg-white/10 whitespace-nowrap">Améliore le titre</button>
              <button className="shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] hover:bg-white/10 whitespace-nowrap">Ajoute des avis</button>
            </div>
            <div className="relative bg-[#111111] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#FF3A8C] transition-colors">
              <textarea 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Décrivez votre modification..."
                className="w-full bg-transparent border-none resize-none px-3 py-3 text-sm focus:outline-none min-h-[80px]"
              />
              <div className="flex items-center justify-between p-2">
                <div className="flex gap-1 text-[#888]">
                  <button className="p-1.5 hover:bg-white/10 rounded hover:text-white"><Paperclip className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-white/10 rounded hover:text-white"><Mic className="w-4 h-4" /></button>
                </div>
                <button 
                  onClick={handleSend}
                  className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white shrink-0 hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Central Panel: Preview */}
        <div className="flex-1 flex flex-col bg-[#0F0F0F] relative overflow-hidden">
          {/* Top Preview Bar */}
          <div className="h-12 border-b border-white/5 shrink-0 flex items-center justify-between px-4 bg-[#111]">
            <div className="flex items-center bg-[#0A0A0A] rounded-lg p-1 border border-white/5">
              <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white/10 text-white' : 'text-[#888] hover:text-white'}`}>
                <Monitor className="w-4 h-4" />
              </button>
              <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded ${device === 'tablet' ? 'bg-white/10 text-white' : 'text-[#888] hover:text-white'}`}>
                <Tablet className="w-4 h-4" />
              </button>
              <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white/10 text-white' : 'text-[#888] hover:text-white'}`}>
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 max-w-md mx-4 hidden sm:block">
              <div className="h-8 bg-[#0A0A0A] border border-white/5 rounded-md flex items-center px-3 text-xs text-[#888]">
                <span>pageforge.io/p/</span><span className="text-white">volt-sneakers</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#888]">
              <button 
                onClick={() => setViewMode(viewMode === 'preview' ? 'code' : 'preview')}
                className={`p-2 rounded ${viewMode === 'code' ? 'bg-[#FF3A8C]/20 text-[#FF3A8C]' : 'hover:bg-white/10 hover:text-white'}`}
                title={viewMode === 'preview' ? "Voir le code" : "Voir l'aperçu"}
              >
                {viewMode === 'preview' ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-white/10 hover:text-white rounded"><RefreshCw className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/10 hover:text-white rounded"><ExternalLink className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 p-4 lg:p-8 flex items-center justify-center overflow-auto">
            {viewMode === 'preview' ? (
              <motion.div 
                layout
                className={`bg-[#0A0A0A] border border-white/10 shadow-2xl relative transition-all duration-300 flex-shrink-0 ${
                  device === 'desktop' ? 'w-full max-w-5xl h-full rounded-xl' :
                  device === 'tablet' ? 'w-[768px] h-[1024px] rounded-3xl' :
                  'w-[375px] h-[812px] rounded-[40px] border-[8px] border-[#111]'
                } overflow-hidden`}
              >
                {/* Contenu conditionnel selon le statut */}
                {status === 'completed' && resultUrl ? (
                  // ✅ Le résultat est prêt : on l'affiche dans un Iframe !
                  <iframe 
                    src={resultUrl.startsWith('http') ? resultUrl : `http://localhost:8000${resultUrl}`} 
                    className="w-full h-full border-none bg-white"
                    title="Page générée"
                  />
                ) : (
                  // ⏳ En cours de génération : Animation d'attente stylée
                  <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#050505] flex flex-col items-center justify-center space-y-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-[#3B82F6] animate-spin" />
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#888]">
                      L'IA forge votre page...
                    </h2>
                    <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                    <p className="text-sm text-[#555] font-mono">{progress}% accompli</p>
                  </div>
                )}
                
                {/* On garde le halo interactif */}
                {status === 'completed' && (
                  <div className="absolute inset-0 border-2 border-transparent hover:border-[#3B82F6] transition-colors pointer-events-auto cursor-pointer z-50">
                    <div className="absolute top-2 right-2 px-2 py-1 bg-[#3B82F6] text-white text-[10px] uppercase font-bold rounded opacity-0 hover:opacity-100 transition-opacity">Modifier Section</div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#1E1E1E] z-40 flex overflow-hidden"
              >
                {/* Sidebar */}
                <div className="w-64 border-r border-[#333] flex flex-col bg-[#181818] shrink-0">
                  <div className="h-10 px-3 flex items-center justify-between border-b border-[#333]">
                    <span className="text-xs font-semibold text-[#CCC]">File explorer</span>
                    <div className="flex items-center gap-2 text-[#888]">
                      <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                      <Plus className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                      <ChevronDown className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    {sessionFiles.length > 0 ? (
                      sessionFiles.map((file) => (
                        <FileItem 
                          key={file.name} 
                          name={file.name} 
                          icon={<FileText className="w-3.5 h-3.5" />} 
                          active={selectedFile?.name === file.name}
                          onClick={() => setSelectedFile(file)}
                        />
                      ))
                    ) : (
                      <div className="text-[#888] text-xs px-3 py-2 italic">Aucun fichier généré</div>
                    )}
                  </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
                  {/* Tabs row */}
                  <div className="h-10 border-b border-[#333] flex items-center bg-[#181818] overflow-x-auto overflow-y-hidden no-scrollbar">
                    <div className="flex items-center gap-1 px-2 border-r border-[#333] shrink-0 mr-1">
                      <button onClick={() => setViewMode('preview')} className="px-3 py-1 flex items-center gap-2 text-xs font-medium text-[#888] hover:text-white rounded hover:bg-white/5 transition-colors">
                        Preview
                      </button>
                      <button className="px-3 py-1 flex items-center gap-2 text-xs font-medium text-white bg-white/10 rounded transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-white relative">
                          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-50" />
                        </div>
                        Code
                      </button>
                    </div>

                    {selectedFile && (
                      <FileTab 
                        name={selectedFile.name} 
                        icon={<FileText className="w-3.5 h-3.5" />} 
                        active 
                      />
                    )}

                    <div className="flex-1" />
                    <div className="flex items-center gap-3 px-4 shrink-0 text-[#888]">
                      <Download className="w-4 h-4 cursor-pointer hover:text-white" />
                      <Settings className="w-4 h-4 cursor-pointer hover:text-white" />
                    </div>
                  </div>

                  {/* Code Area */}
                  <div className="flex-1 overflow-auto flex flex-col text-[13px] bg-[#1E1E1E]">
                    {fileContent ? (
                      <SyntaxHighlighter
                        language={selectedFile?.ext?.replace('.', '') === 'js' ? 'javascript' : selectedFile?.ext?.replace('.', '') || 'html'}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '13px' }}
                        showLineNumbers={true}
                        wrapLines={true}
                      >
                        {fileContent}
                      </SyntaxHighlighter>
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#888] flex-col gap-3">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <p className="text-sm">Chargement du fichier...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {isGenerated && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold flex items-center gap-2 shadow-xl backdrop-blur-md z-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                Généré avec succès
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Panel Droit: Propriétés */}
        {viewMode === 'preview' && (
          <div className="w-[280px] shrink-0 border-l border-white/5 bg-[#050505] flex flex-col">
            <Tabs defaultValue="design" className="flex-1 flex flex-col w-full">
              <div className="p-2 border-b border-white/5 shrink-0">
                <TabsList className="w-full bg-[#111]">
                  <TabsTrigger value="design" className="flex-1 text-xs">Design</TabsTrigger>
                  <TabsTrigger value="seo" className="flex-1 text-xs">SEO</TabsTrigger>
                  <TabsTrigger value="integrations" className="flex-1 text-xs">Apps</TabsTrigger>
                </TabsList>
              </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="design" className="space-y-6 outline-none mt-0">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Palette</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="w-full aspect-square rounded-full bg-[#FFFFFF] border-2 border-white/20 cursor-pointer" />
                    <div className="w-full aspect-square rounded-full bg-[#0A0A0A] border-2 border-transparent cursor-pointer" />
                    <div className="w-full aspect-square rounded-full bg-orange-500 border-2 border-transparent cursor-pointer" />
                    <div className="w-full aspect-square rounded-full bg-pink-500 border-2 border-transparent cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Typographie</h4>
                  <div className="relative">
                    <select className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-[#FF3A8C]">
                      <option>Inter</option>
                      <option>Geist</option>
                      <option>Playfair Display</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Bouton CTA</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 border border-white/20 rounded bg-white text-black text-xs font-bold">Solid</button>
                    <button className="py-2 border border-white/20 rounded bg-transparent text-white text-xs font-bold">Outline</button>
                    <button className="py-2 border border-white/20 rounded bg-gradient-primary text-white text-xs font-bold">Gradient</button>
                    <button className="py-2 border border-white/20 rounded bg-[#111] text-white text-xs font-bold shadow-[4px_4px_0px_#FFF]">Brutal</button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-sm">Mode Sombre</label>
                    <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 outline-none mt-0 text-sm">
                <div className="space-y-1">
                  <label className="text-[#888] font-medium">Titre SEO (Meta)</label>
                  <input type="text" defaultValue="Acheter VOLT Sneakers | Édition Limitée" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF3A8C]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#888] font-medium">Description SEO</label>
                  <textarea rows={3} defaultValue="Sneakers urbaines haute performance. Semelle absorbante, design exclusif." className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF3A8C] resize-none" />
                </div>
                
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" /> Score SEO : 92/100
                  </div>
                  <p className="text-xs text-green-400/80">Excellent titre et description courte. Prêt pour l'indexation.</p>
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-4 outline-none mt-0">
                <div className="space-y-3">
                  {[
                    { id: 'shop', name: 'Shopify', connected: true },
                    { id: 'woo', name: 'WooCommerce', connected: false },
                    { id: 'fb', name: 'Meta Pixel', connected: true },
                  ].map(int => (
                    <div key={int.id} className="flex items-center justify-between p-3 bg-[#111] border border-white/10 rounded-lg">
                      <span className="font-medium text-sm">{int.name}</span>
                      {int.connected ? 
                        <span className="text-xs font-bold text-green-400">Connecté</span> :
                        <button className="text-xs font-bold text-[#FF3A8C]">Connecter</button>
                      }
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                    Exporter HTML/CSS
                  </button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        )}

      </div>
    </div>
  );
}

