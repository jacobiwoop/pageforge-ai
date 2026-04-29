# APIs

Le serveur opencode expose les API suivantes.

## Global

| Méthode | Chemin           | Description                               | Réponse                              |
| ------- | ---------------- | ----------------------------------------- | ------------------------------------ |
| GET     | `/global/health` | Obtenir l’état et la version du serveur   | `{ healthy: true, version: string }` |
| GET     | `/global/event`  | Obtenir les événements globaux (flux SSE) | Flux d’événements                    |

## Projet

| Méthode | Chemin             | Description                | Réponse     |
| ------- | ------------------ | -------------------------- | ----------- |
| GET     | `/project`         | Lister tous les projets    | `Project[]` |
| GET     | `/project/current` | Obtenir le projet en cours | `Project`   |

## Chemin et VCS

| Méthode | Chemin  | Description                                    | Réponse   |
| ------- | ------- | ---------------------------------------------- | --------- |
| GET     | `/path` | Obtenir le chemin actuel                       | `Path`    |
| GET     | `/vcs`  | Obtenir les informations VCS du projet courant | `VcsInfo` |

## Exemple

| Méthode | Chemin              | Description                   | Réponse   |
| ------- | ------------------- | ----------------------------- | --------- |
| POST    | `/instance/dispose` | Supprimer l’instance actuelle | `boolean` |

## Configuration

| Méthode | Chemin              | Description                                   | Réponse                                                         |
| ------- | ------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| GET     | `/config`           | Obtenir les informations de configuration     | `Config`                                                        |
| PATCH   | `/config`           | Mettre à jour la configuration                | `Config`                                                        |
| GET     | `/config/providers` | Lister les fournisseurs et modèles par défaut | `{ providers: Provider[], default: { [key: string]: string } }` |

## Fournisseur

| Méthode | Chemin                           | Description                                              | Réponse                                                    |
| ------- | -------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| GET     | `/provider`                      | Lister tous les fournisseurs                             | `{ all: Provider[], default: {...}, connected: string[] }` |
| GET     | `/provider/auth`                 | Obtenir les méthodes d’authentification des fournisseurs | `{ [providerID: string]: ProviderAuthMethod[] }`           |
| POST    | `/provider/{id}/oauth/authorize` | Autoriser un fournisseur avec OAuth                      | `ProviderAuthAuthorization`                                |
| POST    | `/provider/{id}/oauth/callback`  | Gérer le callback OAuth                                  | `boolean`                                                  |

## Sessions

| Méthode | Chemin                                   | Description                                 | Remarques                                                        |
| ------- | ---------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| GET     | `/session`                               | Lister toutes les sessions                  | Retourne `Session[]`                                             |
| POST    | `/session`                               | Créer une nouvelle session                  | Corps : `{ parentID?, title? }`, retourne `Session`              |
| GET     | `/session/status`                        | Obtenir l’état de toutes les sessions       | Retourne `{ [sessionID: string]: SessionStatus }`                |
| GET     | `/session/:id`                           | Obtenir les détails d’une session           | Retourne `Session`                                               |
| DELETE  | `/session/:id`                           | Supprimer une session et ses données        | Retourne `boolean`                                               |
| PATCH   | `/session/:id`                           | Mettre à jour les propriétés d’une session  | Corps : `{ title? }`, retourne `Session`                         |
| GET     | `/session/:id/children`                  | Obtenir les sessions enfants                | Retourne `Session[]`                                             |
| GET     | `/session/:id/todo`                      | Obtenir la liste des tâches                 | Retourne `Todo[]`                                                |
| POST    | `/session/:id/init`                      | Analyser l’application et créer `AGENTS.md` | Corps : `{ messageID, providerID, modelID }`, retourne `boolean` |
| POST    | `/session/:id/fork`                      | Forker une session existante                | Corps : `{ messageID? }`, retourne `Session`                     |
| POST    | `/session/:id/abort`                     | Abandonner une session en cours             | Retourne `boolean`                                               |
| POST    | `/session/:id/share`                     | Partager une session                        | Retourne `Session`                                               |
| DELETE  | `/session/:id/share`                     | Annuler le partage                          | Retourne `Session`                                               |
| GET     | `/session/:id/diff`                      | Obtenir le diff de la session               | Query : `messageID?`, retourne `FileDiff[]`                      |
| POST    | `/session/:id/summarize`                 | Résumer la session                          | Corps : `{ providerID, modelID }`, retourne `boolean`            |
| POST    | `/session/:id/revert`                    | Restaurer un message                        | Corps : `{ messageID, partID? }`, retourne `boolean`             |
| POST    | `/session/:id/unrevert`                  | Restaurer tous les messages annulés         | Retourne `boolean`                                               |
| POST    | `/session/:id/permissions/:permissionID` | Répondre à une demande d’autorisation       | Corps : `{ response, remember? }`, retourne `boolean`            |

## Messages

| Méthode | Chemin                            | Description                                | Remarques                                                                                                               |
| ------- | --------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| GET     | `/session/:id/message`            | Lister les messages d’une session          | Query : `limit?`, retourne `{ info: Message, parts: Part[] }[]`                                                         |
| POST    | `/session/:id/message`            | Envoyer un message et attendre une réponse | Corps : `{ messageID?, model?, agent?, noReply?, system?, tools?, parts }`, retourne `{ info: Message, parts: Part[] }` |
| GET     | `/session/:id/message/:messageID` | Obtenir les détails d’un message           | Retourne `{ info: Message, parts: Part[] }`                                                                             |
| POST    | `/session/:id/prompt_async`       | Envoyer un message de manière asynchrone   | Même corps que `/session/:id/message`, retourne `204 No Content`                                                        |
| POST    | `/session/:id/command`            | Exécuter une commande slash                | Corps : `{ messageID?, agent?, model?, command, arguments }`, retourne `{ info: Message, parts: Part[] }`               |
| POST    | `/session/:id/shell`              | Exécuter une commande shell                | Corps : `{ agent, model?, command }`, retourne `{ info: Message, parts: Part[] }`                                       |

