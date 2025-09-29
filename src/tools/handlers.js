import { fetchSwaggerDoc } from '../swagger/fetcher.js';
import {
  extractEndpointsList,
  getEndpointDetails,
  searchEndpoints,
  getSchemas,
  getAllTags,
  getEndpointsByTag,
  getApiInfo,
  getSecuritySchemes,
  getServerUrls,
  validateEndpointPath,
  getSchemaReferences,
  generateCurlExample,
  getDeprecatedEndpoints,
  executeEndpoint,
} from '../swagger/parser.js';

export async function handleToolCall(request) {
  const { name, arguments: args } = request.params;

  try {
    const doc = await fetchSwaggerDoc();

    switch (name) {
      case 'listEndpoints': {
        const endpoints = extractEndpointsList(doc);
        const filtered = args?.tag
          ? endpoints.filter((e) => e.tags.includes(args.tag))
          : endpoints;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  total: filtered.length,
                  endpoints: filtered,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'getEndpointDetails': {
        const details = getEndpointDetails(
          doc,
          args?.path,
          args?.method,
        );

        if (!details) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Endpoint not found' }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(details, null, 2),
            },
          ],
        };
      }

      case 'searchEndpoints': {
        const results = searchEndpoints(doc, args?.query);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  query: args?.query,
                  resultsCount: results.length,
                  results: results.slice(0, 20),
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'getSchemas': {
        const schemas = getSchemas(doc, args?.schemaName);

        if (!schemas) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'No schemas found' }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(schemas, null, 2),
            },
          ],
        };
      }

      case 'listTags': {
        const tags = getAllTags(doc);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  total: tags.length,
                  tags,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'getEndpointsByTag': {
        const endpoints = getEndpointsByTag(doc, args?.tag);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  tag: args?.tag,
                  total: endpoints.length,
                  endpoints,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'getApiInfo': {
        const info = getApiInfo(doc);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }

      case 'getSecuritySchemes': {
        const schemes = getSecuritySchemes(doc);

        if (!schemes) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'No security schemes found' }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(schemes, null, 2),
            },
          ],
        };
      }

      case 'getServerUrls': {
        const servers = getServerUrls(doc);

        if (!servers) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'No servers found' }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  total: servers.length,
                  servers,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'validateEndpointPath': {
        const validation = validateEndpointPath(doc, args?.path);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(validation, null, 2),
            },
          ],
        };
      }

      case 'getSchemaReferences': {
        const references = getSchemaReferences(doc, args?.schemaName);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(references, null, 2),
            },
          ],
        };
      }

      case 'generateCurlExample': {
        const example = generateCurlExample(doc, args?.path, args?.method);

        if (!example) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Endpoint not found' }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(example, null, 2),
            },
          ],
        };
      }

      case 'getDeprecatedEndpoints': {
        const deprecated = getDeprecatedEndpoints(doc);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(deprecated, null, 2),
            },
          ],
        };
      }

      case 'executeEndpoint': {
        const result = await executeEndpoint(doc, args?.path, args?.method, {
          baseUrl: args?.baseUrl,
          pathParams: args?.pathParams,
          queryParams: args?.queryParams,
          headers: args?.headers,
          body: args?.body,
        });

        if (result.error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: 'Unknown tool' }),
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
          }),
        },
      ],
      isError: true,
    };
  }
}