import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  Download
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function Analytics() {
  const performanceData = [
    { date: '01 Avr', vues: 400, clics: 240, ventes: 24 },
    { date: '05 Avr', vues: 600, clics: 300, ventes: 35 },
    { date: '10 Avr', vues: 550, clics: 320, ventes: 42 },
    { date: '15 Avr', vues: 800, clics: 450, ventes: 58 },
    { date: '20 Avr', vues: 1100, clics: 680, ventes: 84 },
    { date: '25 Avr', vues: 1400, clics: 950, ventes: 110 },
    { date: '28 Avr', vues: 1800, clics: 1200, ventes: 142 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 75, color: '#FF3A8C' },
    { name: 'Desktop', value: 20, color: '#6C3AFF' },
    { name: 'Tablet', value: 5, color: '#FF6B35' },
  ];

  const topPages = [
    { id: 1, name: "Sneakers Urban VOLT", views: "8.4k", conv: "5.2%", trend: "up", earnings: "1 240 €" },
    { id: 2, name: "Montre Minimaliste X", views: "4.2k", conv: "3.8%", trend: "up", earnings: "850 €" },
    { id: 3, name: "Casque Audio Pro", views: "2.1k", conv: "1.4%", trend: "down", earnings: "120 €" },
    { id: 4, name: "Sac de Voyage Luxe", views: "1.8k", conv: "4.1%", trend: "up", earnings: "540 €" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-sm font-bold text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#888]">{entry.name}:</span>
              <span className="font-semibold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-[#888] text-sm">Analysez les performances de vos pages produit.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-[#111] border border-white/10 rounded-lg p-1 flex text-sm font-medium">
            <button className="px-3 py-1.5 rounded-md bg-white/10 text-white">30 Jours</button>
            <button className="px-3 py-1.5 rounded-md text-[#888] hover:text-white">3 Mois</button>
            <button className="px-3 py-1.5 rounded-md text-[#888] hover:text-white">Année</button>
          </div>
          <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors hidden sm:flex items-center gap-2">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="w-12 h-12 text-[#6C3AFF]" />
          </div>
          <p className="text-[#888] text-sm font-medium mb-1 relative z-10">Vues Totales</p>
          <h3 className="text-3xl font-black mb-2 relative z-10">42.5k</h3>
          <p className="text-xs text-green-400 font-medium flex items-center gap-1 relative z-10"><ArrowUpRight className="w-3 h-3" /> +24% ce mois</p>
        </div>
        
        <div className="glass-card p-5 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MousePointerClick className="w-12 h-12 text-[#FF3A8C]" />
          </div>
          <p className="text-[#888] text-sm font-medium mb-1 relative z-10">Clics (CTA)</p>
          <h3 className="text-3xl font-black mb-2 relative z-10">8.2k</h3>
          <p className="text-xs text-green-400 font-medium flex items-center gap-1 relative z-10"><ArrowUpRight className="w-3 h-3" /> +12% ce mois</p>
        </div>

        <div className="glass-card p-5 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-12 h-12 text-[#22C55E]" />
          </div>
          <p className="text-[#888] text-sm font-medium mb-1 relative z-10">Taux de Conversion</p>
          <h3 className="text-3xl font-black mb-2 relative z-10">4.8%</h3>
          <p className="text-xs text-green-400 font-medium flex items-center gap-1 relative z-10"><ArrowUpRight className="w-3 h-3" /> +0.5% (absolu)</p>
        </div>

        <div className="glass-card p-5 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-12 h-12 text-[#FF6B35]" />
          </div>
          <p className="text-[#888] text-sm font-medium mb-1 relative z-10">Revenu Stimé</p>
          <h3 className="text-3xl font-black mb-2 relative z-10">14.2k €</h3>
          <p className="text-xs text-red-400 font-medium flex items-center gap-1 relative z-10"><ArrowDownRight className="w-3 h-3" /> -2% ce mois</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="glass-card p-6 border border-white/5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Trafic & Engagements</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#6C3AFF]" /> Vues</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF3A8C]" /> Clics</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C3AFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6C3AFF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3A8C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF3A8C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vues" name="Vues" stroke="#6C3AFF" strokeWidth={3} fillOpacity={1} fill="url(#colorVues)" />
                <Area type="monotone" dataKey="clics" name="Clics" stroke="#FF3A8C" strokeWidth={3} fillOpacity={1} fill="url(#colorClics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices */}
        <div className="glass-card p-6 border border-white/5 flex flex-col">
          <h3 className="font-bold text-lg mb-6">Sources de trafic</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={60} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {deviceData.map((d) => (
               <div key={d.name} className="text-center p-3 rounded-lg bg-white/5">
                 <div className="text-xl font-bold" style={{ color: d.color }}>{d.value}%</div>
                 <div className="text-xs text-[#888] font-medium">{d.name}</div>
               </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pages Performance Table */}
      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#111]">
           <h3 className="font-bold text-lg">Top Pages Produit</h3>
           <button className="text-sm font-medium text-[#888] hover:text-white flex items-center gap-1">
             Voir tout <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0A0A0A] text-[#888] font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Page</th>
                <th className="px-6 py-4 whitespace-nowrap">Vues</th>
                <th className="px-6 py-4 whitespace-nowrap">Taux Conv.</th>
                <th className="px-6 py-4 whitespace-nowrap">Tendance</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Revenus Estimés</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topPages.map((page, i) => (
                <tr key={page.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium whitespace-nowrap flex items-center gap-3">
                    <span className="text-[#888]">{i+1}.</span> {page.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#CCC]">{page.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#CCC]">{page.conv}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {page.trend === 'up' ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded inline-flex">
                        <ArrowUpRight className="w-3 h-3" /> Croissance
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded inline-flex">
                         <ArrowDownRight className="w-3 h-3" /> Baisse
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-white">{page.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