## Commandes

| Méthode | Chemin     | Description                 | Réponse     |
| ------- | ---------- | --------------------------- | ----------- |
| GET     | `/command` | Lister toutes les commandes | `Command[]` |

## Fichiers

| Méthode | Chemin                   | Description                                 | Réponse                                                                          |
| ------- | ------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------- |
| GET     | `/find?pattern=<pat>`    | Rechercher du texte dans les fichiers       | Liste d’objets : `path`, `lines`, `line_number`, `absolute_offset`, `submatches` |
| GET     | `/find/file?query=<q>`   | Rechercher des fichiers/répertoires par nom | `string[]`                                                                       |
| GET     | `/find/symbol?query=<q>` | Rechercher des symboles                     | `Symbol[]`                                                                       |
| GET     | `/file?path=<path>`      | Lister fichiers et répertoires              | `FileNode[]`                                                                     |
| GET     | `/file/content?path=<p>` | Lire un fichier                             | `FileContent`                                                                    |
| GET     | `/file/status`           | Obtenir le statut des fichiers suivis       | `File[]`                                                                         |

### Paramètres `/find/file`

- `query` _(obligatoire)_ : chaîne de recherche (floue)
- `type` _(optionnel)_ : `"file"` ou `"directory"`
- `directory` _(optionnel)_ : répertoire racine
- `limit` _(optionnel)_ : max `1 à 200`
- `dirs` _(optionnel)_ : `"false"` retourne uniquement les fichiers

## Outils (expérimentaux)

| Méthode | Chemin                                      | Description                             | Réponse    |
| ------- | ------------------------------------------- | --------------------------------------- | ---------- |
| GET     | `/experimental/tool/ids`                    | Répertorier tous les ID d’outils        | `ToolIDs`  |
| GET     | `/experimental/tool?provider=<p>&model=<m>` | Répertorier les outils avec schéma JSON | `ToolList` |

## LSP, Formateurs et MCP

| Méthode | Chemin       | Description                          | Réponse                         |
| ------- | ------------ | ------------------------------------ | ------------------------------- |
| GET     | `/lsp`       | Obtenir l’état du serveur LSP        | `LSPStatus[]`                   |
| GET     | `/formatter` | Obtenir l’état du formateur          | `FormatterStatus[]`             |
| GET     | `/mcp`       | Obtenir l’état du serveur MCP        | `{ [name: string]: MCPStatus }` |
| POST    | `/mcp`       | Ajouter dynamiquement un serveur MCP | Corps : `{ name, config }`      |

## Agents

| Méthode | Chemin   | Description                        | Réponse   |
| ------- | -------- | ---------------------------------- | --------- |
| GET     | `/agent` | Lister tous les agents disponibles | `Agent[]` |

## Enregistrement

| Méthode | Chemin | Description                  | Réponse   |
| ------- | ------ | ---------------------------- | --------- |
| POST    | `/log` | Écrire une entrée de journal | `boolean` |

Corps :

```json
{
  "service": "string",
  "level": "string",
  "message": "string",
  "extra": {}
}
```

## TUI

| Méthode | Chemin                  | Description                               | Réponse   |
| ------- | ----------------------- | ----------------------------------------- | --------- |
| POST    | `/tui/append-prompt`    | Ajouter du texte à l’invite               | `boolean` |
| POST    | `/tui/open-help`        | Ouvrir l’aide                             | `boolean` |
| POST    | `/tui/open-sessions`    | Ouvrir le sélecteur de session            | `boolean` |
| POST    | `/tui/open-themes`      | Ouvrir le sélecteur de thème              | `boolean` |
| POST    | `/tui/open-models`      | Ouvrir le sélecteur de modèle             | `boolean` |
| POST    | `/tui/submit-prompt`    | Soumettre l’invite                        | `boolean` |
| POST    | `/tui/clear-prompt`     | Effacer l’invite                          | `boolean` |
| POST    | `/tui/execute-command`  | Exécuter une commande                     | `boolean` |
| POST    | `/tui/show-toast`       | Afficher une notification                 | `boolean` |
| GET     | `/tui/control/next`     | Attendre la prochaine demande de contrôle | Objet     |
| POST    | `/tui/control/response` | Répondre à une demande de contrôle        | `boolean` |

## Authentification

| Méthode | Chemin      | Description                                 | Réponse   |
| ------- | ----------- | ------------------------------------------- | --------- |
| PUT     | `/auth/:id` | Définir les informations d’authentification | `boolean` |

## Événements

| Méthode | Chemin   | Description                              | Réponse  |
| ------- | -------- | ---------------------------------------- | -------- |
| GET     | `/event` | Flux d’événements envoyés par le serveur | Flux SSE |

## Documentation

| Méthode | Chemin | Description               | Réponse   |
| ------- | ------ | ------------------------- | --------- |
| GET     | `/doc` | Spécification OpenAPI 3.1 | Page HTML |
