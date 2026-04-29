import { Save, LogOut } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-10 pb-24">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
        <p className="text-[#888] text-sm">Gérez votre compte, vos intégrations et votre abonnement.</p>
      </div>

      {/* Profil */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b border-white/10 pb-2">Profil</h2>
        <div className="glass-card p-6 border border-white/5 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold">JD</div>
            <div>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                Changer de photo
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#888]">Nom complet</label>
              <input type="text" defaultValue="Jane Doe" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF3A8C]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#888]">Email</label>
              <input type="email" defaultValue="jane@exemple.com" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF3A8C]" />
            </div>
          </div>
          
          <div className="pt-2">
            <button className="px-5 py-2 bg-white/10 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors flex items-center gap-2">
               <Save className="w-4 h-4" /> Sauvegarder
            </button>
          </div>
        </div>
      </section>

      {/* Boutique */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b border-white/10 pb-2">Boutique & Intégrations</h2>
        <div className="glass-card p-6 border border-white/5 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#888]">Nom de la boutique</label>
            <input type="text" defaultValue="Volt Sneakers Official" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF3A8C]" />
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-sm">Connexions E-commerce</h3>
            <div className="flex items-center justify-between p-4 bg-[#111] border border-white/10 rounded-lg">
              <div>
                <div className="font-bold">Shopify</div>
                <div className="text-sm text-[#888]">voltsneakers.myshopify.com</div>
              </div>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors">
                Déconnecter
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#111] border border-white/10 rounded-lg">
              <div>
                <div className="font-bold">Stripe</div>
                <div className="text-sm text-[#888]">Paiements directs</div>
              </div>
              <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold shadow-lg hover:bg-gray-200 transition-colors">
                Connecter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Abonnement */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b border-white/10 pb-2">Abonnement (Pro Plan)</h2>
        <div className="glass-card p-6 border border-white/5 bg-gradient-to-br from-[#111] to-[#6C3AFF]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Plan Pro</h3>
              <p className="text-[#888] text-sm">79€ / mois. Renouvellement le 28 Mai 2026.</p>
            </div>
            <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold shadow-lg hover:bg-gray-200 transition-colors">
              Gérer l'abonnement
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[#888]">Pages publiées</span>
                <span className="font-bold">24 / 100</span>
              </div>
              <div className="w-full h-2 bg-[#111] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary w-[24%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[#888]">Vues générées</span>
                <span className="font-bold">18k / 100k</span>
              </div>
              <div className="w-full h-2 bg-[#111] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary w-[18%]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Danger Zone */}
      <section className="pt-10">
        <div className="p-6 border border-red-500/20 rounded-xl bg-red-500/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-red-500 mb-1">Zone de danger</h3>
            <p className="text-sm text-red-400/80">Ces actions sont irréversibles.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300">
               <LogOut className="w-4 h-4" /> Déconnexion
            </button>
            <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg text-sm font-bold hover:bg-red-500/30 transition-colors">
              Supprimer le compte
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
