# @awssam/mcp-swagger

Serveur MCP (Model Context Protocol) pour exposer la documentation Swagger/OpenAPI aux modèles d'IA comme Claude. Cet outil permet aux assistants IA d'explorer, comprendre et interagir de manière transparente avec votre documentation API.

## Fonctionnalités

- **14 outils puissants** pour explorer la documentation API
- **Mise en cache automatique** pour des réponses rapides
- **Support OpenAPI 3.0** (compatible Swagger 2.0)
- Réponses **optimisées en tokens** pour des interactions IA efficaces
- **Recherche & découverte** avec scoring intelligent
- **Validation de chemin** avec suggestions de correction
- **Génération de Curl** avec exemples de payload
- **Analyse de schéma** et suivi des références

## Installation

```bash
npm install -g @awssam/mcp-swagger
```

## Démarrage rapide

### Utilisation avec Claude Desktop

Ajoutez à votre fichier de configuration Claude Desktop :

**MacOS** : `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows** : `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "swagger": {
      "command": "npx",
      "args": [
        "@awssam/mcp-swagger",
        "https://petstore.swagger.io/v2/swagger.json"
      ]
    }
  }
}
```

### Utilisation avec Claude CLI (Claude Code)

**Option 1 : Utilisation de la commande `claude mcp add` (Recommandé)**

```bash
claude mcp add swagger npx @awssam/mcp-swagger https://petstore.swagger.io/v2/swagger.json
```

**Option 2 : Configuration manuelle**

Ajoutez à votre fichier de configuration Claude CLI :

**Emplacement** : `~/.config/claude/config.yaml`

```yaml
mcpServers:
  swagger:
    command: npx
    args:
      - "@awssam/mcp-swagger"
      - "https://petstore.swagger.io/v2/swagger.json"
```

Ou si installé globalement :

```yaml
mcpServers:
  swagger:
    command: mcp-swagger
    args:
      - "https://petstore.swagger.io/v2/swagger.json"
