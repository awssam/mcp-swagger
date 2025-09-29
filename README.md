# @awssam/mcp-swagger

MCP (Model Context Protocol) server for exposing Swagger/OpenAPI documentation to AI models like Claude. This tool allows AI assistants to explore, understand, and interact with your API documentation seamlessly.

## Features

- **14 Powerful Tools** for exploring API documentation
- **Automatic Caching** for fast responses
- **OpenAPI 3.0 Support** (Swagger 2.0 compatible)
- **Token-Optimized** responses for efficient AI interactions
- **Search & Discovery** with intelligent scoring
- **Path Validation** with typo suggestions
- **Curl Generation** with example payloads
- **Schema Analysis** and reference tracking

## Installation

```bash
npm install -g @awssam/mcp-swagger
```

## Quick Start

### Using with Claude Desktop

Add to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

### Using with Claude CLI (Claude Code)

**Option 1: Using `claude mcp add` command (Recommended)**

```bash
claude mcp add swagger npx @awssam/mcp-swagger https://petstore.swagger.io/v2/swagger.json
```

**Option 2: Manual Configuration**

Add to your Claude CLI configuration file:

**Location**: `~/.config/claude/config.yaml`

```yaml
mcpServers:
  swagger:
    command: npx
    args:
      - "@awssam/mcp-swagger"
      - "https://petstore.swagger.io/v2/swagger.json"
```

Or if installed globally:

```yaml
mcpServers:
  swagger:
    command: mcp-swagger
    args:
      - "https://petstore.swagger.io/v2/swagger.json"
```

After adding the configuration, restart Claude CLI for the changes to take effect.

### Using with Environment Variable

```bash
export API_URL=https://your-api.com/api-docs
npx @awssam/mcp-swagger
```

### Using as CLI

```bash
npx @awssam/mcp-swagger https://your-api.com/api-docs
```

## Available Tools

### 1. `listEndpoints`
Lists all available API endpoints with their HTTP methods and tags.

**Parameters:**
- `tag` (optional): Filter by specific tag

**Example:**
```json
{
  "tag": "users"
}
```

### 2. `getEndpointDetails`
Retrieves complete details of a specific endpoint including parameters, request body, responses, and schemas.

**Parameters:**
- `path` (required): Endpoint path (e.g., `/users/{id}`)
- `method` (optional): HTTP method (get, post, put, delete, patch)

**Example:**
```json
{
  "path": "/users/{id}",
  "method": "get"
}
```

### 3. `searchEndpoints`
Searches for endpoints by keyword in paths, descriptions, and tags. Results are sorted by relevance.

**Parameters:**
- `query` (required): Search term

**Example:**
```json
{
  "query": "authentication"
}
```

### 4. `getSchemas`
Retrieves data schemas (DTOs) defined in the API. Without parameters, lists all available schemas.

**Parameters:**
- `schemaName` (optional): Specific schema name to retrieve

**Example:**
```json
{
  "schemaName": "User"
}
```

### 5. `listTags`
Lists all tags used to categorize endpoints in the API.

### 6. `getEndpointsByTag`
Retrieves all endpoints associated with a specific tag.

**Parameters:**
- `tag` (required): Tag name

**Example:**
```json
{
  "tag": "authentication"
}
```

### 7. `getApiInfo`
Retrieves API metadata including title, version, description, servers, contact info, and license.

### 8. `getSecuritySchemes`
Lists authentication/authorization schemes available (OAuth2, API keys, Bearer tokens, etc.).

### 9. `getServerUrls`
Retrieves available server URLs and their environments (dev, staging, prod, etc.).

### 10. `validateEndpointPath`
Checks if an endpoint path exists. If not found, suggests similar paths to help with typos.

**Parameters:**
- `path` (required): Endpoint path to validate

**Example:**
```json
{
  "path": "/users/{id}"
}
```

### 11. `getSchemaReferences`
Finds all endpoints that use a specific schema. Useful for impact analysis when modifying schemas.

**Parameters:**
- `schemaName` (required): Schema name to search for

**Example:**
```json
{
  "schemaName": "User"
}
```

### 12. `generateCurlExample`
Generates a curl command example for a specific endpoint, including headers and sample request body.

**Parameters:**
- `path` (required): Endpoint path
- `method` (required): HTTP method

**Example:**
```json
{
  "path": "/users",
  "method": "post"
}
```

### 13. `getDeprecatedEndpoints`
Lists all endpoints marked as deprecated. Useful for migration planning.

### 14. `executeEndpoint`
**✨ NEW** - Executes an API endpoint and returns the actual response. Automatically uses required headers from the Swagger spec. Perfect for testing endpoints and fetching real-time data.

**Parameters:**
- `path` (required): Endpoint path (e.g., `/users/{id}`)
- `method` (required): HTTP method (get, post, put, delete, patch)
- `baseUrl` (optional): Base server URL (uses Swagger default if not provided)
- `pathParams` (optional): Path parameters object (e.g., `{"id": "123"}`)
- `queryParams` (optional): Query parameters object (e.g., `{"page": 1, "perPage": 10}`)
- `headers` (optional): Custom headers object (e.g., `{"Authorization": "Bearer token"}`)
- `body` (optional): Request body for POST/PUT/PATCH

**Example:**
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

**Response includes:**
- `success`: Boolean indicating if request succeeded
- `status`: HTTP status code
- `statusText`: HTTP status message
- `data`: Response body (parsed JSON or text)
- `headers`: Response headers
- `url`: Full URL that was called
- `method`: HTTP method used

## Project Structure

```
src/
├── index.js                 # Entry point & server setup
├── config.js               # Configuration management
├── swagger/
│   ├── fetcher.js          # Swagger doc fetching & caching
│   └── parser.js           # Endpoint, schema, and tag parsing
└── tools/
    ├── definitions.js      # Tool schemas & definitions
    └── handlers.js         # Tool request handlers
```

## Configuration

The server accepts the API URL in three ways (in order of precedence):

1. **Command-line argument**: `npx @awssam/mcp-swagger <URL>`
2. **Environment variable**: `export API_URL=<URL>`
3. **Default**: `http://localhost:3000/api-json`

## Requirements

- Node.js >= 18.0.0
- Valid Swagger/OpenAPI JSON or YAML endpoint

## Use Cases

- **API Exploration**: Let AI understand and navigate your API
- **Documentation Assistance**: Get instant answers about endpoints
- **Code Generation**: Generate curl commands and examples
- **Migration Planning**: Find deprecated endpoints
- **Impact Analysis**: Track schema usage across endpoints
- **Developer Onboarding**: Quick API discovery and learning

## Development

```bash
# Clone the repository
git clone https://github.com/awssam/mcp-swagger.git
cd mcp-swagger

# Install dependencies
npm install

# Run locally
npm start https://petstore.swagger.io/v2/swagger.json
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

- **Issues**: https://github.com/awssam/mcp-swagger/issues
- **Author**: Awssam Saidi

## Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic Claude](https://www.anthropic.com/claude)
- [OpenAPI Specification](https://swagger.io/specification/)