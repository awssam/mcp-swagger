export const toolDefinitions = [
  {
    name: 'listEndpoints',
    description:
      'Liste tous les endpoints disponibles dans l\'API avec leurs méthodes HTTP et tags. Retourne un résumé léger optimisé pour économiser les tokens.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'Filtrer par tag spécifique (optionnel)',
        },
      },
    },
  },
  {
    name: 'getEndpointDetails',
    description:
      'Récupère les détails complets d\'un endpoint spécifique : paramètres, body, réponses, schémas, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Le chemin de l\'endpoint (ex: /users/{id})',
        },
        method: {
          type: 'string',
          description: 'La méthode HTTP (optionnel, si omis retourne toutes les méthodes)',
          enum: ['get', 'post', 'put', 'delete', 'patch'],
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'searchEndpoints',
    description:
      'Recherche des endpoints par mot-clé dans les chemins, descriptions, tags. Retourne les résultats triés par pertinence.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Le terme de recherche',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'getSchemas',
    description:
      'Récupère les schémas de données (DTOs) définis dans l\'API. Sans paramètre, liste tous les schémas disponibles. Avec un nom, retourne le schéma complet.',
    inputSchema: {
      type: 'object',
      properties: {
        schemaName: {
          type: 'string',
          description: 'Le nom du schéma à récupérer (optionnel)',
        },
      },
    },
  },
  {
    name: 'listTags',
    description:
      'Liste tous les tags utilisés pour catégoriser les endpoints dans l\'API.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getEndpointsByTag',
    description:
      'Récupère tous les endpoints associés à un tag spécifique. Plus ciblé que listEndpoints avec filtre.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'Le tag pour lequel récupérer les endpoints',
        },
      },
      required: ['tag'],
    },
  },
  {
    name: 'getApiInfo',
    description:
      'Récupère les métadonnées de l\'API : titre, version, description, serveurs, contact, licence.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getSecuritySchemes',
    description:
      'Liste les schémas d\'authentification/autorisation disponibles (OAuth2, API keys, Bearer tokens, etc.).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getServerUrls',
    description:
      'Récupère les URLs des serveurs disponibles et leurs environnements (dev, staging, prod, etc.).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'validateEndpointPath',
    description:
      'Vérifie si un chemin d\'endpoint existe. Si non, suggère des chemins similaires pour corriger les erreurs de frappe.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Le chemin de l\'endpoint à valider (ex: /users/{id})',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'getSchemaReferences',
    description:
      'Trouve tous les endpoints qui utilisent un schéma spécifique. Utile pour l\'analyse d\'impact lors de modifications de schémas.',
    inputSchema: {
      type: 'object',
      properties: {
        schemaName: {
          type: 'string',
          description: 'Le nom du schéma à rechercher',
        },
      },
      required: ['schemaName'],
    },
  },
  {
    name: 'generateCurlExample',
    description:
      'Génère un exemple de commande curl pour un endpoint spécifique, incluant les headers et un corps de requête exemple.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Le chemin de l\'endpoint (ex: /users/{id})',
        },
        method: {
          type: 'string',
          description: 'La méthode HTTP',
          enum: ['get', 'post', 'put', 'delete', 'patch'],
        },
      },
      required: ['path', 'method'],
    },
  },
  {
    name: 'getDeprecatedEndpoints',
    description:
      'Liste tous les endpoints marqués comme dépréciés. Utile pour la planification de migrations.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'executeEndpoint',
    description:
      'Exécute un endpoint API et retourne la réponse réelle. Utilise automatiquement les headers requis définis dans le Swagger. Parfait pour tester les endpoints et récupérer des données en temps réel.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Le chemin de l\'endpoint (ex: /users/{id})',
        },
        method: {
          type: 'string',
          description: 'La méthode HTTP',
          enum: ['get', 'post', 'put', 'delete', 'patch'],
        },
        baseUrl: {
          type: 'string',
          description: 'URL de base du serveur (optionnel, utilise celle du Swagger par défaut)',
        },
        pathParams: {
          type: 'object',
          description: 'Paramètres de chemin (ex: {"id": "123"})',
        },
        queryParams: {
          type: 'object',
          description: 'Paramètres de requête (ex: {"page": 1, "perPage": 10})',
        },
        headers: {
          type: 'object',
          description: 'Headers personnalisés (ex: {"Authorization": "Bearer token"})',
        },
        body: {
          type: 'object',
          description: 'Corps de la requête pour POST/PUT/PATCH',
        },
      },
      required: ['path', 'method'],
    },
  },
];