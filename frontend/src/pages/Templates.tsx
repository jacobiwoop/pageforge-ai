import { Search, Heart, Eye, Zap, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Templates() {
  const [activeTab, setActiveTab] = useState("Tous");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const categories = ["Tous", "Mode", "Beauté", "Sport", "Électronique", "Maison", "Alimentaire", "Luxe", "Dropshipping"];
  
  const templates = [
    { id: 1, name: "Sneaker Drop", category: "Mode", uses: "12k", rating: 4.9, reviews: 342, tag: "⭐ Populaire", color: "bg-blue-500", img: "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=500&q=80" },
    { id: 2, name: "Minimalist Beauty", category: "Beauté", uses: "8.4k", rating: 4.8, reviews: 210, tag: "", color: "bg-pink-500", img: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500&q=80" },
    { id: 3, name: "Tech Gadget Pro", category: "Électronique", uses: "5k", rating: 4.7, reviews: 156, tag: "🆕 Nouveau", color: "bg-purple-500", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80" },
    { id: 4, name: "Home Decor Elite", category: "Maison", uses: "3.2k", rating: 4.6, reviews: 98, tag: "", color: "bg-orange-500", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80" },
    { id: 5, name: "Fitness Gear", category: "Sport", uses: "4.1k", rating: 4.8, reviews: 120, tag: "", color: "bg-green-500", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80" },
    { id: 6, name: "Prestige Watch", category: "Luxe", uses: "1.5k", rating: 5.0, reviews: 84, tag: "⭐ Populaire", color: "bg-yellow-500", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="shrink-0 p-6 md:p-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Templates</h1>
            <p className="text-[#888]">Commencez avec un design prêt à l'emploi, personnalisez-le en secondes.</p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="w-5 h-5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher un template..." 
              className="w-full md:w-80 bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF3A8C] transition-colors"
             />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 max-w-7xl mx-auto w-full px-6 md:px-8 py-6 space-y-6">
        <div className="flex items-center gap-6 border-b border-white/10">
          {["Tous", "Populaires", "Nouveaux", "Mes favoris"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium transition-colors relative ${activeTab === tab ? 'text-white' : 'text-[#888] hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FF3A8C]" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${activeCategory === cat ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-[#888] hover:bg-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(tpl => (
            <div key={tpl.id} className="glass-card border border-white/5 overflow-hidden group">
              <div className="h-48 relative overflow-hidden">
                <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover" />
                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur bg-black/40 border border-white/10 flex items-center gap-1`}>
                  <div className={`w-2 h-2 rounded-full ${tpl.color}`} />
                  {tpl.category}
                </div>
                {tpl.tag && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider bg-white/10 backdrop-blur border border-white/10">
                    {tpl.tag}
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                  <button 
                    onClick={() => setPreviewTemplate(tpl)}
                    className="w-full py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 font-medium flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" /> Prévisualiser
                  </button>
                  <Link 
                    to={`/app/editor/new?template=${tpl.id}`}
                    className="w-full py-2 rounded-lg bg-gradient-primary font-bold shadow-lg flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                  >
                    <Zap className="w-4 h-4" /> Utiliser
                  </Link>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-white/20 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{tpl.name}</h3>
                <div className="flex items-center justify-between text-sm text-[#888]">
                  <span>Utilisé par {tpl.uses} boutiques</span>
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <span className="font-bold text-white">{tpl.rating}</span>
                    <span className="text-xs">({tpl.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex bg-black/80 backdrop-blur-sm"
          >
            {/* Sidebar Info */}
            <div className="hidden lg:flex w-80 bg-[#0A0A0A] border-r border-white/10 flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg">Aperçu</h3>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <img src={previewTemplate.img} className="w-full aspect-video object-cover rounded-lg mb-4" />
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded border border-white/5 text-xs font-bold mb-4">
                  <div className={`w-2 h-2 rounded-full ${previewTemplate.color}`} /> {previewTemplate.category}
                </div>
                <h2 className="text-2xl font-bold mb-2">{previewTemplate.name}</h2>
                <div className="flex items-center gap-2 text-sm text-[#888] mb-6 border-b border-white/5 pb-6">
                  <span className="text-white font-medium">⭐ {previewTemplate.rating}</span>
                  <span>({previewTemplate.reviews} avis)</span>
                  <span>•</span>
                  <span>{previewTemplate.uses} utilisations</span>
                </div>

                <div className="space-y-4 text-sm text-[#888]">
                  <h4 className="font-bold text-white">Composants inclus</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Hero section haute conversion</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Galerie produit optimisée</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Section bénéfices</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Accordéon FAQ</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> CTA Sticky sur mobile</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t border-white/5">
                <Link 
                  to={`/app/editor/new?template=${previewTemplate.id}`}
                  className="w-full py-3 rounded-lg bg-gradient-primary font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" /> Utiliser ce template
                </Link>
              </div>
            </div>

            {/* Iframe preview simulation */}
            <div className="flex-1 flex flex-col h-full bg-[#111]">
              <div className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-4">
                <h3 className="font-bold">{previewTemplate.name}</h3>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full h-full max-w-5xl bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-4">{previewTemplate.name}</h2>
                    <p className="text-[#888]">Aperçu live du template...</p>
                  </div>
                </div>
              </div>
              <div className="lg:hidden p-4 border-t border-white/5 bg-[#0A0A0A]">
                <Link 
                  to={`/app/editor/new?template=${previewTemplate.id}`}
                  className="w-full py-3 rounded-lg bg-gradient-primary font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" /> Utiliser ce template
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

