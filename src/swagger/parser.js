export function extractEndpointsList(doc) {
  const endpoints = [];

  for (const [path, pathItem] of Object.entries(doc.paths || {})) {
    const methods = Object.keys(pathItem).filter((key) =>
      ['get', 'post', 'put', 'delete', 'patch'].includes(key),
    );

    const tags = new Set();
    let summary;

    methods.forEach((method) => {
      const operation = pathItem[method];
      if (operation.tags) {
        operation.tags.forEach((tag) => tags.add(tag));
      }
      if (!summary && operation.summary) {
        summary = operation.summary;
      }
    });

    endpoints.push({
      path,
      methods,
      tags: Array.from(tags),
      summary,
    });
  }

  return endpoints;
}

export function getEndpointDetails(doc, path, method) {
  const pathItem = doc.paths?.[path];
  if (!pathItem) {
    return null;
  }

  if (method) {
    return {
      path,
      method: method.toLowerCase(),
      details: pathItem[method.toLowerCase()],
    };
  }

  const methods = Object.keys(pathItem).filter((key) =>
    ['get', 'post', 'put', 'delete', 'patch'].includes(key),
  );

  return {
    path,
    methods: methods.map((m) => ({
      method: m,
      details: pathItem[m],
    })),
  };
}

export function searchEndpoints(doc, query) {
  const queryLower = query.toLowerCase();
  const results = [];

  for (const [path, pathItem] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        continue;
      }

      let score = 0;

      if (path.toLowerCase().includes(queryLower)) {
        score += 3;
      }

      if (operation.summary?.toLowerCase().includes(queryLower)) {
        score += 2;
      }

      if (operation.description?.toLowerCase().includes(queryLower)) {
        score += 1;
      }

      if (operation.tags?.some((tag) => tag.toLowerCase().includes(queryLower))) {
        score += 2;
      }

      if (score > 0) {
        results.push({
          path,
          method,
          summary: operation.summary,
          tags: operation.tags,
          score,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export function getSchemas(doc, schemaName) {
  if (!doc.components?.schemas) {
    return null;
  }

  if (schemaName) {
    return {
      name: schemaName,
      schema: doc.components.schemas[schemaName],
    };
  }

  return {
    schemaNames: Object.keys(doc.components.schemas),
    count: Object.keys(doc.components.schemas).length,
  };
}

export function getAllTags(doc) {
  const tagsSet = new Set();

  for (const pathItem of Object.values(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        continue;
      }
      if (operation.tags) {
        operation.tags.forEach((tag) => tagsSet.add(tag));
      }
    }
  }

  return Array.from(tagsSet).sort();
}

export function getEndpointsByTag(doc, tag) {
  const endpoints = [];

  for (const [path, pathItem] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        continue;
      }

      if (operation.tags?.includes(tag)) {
        endpoints.push({
          path,
          method,
          summary: operation.summary,
          description: operation.description,
          deprecated: operation.deprecated || false,
        });
      }
    }
  }

  return endpoints;
}

export function getApiInfo(doc) {
  return {
    title: doc.info?.title,
    version: doc.info?.version,
    description: doc.info?.description,
    termsOfService: doc.info?.termsOfService,
    contact: doc.info?.contact,
    license: doc.info?.license,
    servers: doc.servers,
  };
}

export function getSecuritySchemes(doc) {
  if (!doc.components?.securitySchemes) {
    return null;
  }

  return {
    schemes: doc.components.securitySchemes,
    count: Object.keys(doc.components.securitySchemes).length,
  };
}

export function getServerUrls(doc) {
  if (!doc.servers || doc.servers.length === 0) {
    return null;
  }

  return doc.servers.map((server) => ({
    url: server.url,
    description: server.description,
    variables: server.variables,
  }));
}

export function validateEndpointPath(doc, path) {
  const exists = !!doc.paths?.[path];

  if (exists) {
    return {
      exists: true,
      path,
      methods: Object.keys(doc.paths[path]).filter((key) =>
        ['get', 'post', 'put', 'delete', 'patch'].includes(key)
      ),
    };
  }

  // Find similar paths
  const allPaths = Object.keys(doc.paths || {});
  const suggestions = allPaths
    .map((p) => {
      const similarity = calculateSimilarity(path, p);
      return { path: p, similarity };
    })
    .filter((s) => s.similarity > 0.4)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map((s) => s.path);

  return {
    exists: false,
    suggestions,
  };
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export function getSchemaReferences(doc, schemaName) {
  const references = [];

  for (const [path, pathItem] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        continue;
      }

      const operationString = JSON.stringify(operation);
      if (operationString.includes(`#/components/schemas/${schemaName}`)) {
        references.push({
          path,
          method,
          summary: operation.summary,
        });
      }
    }
  }

  return {
    schemaName,
    usageCount: references.length,
    usedBy: references,
  };
}

