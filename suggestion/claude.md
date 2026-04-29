Bonne intuition sur OpenCode. Vérifions ce qu'il peut vraiment faire.Bingo. Tu avais raison, et c'est encore mieux que prévu. Voici la vérité complète sur OpenCode.

---

## OpenCode : ce que c'est vraiment ✅

Tu as parfaitement raison. OpenCode n'est **pas juste un générateur de code** — c'est un **agent de codage complet**, exactement comme Claude Code. Voici ce que ça change pour PageForge :

### Ce qu'OpenCode peut faire que tu n'exploites pas encore

**1. Sessions persistantes avec `--session <id>`**
OpenCode supporte un mode non-interactif avec `opencode -p "prompt"` et récupère un session ID en sortie JSON. Ton `test_opencode_persistence.py` a déjà prouvé ce concept — mais tu ne l'utilises pas dans le pipeline principal. Ça veut dire qu'après génération, tu peux **rappeler OpenCode avec le même `session_id`** et il relit ses propres fichiers, comprend le contexte, et modifie chirurgicalement.

**2. Serveur HTTP headless avec SSE**
L'architecture interne d'OpenCode expose un bus d'événements via HTTP/SSE — chaque message, tool call, et résultat est broadcasté en temps réel à tous les clients connectés. Tu peux faire `opencode serve` et appeler son API REST au lieu de spawner un subprocess à chaque fois. C'est **beaucoup plus rapide** — plus de cold boot.

**3. Snapshots Git automatiques**
OpenCode fait un snapshot à chaque début de step via Git — sans altérer l'historique. Si quelque chose se passe mal, il peut restaurer. Ça veut dire que dans chaque `session/`, les modifications sont **trackées et réversibles**.

**4. AGENTS.md = instructions de projet**
Tu peux créer un fichier `AGENTS.md` dans chaque dossier de session qui contient des instructions que l'IA inclut dans son contexte automatiquement. Pour PageForge, ça veut dire qu'à chaque session, tu peux injecter automatiquement la `style_spec.md` et les contraintes métier (FedaPay, bouton "Commander", etc.) **sans les remettre dans le prompt**.

---

### La nouvelle architecture pour PageForge

Au lieu de ce que tu fais maintenant :

```
Génération → subprocess opencode → final_page.html (monolithique)
```

Tu peux faire ça :

```
Génération → opencode serve (daemon) → API HTTP → session créée
                                                        ↓
Modification → opencode run --session <id> "change le hero"
                                                        ↓
                          OpenCode lit les fichiers, comprend, modifie chirurgicalement
```

**Et pour le multi-fichiers** : au lieu de demander à OpenCode de tout mettre dans un HTML, tu lui demandes de créer une structure React/Vite dans le dossier de session. Il sait faire ça nativement — il lit les fichiers existants, les crée, les split, les modifie.

---

### Plan concret

**Étape 1** — Modifier `coder.py` pour utiliser le mode **`opencode serve` + API REST** au lieu de subprocess bloquant

**Étape 2** — Changer le prompt pour demander une **structure multi-fichiers** (`App.tsx`, composants séparés) au lieu d'un HTML monolithique

**Étape 3** — Créer un `AGENTS.md` par session avec la `style_spec.md` et les règles métier injectées automatiquement

**Étape 4** — Endpoint `/api/edit` qui reprend le `session_id` et passe la modif à OpenCode — lui laisse la lecture/compréhension/modification

Tu veux qu'on attaque lequel de ces points ? Je recommande de commencer par **Étape 1 + 2 ensemble** (refactor de `coder.py`) car c'est le changement le plus structurant.

---

---

---

---

Parfait, j'ai tout ce qu'il faut. Voici une doc complète + un script de mini-test.

---

## OpenCode Serve — Tout ce que tu dois savoir

### Architecture réelle

