# 🐛 Bugs & Problèmes recensés

### 🔴 Critiques (bloquants)

**1. `handleLogout` non défini dans `Generate.tsx`**
Le bouton logout appelle `handleLogout`, mais cette fonction n'est jamais déclarée dans le composant. Résultat : crash runtime au clic.

**2. `datetime` non importé dans `app.py`**
Le fichier `app.py` utilise `datetime.fromtimestamp(...)` et `datetime.now()`, mais `datetime` n'est jamais importé en haut du fichier. Le serveur crash dès l'appel à `/api/products` ou à la première session.

**3. Cookie sans `credentials: 'include'` dans `AuthContext.tsx`**
L'authentification fonctionne avec un cookie `httponly`, mais les `fetch` du frontend n'envoient le header `credentials: 'include'`. Résultat : `/api/auth/me` répond 401.

**4. `create_access_token` ignore `ACCESS_TOKEN_EXPIRE_MINUTES`**
Dans `auth.py`, la constante est définie à 1 semaine mais le fallback de `create_access_token` utilise `timedelta(minutes=15)`.

**5. Sessions perdues au redémarrage du backend**
`active_sessions` est un dictionnaire Python en mémoire.

### 🟠 Problèmes de logique

**6. Le mode "Direct Description" (`formMode='text'`) est non-fonctionnel**
Le backend `/api/generate` reçoit uniquement `{ url, user_id }` et essaiera de scraper le texte.

**7. Le `run_full_pipeline` retourne `None` silencieusement**
Si le scraping échoue, la fonction fait `return` sans retourner de valeur, provoquant un crash générique sur l'API.

**8. Le biais brutaliste (documenté mais partiellement corrigé)**
`"brut"` reste dans la liste de l'analyseur.

**9. Détection du type de produit par défaut toujours `saas`**
Si aucun mot-clé, `detected_product` est `saas`.

**10. `orchestrate_session` bloque avec `run_in_executor`**
L'executor par défaut limite les threads et bloque le serveur.

### 🟡 Problèmes d'UX / Interface

**11. Duplication du formulaire d'authentification**
Il existe deux formulaires de login distincts (Generate.tsx et AuthGuard.tsx).

**12. La barre de progression n'est pas synchronisée**
Hardcodée sur des mots FR fragiles.

**13. `getFileContent` sans gestion du `Content-Type`**
Le markdown s'affiche en brut.

**14. WebSocket importé mais jamais utilisé**
Le polling génère une charge inutile.

### 🔵 Sécurité

**15. `SECRET_KEY` hardcodée en clair**
Dans `auth.py`.

**16. CORS `allow_origins=["*"]` avec cookies**
Rejeté en prod.