export function generateCurlExample(doc, path, method) {
  const pathItem = doc.paths?.[path];
  if (!pathItem) {
    return null;
  }

  const operation = pathItem[method.toLowerCase()];
  if (!operation) {
    return null;
  }

  const baseUrl = doc.servers?.[0]?.url || 'http://localhost:3000';
  let curl = `curl -X ${method.toUpperCase()} "${baseUrl}${path}"`;

  // Add headers
  const headers = [];
  if (operation.requestBody?.content) {
    const contentType = Object.keys(operation.requestBody.content)[0];
    headers.push(`Content-Type: ${contentType}`);
  }

  // Check for security requirements
  if (operation.security || doc.security) {
    headers.push('Authorization: Bearer YOUR_TOKEN_HERE');
  }

  headers.forEach((header) => {
    curl += ` \\\n  -H "${header}"`;
  });

  // Add body example
  if (operation.requestBody?.content) {
    const contentType = Object.keys(operation.requestBody.content)[0];
    const schema = operation.requestBody.content[contentType]?.schema;

    if (schema) {
      const example = generateSchemaExample(doc, schema);
      curl += ` \\\n  -d '${JSON.stringify(example, null, 2)}'`;
    }
  }

  return {
    path,
    method: method.toUpperCase(),
    curl,
    description: operation.summary,
  };
}

function generateSchemaExample(doc, schema) {
  if (schema.$ref) {
    const schemaName = schema.$ref.split('/').pop();
    const resolvedSchema = doc.components?.schemas?.[schemaName];
    if (resolvedSchema) {
      return generateSchemaExample(doc, resolvedSchema);
    }
  }

  if (schema.example) {
    return schema.example;
  }

  if (schema.type === 'object') {
    const example = {};
    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        example[key] = generateSchemaExample(doc, prop);
      }
    }
    return example;
  }

  if (schema.type === 'array') {
    return [generateSchemaExample(doc, schema.items || {})];
  }

  if (schema.type === 'string') {
    return schema.enum?.[0] || 'string';
  }

  if (schema.type === 'number' || schema.type === 'integer') {
    return 0;
  }

  if (schema.type === 'boolean') {
    return true;
  }

  return null;
}

export function getDeprecatedEndpoints(doc) {
  const deprecated = [];

  for (const [path, pathItem] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        continue;
      }

      if (operation.deprecated === true) {
        deprecated.push({
          path,
          method,
          summary: operation.summary,
          description: operation.description,
        });
      }
    }
  }

  return {
    total: deprecated.length,
    endpoints: deprecated,
  };
}

export async function executeEndpoint(doc, path, method, options = {}) {
  const pathItem = doc.paths?.[path];
  if (!pathItem) {
    return {
      error: 'Endpoint not found',
      path,
    };
  }

  const operation = pathItem[method.toLowerCase()];
  if (!operation) {
    return {
      error: 'Method not found for this endpoint',
      path,
      method,
    };
  }

  // Build the URL
  const baseUrl = options.baseUrl || doc.servers?.[0]?.url || 'http://localhost:3000';
  let url = `${baseUrl}${path}`;

  // Replace path parameters
  if (options.pathParams) {
    for (const [key, value] of Object.entries(options.pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    }
  }

  // Add query parameters
  if (options.queryParams) {
    const queryString = new URLSearchParams(options.queryParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Extract required headers from operation parameters
  const requiredHeaders = operation.parameters?.filter(
    (param) => param.in === 'header' && param.required
  ) || [];

  for (const param of requiredHeaders) {
    if (!headers[param.name] && param.schema?.example) {
      headers[param.name] = param.schema.example;
    }
  }

  // Build fetch options
  const fetchOptions = {
    method: method.toUpperCase(),
    headers,
  };

  // Add body for POST, PUT, PATCH
  if (['post', 'put', 'patch'].includes(method.toLowerCase()) && options.body) {
    fetchOptions.body = typeof options.body === 'string'
      ? options.body
      : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      url,
      method: method.toUpperCase(),
    };
  } catch (error) {
    return {
      error: error.message,
      url,
      method: method.toUpperCase(),
    };
  }
}