import { Search, Filter, Download, ArrowUpRight, CheckCircle2, ChevronDown } from "lucide-react";

export default function Orders() {
  const orders = [
    { id: "ORD-9421", date: "28 Avr 2026, 14:24", customer: "Alice Martin", amount: "129.00 €", status: "payé", product: "VOLT Sneakers" },
    { id: "ORD-9420", date: "28 Avr 2026, 11:15", customer: "Thomas Dubois", amount: "258.00 €", status: "payé", product: "VOLT Sneakers (x2)" },
    { id: "ORD-9419", date: "27 Avr 2026, 19:40", customer: "Sophie Leroux", amount: "45.00 €", status: "en attente", product: "Pack Entretien" },
    { id: "ORD-9418", date: "27 Avr 2026, 16:02", customer: "Julien Morel", amount: "129.00 €", status: "payé", product: "VOLT Sneakers" },
    { id: "ORD-9417", date: "26 Avr 2026, 09:30", customer: "Marie Lemaire", amount: "129.00 €", status: "remboursé", product: "VOLT Sneakers" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Commandes</h1>
          <p className="text-[#888] text-sm">Gérez et suivez les ventes générées par vos landing pages.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-gradient-primary rounded-lg text-sm font-bold shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
            <span className="relative z-10 flex items-center gap-2"><ArrowUpRight className="w-4 h-4" /> Sync Shopify</span>
          </button>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 border border-white/5">
          <p className="text-[#888] text-sm font-medium mb-1">Revenu Total (30j)</p>
          <h3 className="text-2xl font-black mb-2">12 450,00 €</h3>
          <p className="text-xs text-green-400 font-medium flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +15.2% vs mois prec.</p>
        </div>
        <div className="glass-card p-5 border border-white/5">
          <p className="text-[#888] text-sm font-medium mb-1">Commandes (30j)</p>
          <h3 className="text-2xl font-black mb-2">94</h3>
          <p className="text-xs text-green-400 font-medium flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +8.4% vs mois prec.</p>
        </div>
        <div className="glass-card p-5 border border-white/5">
          <p className="text-[#888] text-sm font-medium mb-1">Taux de Conversion Actuel</p>
          <h3 className="text-2xl font-black mb-2">4.7%</h3>
          <p className="text-xs text-[#888] font-medium flex items-center gap-1">Stable</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card border border-white/5 overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between bg-[#111]">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Chercher une commande..." 
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF3A8C] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#888]" /> Filtrer
            </button>
            <button className="px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
              Statut <ChevronDown className="w-4 h-4 text-[#888]" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#111] text-[#888] font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Commande</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Client</th>
                <th className="px-6 py-4 whitespace-nowrap">Statut</th>
                <th className="px-6 py-4 whitespace-nowrap">Produit</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{o.id}</td>
                  <td className="px-6 py-4 text-[#888] whitespace-nowrap">{o.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{o.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {o.status === 'payé' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> Payé</span>}
                    {o.status === 'en attente' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" />En attente</span>}
                    {o.status === 'remboursé' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-gray-400" />Remboursé</span>}
                  </td>
                  <td className="px-6 py-4 text-[#888] whitespace-nowrap truncate max-w-[200px]">{o.product}</td>
                  <td className="px-6 py-4 font-bold text-right whitespace-nowrap">{o.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-[#888] bg-[#111]">
          <div>Affichage de 1 à 5 sur 94 commandes</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-white/5 bg-[#0A0A0A] hover:bg-white/5 disabled:opacity-50" disabled>Préc.</button>
            <button className="px-3 py-1 rounded border border-white/5 bg-[#0A0A0A] hover:bg-white/5">Suiv.</button>
          </div>
        </div>

      </div>
    </div>
  );
}
