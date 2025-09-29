#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { API_URL } from './config.js';
import { toolDefinitions } from './tools/definitions.js';
import { handleToolCall } from './tools/handlers.js';

const server = new Server(
  {
    name: 'mcp-swagger',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolDefinitions,
  };
});

server.setRequestHandler(CallToolRequestSchema, handleToolCall);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`MCP Swagger Server running on stdio, fetching from: ${API_URL}`);
}

main().catch(console.error);