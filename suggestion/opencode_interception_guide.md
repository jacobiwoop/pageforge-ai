# Guide d'Interception OpenCode : Flux SSE & Événements

Ce document détaille tous les événements qu'il est possible de capturer via le flux SSE (`/global/event`) pour enrichir l'expérience utilisateur de PageForge.

## 📡 Architecture du Flux
Le flux utilise le protocole **Server-Sent Events (SSE)**. Chaque message reçu est un objet JSON structuré comme suit :
- **directory** : Le dossier racine lié à l'événement.
- **payload** : L'événement réel (type et propriétés).

---

## 1. Intelligence Artificielle & Génération
C'est le cœur de l'expérience "Live".

### `message.part.delta`
- **Description** : Fragments de texte générés en temps réel par l'IA.
- **Payload** : `{ sessionID, messageID, partID, delta: string }`
- **Usage PageForge** : Afficher l'IA qui "tape" son code ou ses pensées dans une console ou un chat.

### `message.part.updated`
- **Description** : Notification de changement d'état d'un bloc (ex: passage de texte à un appel d'outil).
- **Usage PageForge** : Détecter quand l'IA s'apprête à écrire un fichier ou à lancer une commande.

### `todo.updated`
- **Description** : Fournit la liste complète des tâches planifiées par l'IA.
- **Payload** : `{ sessionID, todos: [ { id, title, status: "todo"|"in-progress"|"done" } ] }`
- **Usage PageForge** : Afficher une **barre de progression réelle** (ex: "Étape 3/5 : Configuration de Tailwind").

---

## 2. État & Cycle de Vie
Pour savoir quand l'IA travaille ou s'est arrêtée.

### `session.status`
- **Description** : Indique si la session est active.
- **Valeurs** : `busy` (travaille) ou `idle` (attend).
- **Usage PageForge** : Gérer les indicateurs de chargement (Spinners) et débloquer l'interface quand l'IA a fini.

### `session.idle`
- **Description** : Signal de fin absolue pour un cycle de prompt.
- **Usage PageForge** : Déclencher les actions post-génération (ex: rafraîchir l'aperçu du site).

### `question.asked`
- **Description** : L'IA pose une question car elle a besoin d'une précision.
- **Usage PageForge** : Afficher une boîte de dialogue pour permettre à l'utilisateur de répondre sans quitter l'interface.

---

## 3. Code & Qualité Technique
Pour transformer PageForge en un éditeur intelligent.

### `file.edited`
- **Description** : Un fichier a été modifié sur le disque.
- **Usage PageForge** : Recharger uniquement le fichier concerné dans l'aperçu (Hot Reload).

### `lsp.client.diagnostics`
- **Description** : Rapport d'erreurs en temps réel (syntaxe, linting).
- **Payload** : Liste des erreurs, lignes, et sévérité.
- **Usage PageForge** : 
    1. Afficher des badges rouges sur les fichiers erronés.
    2. **Auto-Fix** : Si une erreur de syntaxe apparaît, envoyer automatiquement un prompt invisible à l'IA pour qu'elle se corrige.

### `session.diff`
- **Description** : Envoie le diff complet des changements.
- **Usage PageForge** : Mode "Review" pour que l'utilisateur valide les changements ligne par ligne avant de les accepter.

---

## 4. Permissions & Commandes Shell
Pour le contrôle total.

### `permission.asked`
- **Description** : Demande d'autorisation pour une action sensible.
- **Usage PageForge** : Afficher un bouton "Autoriser/Refuser" pour les commandes shell (ex: `npm install`).

### `command.executed`
- **Description** : Historique des commandes lancées dans le terminal.
- **Usage PageForge** : Afficher un journal technique pour les développeurs avancés.

---

## 💡 Idées de Recettes d'Intégration

### Recette A : Le "Live Sandbox"
Intercepter `message.part.delta` et l'injecter dans un composant CodeMirror ou Monaco Editor en temps réel. L'utilisateur voit le code s'écrire sous ses yeux.

### Recette B : Le Debugger Automatique
Si `session.status` devient `idle` MAIS que `lsp.client.diagnostics` contient des erreurs `Error`, PageForge envoie automatiquement : *"Il y a une erreur de syntaxe à la ligne X du fichier Y, peux-tu corriger ?"*

### Recette C : L'Historique Temporel
Utiliser `session.diff` pour créer une "Time Machine" permettant de revenir à n'importe quelle version précédente de la génération.