```
┌─────────────────────────────────────────────────────┐
│  opencode serve (daemon, port 4096)                  │
│                                                       │
│  ┌──────────────────┐    ┌──────────────────────┐   │
│  │  Session Manager │    │  File System (CWD)   │   │
│  │  (SQLite persist)│    │  lit/écrit vraiment  │   │
│  └──────────────────┘    └──────────────────────┘   │
│           │                                           │
│  REST API + SSE events                               │
└──────────────┬──────────────────────────────────────┘
               │ HTTP
    ┌──────────┴──────────┐
    │   Ton backend       │
    │   FastAPI (app.py)  │  ← fait des appels HTTP simples
    └─────────────────────┘
```

### Les 4 appels essentiels

| Ce que tu veux faire      | Méthode | Endpoint                   |
| ------------------------- | ------- | -------------------------- |
| Créer une session         | `POST`  | `/session`                 |
| Envoyer un prompt         | `POST`  | `/session/:id/message`     |
| Écouter les events live   | `GET`   | `/session/:id/event` (SSE) |
| Lire les fichiers générés | `GET`   | `/file?path=...`           |

### Flow complet

```
1. opencode serve --port 4096 --hostname 0.0.0.0  (lancé 1 fois au démarrage)
                    ↓
2. POST /session → { "id": "ses_abc123" }
                    ↓
3. POST /session/ses_abc123/message  { "content": "Crée App.tsx..." }
                    ↓
4. GET  /session/ses_abc123/event  ← SSE stream, tu attends "message.completed"
                    ↓
5. Fichiers écrits sur disque dans le CWD du serve
                    ↓
6. Modification → POST /session/ses_abc123/message  { "content": "Change le hero..." }
                    ↓
   OpenCode LIT les fichiers, comprend, modifie chirurgicalement
```

### Différence clé : `run` vs `serve`

| `opencode run`                     | `opencode serve`                |
| ---------------------------------- | ------------------------------- |
| Spawn subprocess à chaque fois     | Daemon qui tourne en permanence |
| Cold start à chaque call           | Chaud, ~instantané              |
| Perd la session après exit         | Sessions SQLite persistantes    |
| Bloquant (subprocess.run)          | Non-bloquant (HTTP async)       |
| Utilisé dans ton `coder.py` actuel | Ce qu'on veut utiliser          |

---

Maintenant, le mini-test :---

## Ce que tu dois savoir avant de lancer

### Étape 1 — Installer et configurer OpenCode

`deja fait

### Étape 2 — Lancer le serveur dans le bon répertoire

**C'est le point le plus important.** OpenCode serve lit et écrit les fichiers **dans son CWD au démarrage**. Pour PageForge, chaque session doit avoir son propre répertoire :

```bash
mkdir -p sessions/mini_test
cd sessions/mini_test
opencode serve --port 4096 --hostname 0.0.0.0
```

Tu verras : `OpenCode server running on http://0.0.0.0:4096`

### Étape 3 — Lancer le test (dans un autre terminal)

```bash
python3 test_opencode_serve.py
```

---

### Ce que le test vérifie exactement

**Test 2 — Multi-fichiers** : demande à OpenCode de créer `index.html` + `main.jsx` + `App.jsx` séparément. Si ça marche → tu sais que tu peux remplacer le HTML monolithique.

**Test 3 — Chirurgical** : utilise **la même session** (`session_id` réutilisé) et demande de modifier seulement `App.jsx`. OpenCode relit les fichiers existants, comprend le contexte, et ne touche qu'à ce qu'on lui dit. C'est la capacité qui remplace tout le système `edit-intent-analyzer` d'open-lovable — OpenCode le fait nativement.

### Résultat attendu

```
═══════════════════
BILAN
═══════════════════
  Test 1 — Connexion serveur     : ✅
  Test 2 — Génération multi-files : ✅
  Test 3 — Modification chirurgic : ✅

🎉 TOUS LES TESTS PASSENT !
```

Si les 3 passent, on peut attaquer le vrai refactor de `coder.py`. Lance le test et dis-moi ce que tu obtiens.
