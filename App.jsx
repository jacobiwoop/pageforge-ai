import React, { useState, useEffect, useRef } from 'react'

const products = [
  {
    id: 1,
    name: 'Culinary Pro Chef Knife',
    category: 'Couteaux',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1592847642110-c5b67975259f?auto=format&fit=crop&w=800&q=80',
    description: 'Lame en acier Damas, manche en ébène',
  },
  {
    id: 2,
    name: 'Set de Poêles Anti-Adhésives',
    category: 'Ustensiles',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1584775164633-254271112835?auto=format&fit=crop&w=800&q=80',
    description: '3 tailles - Revêtement céramique',
  },
  {
    id: 3,
    name: 'Planche à Découper Artisanale',
    category: 'Accessoires',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1576912795256-3f4643379922?auto=format&fit=crop&w=800&q=80',
    description: 'Bois de marbre, finition huile de noix',
  },
  {
    id: 4,
    name: 'Set de Couteaux 7 Pièces',
    category: 'Couteaux',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1616322603939-157566826790?auto=format&fit=crop&w=800&q=80',
    description: 'Tout-en-un pour cuisine professionnelle',
  },
  {
    id: 5,
    name: 'Cassole Pro 28cm',
    category: 'Ustensiles',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f40381043?auto=format&fit=crop&w=800&q=80',
    description: 'Fonte émaillée, répartition heat uniforme',
  },
  {
    id: 6,
    name: 'Moulin à Epices Premium',
    category: 'Accessoires',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1604645663434-21117-3a1f6c2?auto=format&fit=crop&w=800&q=80',
    description: 'Acier inoxydable, ajustement fine ajustement',
  },
]

const App = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('tous')
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
    const handleScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      (filter === 'tous' || product.category === filter) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  )

  const categories = ['tous', ...new Set(products.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-slate-50 bg-grain">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-md"></div>
              <span className="font-montserrat text-xl font-bold text-slate-900">
                CuisinePro
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                Accueil
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                Produits
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                Recettes
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                About
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-slate-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="hidden md:flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-48 px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-4">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <a href="#" className="block text-slate-600 py-2">
                Accueil
              </a>
              <a href="#" className="block text-slate-600 py-2">
                Produits
              </a>
              <a href="#" className="block text-slate-600 py-2">
                Recettes
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="pt-16">
        <section className="relative bg-slate-900 text-white py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556989774-71167b44b722?auto=format&fit=crop&w=1920&q=80)' }}
          ></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl animate-fade-in-up">
              <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                l'art de la cuisine <br />
                <span className="text-red-600"> professionals</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 font-inter">
                Équipements d'exception pour chefs exigeants. Precision craftsmanship
                pour résultatsExceptionnels.
              </p>
              <button className="bg-red-600 text-white font-semibold py-4 px-8 rounded-md hover:bg-red-700 transition-all duration-300 ease-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Découvrir la collection
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Nos Produits
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Une sélection rigoureuse d'ustensiles de cuisine premium, conçus pour
                durer et offrir des performances exceptionnelles.
              </p>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-4 animate-fade-in-up">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-900'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
                    >
                      <div className="aspect-square bg-slate-200 h-64"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))
                : filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative aspect-square w-full overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-slate-900 shadow-sm">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-montserrat text-lg font-semibold text-slate-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-montserrat text-xl font-bold text-slate-900">
                            {product.price.toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </span>
                          <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium">
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16 animate-fade-in-up">
                <p className="text-slate-600 text-lg">
                  Aucun produit trouvé pour cette recherche.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300 animate-fade-in-up">
                <div className="w-16 h-16 bg-red-600 rounded-xl mx-auto flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-montserrat text-xl font-bold text-slate-900 mb-3">
                  Qualité Assurée
                </h3>
                <p className="text-slate-600">
                  Chaque produit est rigoureusement testé pour garantir un confort
                  d'utilisation optimal.
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300 animate-fade-in-up">
                <div className="w-16 h-16 bg-red-600 rounded-xl mx-auto flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-montserrat text-xl font-bold text-slate-900 mb-3">
                  Livraison Rapide
                </h3>
                <p className="text-slate-600">
                  Expédition sous 24h pour la plupart des commandes, partout en France.
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300 animate-fade-in-up">
                <div className="w-16 h-16 bg-red-600 rounded-xl mx-auto flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-montserrat text-xl font-bold text-slate-900 mb-3">
                  Satisfait ou Remboursé
                </h3>
                <p className="text-slate-600">
                  30 jours pour tester vos équipements. Sans condition, sans
                  discussion.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-6">
                  Rejoignez notre communauté de chefs
                </h2>
                <p className="text-slate-300 mb-8 text-lg">
                  Inscrivez-vous pour recevoir nos recettes exclusive, des conseils de
                  professionnels, et profitez de notre newsletter avec des réductions
                  réservées à nos abonnés.
                </p>
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 text-white font-semibold py-4 px-8 rounded-md hover:bg-red-700 transition-all duration-300 ease-out shadow-lg"
                  >
                    S'inscrire
                  </button>
                </form>
                <p className="text-slate-400 text-sm mt-4">
                  Pas de spam. Seulement des recettes et du bonheur culinaire.
                </p>
              </div>
              <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-slate-800"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg
                    className="w-48 h-48 text-white/20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-md"></div>
                <span className="font-montserrat text-xl font-bold">CuisinePro</span>
              </div>
              <p className="text-slate-400 text-sm">
                L'équipement culinaire de référence pour les chefs exigeants.
              </p>
            </div>
            <div>
              <h4 className="font-montserrat font-bold mb-4">Produits</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Couteaux</a></li>
                <li><a href="#" className="hover:text-white">Ustensiles</a></li>
                <li><a href="#" className="hover:text-white">Accessoires</a></li>
                <li><a href="#" className="hover:text-white">Ensemble</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Livraison</a></li>
                <li><a href="#" className="hover:text-white">Retours</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Mentions</a></li>
                <li><a href="#" className="hover:text-white">CGV</a></li>
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © 2024 CuisinePro. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
