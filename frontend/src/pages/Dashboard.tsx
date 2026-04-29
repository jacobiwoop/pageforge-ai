import {
  FileText,
  Eye,
  TrendingUp,
  ShoppingBag,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  Archive
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    { icon: FileText, label: "Pages créées", value: "24", subval: "+3 ce mois", color: "text-[#6C3AFF]", bg: "bg-[#6C3AFF]/10" },
    { icon: Eye, label: "Vues totales", value: "18 420", subval: "+12%", color: "text-[#FF3A8C]", bg: "bg-[#FF3A8C]/10" },
    { icon: TrendingUp, label: "Taux conversion moyen", value: "4.7%", subval: "+0.3%", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: ShoppingBag, label: "Commandes générées", value: "312", subval: "+28", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const projects = [
    { id: 1, name: "Sneakers Urban", product: "VOLT Sneakers", views: "1.2k", orders: 42, conv: "3.5%", status: "actif", date: "il y a 2j", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80" },
    { id: 2, name: "Montre Minimaliste", product: "Chrono X", views: "850", orders: 12, conv: "1.4%", status: "actif", date: "il y a 5j", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
    { id: 3, name: "Casque Audio", product: "Beats Studio", views: "0", orders: 0, conv: "0%", status: "brouillon", date: "hier", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  ];

  const activities = [
    { icon: CheckCircle2, text: "Page \"Nike Air Max\" publiée", time: "il y a 2h", color: "text-green-500" },
    { icon: ShoppingBag, text: "12 nouvelles commandes", time: "il y a 4h", color: "text-orange-500" },
    { icon: FileText, text: "Template \"Luxe Minimaliste\" utilisé", time: "hier", color: "text-[#FF3A8C]" },
    { icon: TrendingUp, text: "Intégration Shopify synchronisée", time: "hier", color: "text-[#6C3AFF]" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">👋 Bonjour Jane — voici vos projets</h1>
          <p className="text-[#888] text-sm mt-1">Mardi 28 Avril 2026</p>
        </div>
        <Link to="/app/editor/new" className="px-5 py-2.5 rounded-lg bg-gradient-primary font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
          <Plus className="w-5 h-5" /> Nouveau projet
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{s.subval}</span>
            </div>
            <p className="text-[#888] text-sm font-medium mb-1">{s.label}</p>
            <h3 className="text-3xl font-black">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Projects section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-6 border-b border-white/10 w-full sm:w-auto">
              <button className="pb-3 border-b-2 border-white font-medium text-white px-2">Tous</button>
              <button className="pb-3 border-b-2 border-transparent font-medium text-[#888] hover:text-white px-2">Actifs</button>
              <button className="pb-3 border-b-2 border-transparent font-medium text-[#888] hover:text-white px-2">Brouillons</button>
              <button className="pb-3 border-b-2 border-transparent font-medium text-[#888] hover:text-white px-2">Archivés</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="glass-card border border-white/5 overflow-hidden group relative flex flex-col">
                <div className="h-40 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-3 left-3 z-20">
                    {p.status === 'actif' && <span className="px-2 py-1 bg-green-500/80 backdrop-blur rounded text-[10px] font-bold text-white uppercase tracking-wider">Actif</span>}
                    {p.status === 'brouillon' && <span className="px-2 py-1 bg-gray-500/80 backdrop-blur rounded text-[10px] font-bold text-white uppercase tracking-wider">Brouillon</span>}
                  </div>
                  
                  <div className="absolute top-3 right-3 z-20">
                    <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  {/* Hover action */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <Link to={`/app/editor/${p.id}`} className="px-6 py-2 rounded-lg bg-gradient-primary font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                      Éditer
                    </Link>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{p.name}</h4>
                    <p className="text-sm text-[#888] mb-4">{p.product} • {p.date}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-center">
                      <div className="text-xs text-[#888] mb-1">Vues</div>
                      <div className="font-semibold text-sm">{p.views}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[#888] mb-1">Cmds</div>
                      <div className="font-semibold text-sm">{p.orders}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[#888] mb-1">Conv.</div>
                      <div className="font-semibold text-green-400 text-sm">{p.conv}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          
          {/* Recent Activity */}
          <div className="glass-card p-6 border border-white/5">
            <h3 className="font-bold text-lg mb-6">Activité récente</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {activities.map((act, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0A0A0A] bg-[#111] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                     <act.icon className={`w-4 h-4 ${act.color}`} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/5">
                    <p className="text-sm font-medium mb-1">{act.text}</p>
                    <time className="text-xs text-[#888]">{act.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

