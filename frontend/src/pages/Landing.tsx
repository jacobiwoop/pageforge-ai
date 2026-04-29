import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Palette,
  TimerReset,
  BriefcaseBusiness,
  Link as LinkIcon,
  BarChart,
  CheckCircle2,
  ArrowRight,
  Star,
  Plus
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative selection:bg-accent-purple/30">
      
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none blur-[120px] rounded-full bg-gradient-to-br from-[#6C3AFF] via-[#FF3A8C] to-[#3B82F6] -z-10" />

      {/* 1. Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">PageForge</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#888888]">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Témoignages</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-white hover:text-[#888888] transition-colors hidden sm:block">
              Connexion
            </Link>
            <Link 
              to="/onboarding" 
              className="px-4 py-2 rounded-lg bg-gradient-primary text-sm font-bold shadow-[0_0_20px_rgba(108,58,255,0.4)] hover:shadow-[0_0_30px_rgba(108,58,255,0.6)] transition-all"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-6 relative max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 text-sm font-medium"
        >
          <span className="text-[#FF3A8C]">✦ Nouveau</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-[#888888]">Générez vos pages produit en 10 secondes</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-6 max-w-5xl mx-auto"
        >
          Décrivez votre produit.<br />
          <span className="text-gradient">PageForge</span> crée la page qui vend.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[#888888] mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          La plateforme IA qui transforme vos descriptions en pages produit haute conversion — sans designer, sans développeur.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <div className="relative p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Sparkles className="w-5 h-5 text-[#888888]" />
            </div>
            <input 
              type="text" 
              placeholder="Ex: Une paire de sneakers urbaines noires avec semelle fluo..."
              className="w-full bg-transparent border-none outline-none py-4 pl-14 pr-4 text-white placeholder-[#888888] text-lg"
            />
            <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold shrink-0 hover:bg-gray-200 transition-colors hidden sm:block">
              Générer
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link to="/onboarding" className="px-8 py-4 rounded-xl bg-gradient-primary font-bold shadow-[0_0_30px_rgba(108,58,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="px-8 py-4 rounded-xl font-bold bg-[#111111] border border-white/10 hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
            Voir la démo
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-4 text-sm text-[#888888]"
        >
          <div className="flex -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gray-600 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#F59E0B] mb-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p>Rejoint par +2 400 e-commerçants · Noté 4.9/5</p>
          </div>
        </motion.div>
      </section>

      {/* 3. Dashboard Preview */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto relative perspective-[2000px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Voyez PageForge en action</h2>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-2xl border border-white/10 bg-[#0F0F0F] shadow-2xl overflow-hidden flex transform-gpu"
        >
          {/* Mockup Sidebar */}
          <div className="w-[60px] md:w-[240px] border-r border-white/5 hidden sm:flex flex-col bg-[#0A0A0A]">
            <div className="h-16 flex items-center px-4 border-b border-white/5 text-white/50 text-[10px] uppercase tracking-wider font-semibold">
              <span className="hidden md:inline">Menu</span>
            </div>
            <div className="p-3 gap-2 flex flex-col">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-10 rounded-lg bg-white/5 flex items-center px-3 gap-3 ${i===1 ? 'bg-white/10 border border-white/10' : ''}`}>
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                  <div className="hidden md:block w-24 h-2 rounded bg-white/20" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Mockup Content */}
          <div className="flex-1 min-h-[600px] bg-[#111111] p-6">
            <div className="w-full h-12 flex space-x-2 items-center mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <div className="ml-4 w-64 h-8 bg-white/5 rounded-md border border-white/5" />
            </div>
            {/* Generated Page Mockup content */}
            <div className="w-full rounded-xl border border-white/5 bg-white/5 relative overflow-hidden flex flex-col items-center justify-center p-12 text-center">
              <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
              <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-left space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase">Édition Limitée</div>
                  <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">VOLT SNEAKERS <br/><span className="text-[#888]">URBAN EDITION</span></h1>
                  <p className="text-[#888] text-lg">Conçues pour la ville. Respirantes, ultra-légères et équipées d'une semelle absorbante de chocs.</p>
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-white text-black font-bold rounded-lg w-full md:w-auto">Ajouter au panier • 129€</button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 blur-3xl opacity-20 rounded-full" />
                  <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80" alt="Sneaker" className="relative z-10 w-full rounded-2xl rotate-[-10deg] hover:rotate-0 transition-transform duration-500 shadow-2xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-8 right-8 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold flex items-center gap-2 shadow-xl backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4" />
            Généré en 8 secondes
          </div>
        </motion.div>
      </section>

      {/* 4. Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Tout ce dont vous avez besoin pour vendre mieux</h2>
          <p className="text-xl text-[#888888]">Une suite d'outils pensée pour la conversion, sans friction technique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "IA Générative", desc: "Décrivez, l'IA génère. Titre, visuels, copy, structure." },
            { icon: Palette, title: "Design haute conversion", desc: "Pages optimisées pour vendre : hero, avis, FAQ, CTA." },
            { icon: TimerReset, title: "En quelques secondes", desc: "De l'idée à la page publiable en moins de 30 secondes." },
            { icon: BriefcaseBusiness, title: "Multi-produits", desc: "Gérez tous vos produits depuis un dashboard centralisé." },
            { icon: LinkIcon, title: "Intégrations", desc: "Shopify, WooCommerce, et export HTML direct." },
            { icon: BarChart, title: "Analytics intégrés", desc: "Suivez les conversions de chaque page produit." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:-translate-y-1 transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[#FF3A8C]" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#888888] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Testimonials */}
      <section id="testimonials" className="py-24 overflow-hidden relative border-t border-white/5 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Ils ont arrêté de perdre du temps</h2>
          <p className="text-xl text-[#888888] max-w-2xl mx-auto">Rejoignez des milliers de marchands qui construisent leurs pages produit avec l'IA.</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar px-6 md:px-12 lg:justify-center">
          {[
            { initials: "SM", color: "bg-blue-500", name: "Sophie M.", shop: "Boutique Maison & Déco", desc: "En 2 minutes j'avais une page produit que j'aurais mis 3h à faire sur Canva. Bluffant." },
            { initials: "AK", color: "bg-[#FF3A8C]", name: "Alex K.", shop: "SneakerDrop", desc: "Le taux de conversion a fait +40% depuis que j'utilise les templates générés par PageForge. C'est magique." },
            { initials: "JT", color: "bg-green-500", name: "Julie T.", shop: "Cosmetic Paris", desc: "Plus besoin de payer un freelance 500€ pour une landing page. Le ROI est immédiat." },
          ].map((testi, i) => (
            <div key={i} className="min-w-[320px] max-w-[400px] snap-center glass-card p-8 flex-shrink-0">
              <div className="flex items-center gap-1 text-[#F59E0B] mb-6">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg leading-relaxed mb-8">"{testi.desc}"</p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${testi.color} flex items-center justify-center font-bold text-lg text-white shadow-lg`}>
                  {testi.initials}
                </div>
                <div>
                  <h4 className="font-bold">{testi.name}</h4>
                  <p className="text-sm text-[#888888]">{testi.shop}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee logos */}
        <div className="mt-16 border-y border-white/5 py-8 overflow-hidden bg-[#0A0A0A]">
          <div className="flex items-center gap-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap opacity-50">
            {["Shopify", "WooCommerce", "Prestashop", "Stripe", "NextJS", "Vercel", "Shopify", "WooCommerce", "Prestashop", "Stripe"].map((logo, i) => (
              <span key={i} className="text-2xl font-black uppercase tracking-widest text-[#888888]">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent, sans surprise</h2>
          <p className="text-xl text-[#888888]">Choisissez le plan qui correspond à votre ambition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="glass-card p-8 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <div className="text-4xl font-black mb-1">Gratuit</div>
            <p className="text-sm text-[#888888] mb-8 pb-8 border-b border-white/10">Pour découvrir la puissance de l'IA.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> 5 pages générées par mois</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> 1 projet actif</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> Templates standards</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> Export HTML</li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              Commencer
            </button>
          </div>

          {/* Pro */}
          <div className="glass-card p-8 flex flex-col relative border-gradient shadow-[0_0_50px_rgba(108,58,255,0.15)] transform md:-translate-y-4">
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-gradient-primary rounded-full text-xs font-bold shadow-lg">
              Le plus populaire
            </div>
            <h3 className="text-xl font-bold mb-2 text-gradient">Pro</h3>
            <div className="text-4xl font-black mb-1">29€<span className="text-lg text-[#888] font-normal">/mois</span></div>
            <p className="text-sm text-[#888888] mb-8 pb-8 border-b border-white/10">Pour les e-commerçants sérieux.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#6C3AFF]" /> Pages générées illimitées</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#6C3AFF]" /> Projets illimités</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#6C3AFF]" /> Templates premium & personnalisables</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#6C3AFF]" /> Intégrations Shopify & Woo</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#6C3AFF]" /> Analytics avancés</li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors">
              Essayer Pro gratuitement (14j)
            </button>
          </div>

          {/* Agency */}
          <div className="glass-card p-8 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Agency</h3>
            <div className="text-4xl font-black mb-1">99€<span className="text-lg text-[#888] font-normal">/mois</span></div>
            <p className="text-sm text-[#888888] mb-8 pb-8 border-b border-white/10">Pour les agences et multi-boutiques.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> Tout le plan Pro</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> Multi-boutiques (jusqu'à 10)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> Marque blanche (White label)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> Gestion des permissions d'équipe</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#888]" /> Accès API</li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              Contacter les ventes
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 text-center">Questions fréquentes</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "Est-ce que je dois coder pour utiliser PageForge ?", a: "Non, absolument pas. PageForge est conçu pour les non-développeurs. L'IA génère tout pour vous, et vous pouvez modifier le texte et les images via notre éditeur visuel simple." },
            { q: "Quelles plateformes e-commerce sont supportées ?", a: "Nous proposons des intégrations en un clic pour Shopify et WooCommerce. Vous pouvez également exporter directement le code HTML/CSS brut si vous utilisez une solution interne." },
            { q: "Puis-je personnaliser les pages générées ?", a: "Oui. L'IA vous fournit une base ultra-optimisée, mais chaque élément (couleurs, polices, texte, images) est facilement modifiable dans le panel des propriétés à droite de l'éditeur." },
            { q: "Comment fonctionne la génération IA ?", a: "Vous décrivez simplement votre produit (ou collez un lien fournisseur). L'IA analyse les caractéristiques, rédige un copywriting persuasif, structure la page pour maximiser la conversion, et génère le design en quelques secondes." },
            { q: "Y a-t-il un essai gratuit ?", a: "Oui, notre plan Starter est totalement gratuit. Il vous permet de tester la plateforme et de générer jusqu'à 5 pages complètes par mois." },
            { q: "Mes données produits sont-elles sécurisées ?", a: "Nous utilisons un chiffrement de bout en bout et nous ne partageons pas vos données produits avec nos partenaires d'IA pour l'entraînement. Vos descriptions et produits vous appartiennent exclusivement." }
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-lg">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-base text-[#888]">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 8. Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(108,58,255,0.1)] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-30 pointer-events-none blur-[100px] rounded-full bg-gradient-to-r from-[#FF3A8C] to-[#6C3AFF] -z-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Votre prochaine page produit est à 10 secondes.</h2>
          <p className="text-xl md:text-2xl text-[#888888] mb-12">Rejoignez des milliers d'e-commerçants qui vendent plus avec PageForge.</p>
          <Link to="/onboarding" className="inline-block px-10 py-5 rounded-2xl bg-white text-black text-xl font-black hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Créer ma première page — gratuitement
          </Link>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6C3AFF]" />
            <span className="font-bold text-lg">PageForge</span>
            <span className="text-sm text-[#555] ml-2">La forge à conversion.</span>
          </div>
          
          <div className="flex gap-6 text-sm text-[#888888]">
            <a href="#" className="hover:text-white transition-colors">Produit</a>
            <a href="#" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 text-center text-[#444] text-sm">
          <p>Fait avec ❤️ pour les e-commerçants.</p>
          <p className="mt-2 text-xs">© {new Date().getFullYear()} PageForge Inc.</p>
        </div>
      </footer>
    </div>
  );
}