```

Après avoir ajouté la configuration, redémarrez Claude CLI pour que les modifications prennent effet.

### Utilisation avec une variable d'environnement

```bash
export API_URL=https://your-api.com/api-docs
npx @awssam/mcp-swagger
```

### Utilisation en CLI

```bash
npx @awssam/mcp-swagger https://your-api.com/api-docs
```

## Outils disponibles

### 1. `listEndpoints`
Liste tous les endpoints API disponibles avec leurs méthodes HTTP et tags.

**Paramètres :**
- `tag` (optionnel) : Filtrer par tag spécifique

**Exemple :**
```json
{
  "tag": "users"
}
```

### 2. `getEndpointDetails`
Récupère les détails complets d'un endpoint spécifique incluant les paramètres, le corps de requête, les réponses et les schémas.

**Paramètres :**
- `path` (requis) : Chemin de l'endpoint (ex. `/users/{id}`)
- `method` (optionnel) : Méthode HTTP (get, post, put, delete, patch)

**Exemple :**
```json
{
  "path": "/users/{id}",
  "method": "get"
}
```

### 3. `searchEndpoints`
Recherche des endpoints par mot-clé dans les chemins, descriptions et tags. Les résultats sont triés par pertinence.

**Paramètres :**
- `query` (requis) : Terme de recherche

**Exemple :**
```json
{
  "query": "authentication"
}
```

### 4. `getSchemas`
Récupère les schémas de données (DTOs) définis dans l'API. Sans paramètre, liste tous les schémas disponibles.

**Paramètres :**
- `schemaName` (optionnel) : Nom du schéma spécifique à récupérer

**Exemple :**
```json
{
  "schemaName": "User"
}
```

### 5. `listTags`
Liste tous les tags utilisés pour catégoriser les endpoints dans l'API.

### 6. `getEndpointsByTag`
Récupère tous les endpoints associés à un tag spécifique.

**Paramètres :**
- `tag` (requis) : Nom du tag

**Exemple :**
```json
{
  "tag": "authentication"
}
```

### 7. `getApiInfo`
Récupère les métadonnées de l'API incluant titre, version, description, serveurs, informations de contact et licence.

### 8. `getSecuritySchemes`
Liste les schémas d'authentification/autorisation disponibles (OAuth2, clés API, tokens Bearer, etc.).

### 9. `getServerUrls`
Récupère les URLs des serveurs disponibles et leurs environnements (dev, staging, prod, etc.).

### 10. `validateEndpointPath`
Vérifie si un chemin d'endpoint existe. Si non trouvé, suggère des chemins similaires pour aider avec les fautes de frappe.

**Paramètres :**
- `path` (requis) : Chemin de l'endpoint à valider

**Exemple :**
```json
{
  "path": "/users/{id}"
}
```

### 11. `getSchemaReferences`
Trouve tous les endpoints qui utilisent un schéma spécifique. Utile pour l'analyse d'impact lors de la modification de schémas.

**Paramètres :**
- `schemaName` (requis) : Nom du schéma à rechercher

**Exemple :**
```json
{
  "schemaName": "User"
}
```

### 12. `generateCurlExample`
Génère un exemple de commande curl pour un endpoint spécifique, incluant les headers et un exemple de corps de requête.

**Paramètres :**
- `path` (requis) : Chemin de l'endpoint
- `method` (requis) : Méthode HTTP

**Exemple :**
```json
{
  "path": "/users",
  "method": "post"
}
```

### 13. `getDeprecatedEndpoints`
Liste tous les endpoints marqués comme dépréciés. Utile pour la planification de migration.

### 14. `executeEndpoint`
**✨ NOUVEAU** - Exécute un endpoint API et retourne la réponse réelle. Utilise automatiquement les headers requis depuis la spécification Swagger. Parfait pour tester les endpoints et récupérer des données en temps réel.

**Paramètres :**
- `path` (requis) : Chemin de l'endpoint (ex. `/users/{id}`)
- `method` (requis) : Méthode HTTP (get, post, put, delete, patch)
- `baseUrl` (optionnel) : URL de base du serveur (utilise la valeur par défaut de Swagger si non fournie)
- `pathParams` (optionnel) : Objet de paramètres de chemin (ex. `{"id": "123"}`)
- `queryParams` (optionnel) : Objet de paramètres de requête (ex. `{"page": 1, "perPage": 10}`)
- `headers` (optionnel) : Objet de headers personnalisés (ex. `{"Authorization": "Bearer token"}`)
- `body` (optionnel) : Corps de requête pour POST/PUT/PATCH

**Exemple :**
```json
{
  "path": "/admin/organizations",
  "method": "get",
  "baseUrl": "http://localhost:4000",
  "queryParams": {
    "page": 1,
    "perPage": 10
  },
  "headers": {
    "x-dev-code": "ILoveMom"
  }
}
```

**La réponse inclut :**
- `success` : Booléen indiquant si la requête a réussi
- `status` : Code de statut HTTP
- `statusText` : Message de statut HTTP
- `data` : Corps de réponse (JSON parsé ou texte)
- `headers` : Headers de réponse
- `url` : URL complète appelée
- `method` : Méthode HTTP utilisée

## Structure du projet

```
src/
├── index.js                 # Point d'entrée & configuration du serveur
├── config.js               # Gestion de la configuration
├── swagger/
│   ├── fetcher.js          # Récupération & mise en cache de la doc Swagger
│   └── parser.js           # Parsing des endpoints, schémas et tags
└── tools/
    ├── definitions.js      # Schémas & définitions des outils
    └── handlers.js         # Gestionnaires de requêtes des outils
```

## Configuration

Le serveur accepte l'URL de l'API de trois manières (par ordre de priorité) :

1. **Argument en ligne de commande** : `npx @awssam/mcp-swagger <URL>`
2. **Variable d'environnement** : `export API_URL=<URL>`
3. **Valeur par défaut** : `http://localhost:3000/api-json`

## Prérequis

- Node.js >= 18.0.0
- Un endpoint JSON ou YAML Swagger/OpenAPI valide

## Cas d'usage

- **Exploration d'API** : Permettre à l'IA de comprendre et naviguer votre API
- **Assistance à la documentation** : Obtenir des réponses instantanées sur les endpoints
- **Génération de code** : Générer des commandes curl et des exemples
- **Planification de migration** : Trouver les endpoints dépréciés
- **Analyse d'impact** : Suivre l'utilisation des schémas à travers les endpoints
- **Onboarding de développeurs** : Découverte et apprentissage rapide de l'API

## Développement

```bash
# Cloner le dépôt
git clone https://github.com/awssam/mcp-swagger.git
cd mcp-swagger

# Installer les dépendances
npm install

# Exécuter localement
npm start https://petstore.swagger.io/v2/swagger.json
```

## Licence

MIT

## Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request.

## Support

- **Issues** : https://github.com/awssam/mcp-swagger/issues
- **Auteur** : Awssam Saidi

## Projets connexes

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic Claude](https://www.anthropic.com/claude)
- [OpenAPI Specification](https://swagger.io/specification/)