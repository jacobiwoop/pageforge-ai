import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight, Link as LinkIcon, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
 
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setError(null);
      setIsLoading(true);
      const fullName = `${firstName} ${lastName}`.trim();
      const regRes = await register({ email, password, full_name: fullName });
      
      if (regRes.success) {
        const loginRes = await login({ email, password });
        setIsLoading(false);
        if (loginRes.success) {
          navigate("/app");
        } else {
          setError(loginRes.error || "Erreur de connexion après inscription");
        }
      } else {
        setIsLoading(false);
        setError(regRes.error || "Erreur d'inscription");
      }
    }
  };

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const steps = [
    { id: 1, title: "Profil" },
    { id: 2, title: "Objectif" },
    { id: 3, title: "Boutique" },
    { id: 4, title: "Plan" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header / Progress */}
      <header className="px-6 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF3A8C]" />
          <span className="font-bold">PageForge</span>
        </div>
        
        <div className="flex items-center gap-2 w-64">
          {steps.map((s) => (
            <div key={s.id} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: step >= s.id ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>
        
        <Link to="/login" className="text-sm text-[#888] hover:text-white transition-colors">
          Retour login
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Parlez-nous de vous</h1>
                  <p className="text-[#888888]">Pour vous offrir la meilleure expérience.</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 text-sm mb-6">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#888]">Prénom</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF3A8C] outline-none" placeholder="Jane" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#888]">Nom</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF3A8C] outline-none" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#888]">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF3A8C] outline-none" placeholder="jane.doe@example.com" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#888]">Mot de passe</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF3A8C] outline-none" placeholder="••••••••" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#888]">Nom de la boutique</label>
                  <input type="text" className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF3A8C] outline-none" placeholder="Ma Super Boutique" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#888]">Votre secteur e-commerce</label>
                  <select className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF3A8C] outline-none appearance-none">
                    <option value="">Sélectionnez un secteur...</option>
                    <option value="mode">Mode & Vêtements</option>
                    <option value="beaute">Beauté & Cosmétiques</option>
                    <option value="maison">Maison & Déco</option>
                    <option value="tech">High-Tech</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#888]">Combien de produits vendez-vous ?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["1–10", "10–100", "100+"].map((range) => (
                      <button key={range} className="py-3 rounded-lg border border-white/10 bg-[#111] hover:bg-white/5 transition focus:border-[#FF3A8C]">
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Que voulez-vous faire avec PageForge ?</h1>
                  <p className="text-[#888888]">Sélectionnez votre objectif principal.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "create", title: "Créer mes premières pages produit", icon: "🚀" },
                    { id: "convert", title: "Améliorer mes conversions", icon: "📈" },
                    { id: "connect", title: "Connecter ma boutique existante", icon: "🔗" }
                  ].map((goal) => (
                    <button 
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedGoal === goal.id ? "border-[#FF3A8C] bg-[#FF3A8C]/10" : "border-white/10 bg-[#111] hover:bg-white/5"}`}
                    >
                      <span className="text-2xl">{goal.icon}</span>
                      <span className="font-medium text-lg">{goal.title}</span>
                      {selectedGoal === goal.id && <CheckCircle2 className="w-5 h-5 text-[#FF3A8C] ml-auto" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Connectez votre boutique</h1>
                  <p className="text-[#888888]">Importez vos produits automatiquement (optionnel).</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {["Shopify", "WooCommerce", "Prestashop", "Export HTML"].map((platform) => (
                    <button key={platform} className="p-6 rounded-xl border border-white/10 bg-[#111] hover:bg-white/5 transition flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-[#888]" />
                      </div>
                      <span className="font-medium">{platform}</span>
                    </button>
                  ))}
                </div>
                
                <div className="text-center pt-4">
                 <button onClick={handleNext} className="text-[#888] hover:text-white underline text-sm">Je ferai ça plus tard</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Choisissez votre plan</h1>
                  <p className="text-[#888888]">Rejoignez les e-commerçants performants.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "starter", name: "Starter", price: "Gratuit", desc: "5 pages/mois" },
                    { id: "pro", name: "Pro", price: "29€/mois", desc: "Pages illimitées, Analytics" },
                    { id: "agency", name: "Agency", price: "99€/mois", desc: "Multi-boutiques, API" }
                  ].map((plan) => (
                    <button 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all text-left ${selectedPlan === plan.id || (plan.id === 'pro' && !selectedPlan) ? "border-[#FF3A8C] bg-[#FF3A8C]/10" : "border-white/10 bg-[#111] hover:bg-white/5"}`}
                    >
                      <div>
                        <div className="font-bold text-lg">{plan.name}</div>
                        <div className="text-sm text-[#888]">{plan.desc}</div>
                      </div>
                      <div className="text-xl font-black">{plan.price}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Actions */}
      <footer className="fixed bottom-0 inset-x-0 p-6 bg-[#0A0A0A]/80 backdrop-blur border-t border-white/5 flex justify-between items-center z-10">
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${step === 1 ? "opacity-0 pointer-events-none" : "text-[#888] hover:text-white"}`}
        >
          Retour
        </button>
        <button 
          onClick={handleNext}
          disabled={isLoading}
          className="px-8 py-3 rounded-lg bg-gradient-primary font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? "Chargement..." : step === 4 ? "Terminer" : "Suivant"} <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}

