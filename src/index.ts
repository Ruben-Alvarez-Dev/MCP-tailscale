#!/usr/bin/env node
/**
 * Tailscale MCP Server - Main Entry Point
 * Model Context Protocol Server for Tailscale API
 * 
 * @module mcp-tailscale
 * @author Ruben-Alvarez-Dev
 * @version 1.0.0
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { z } from 'zod';
import { TailscaleApiError } from './client.js';

// Import tools
import { deviceTools, handleDeviceTool } from './tools/devices.js';
import { keyTools, handleKeyTool } from './tools/keys.js';
import { dnsTools, handleDnsTool } from './tools/dns.js';
import { aclTools, handleAclTool } from './tools/acl.js';
import { routeTools, handleRouteTool } from './tools/routes.js';
import { userTools, handleUserTool } from './tools/users.js';
import { TailscaleClient } from './client.js';

// Load environment variables
config();

// Configuration Schema
const ConfigSchema = z.object({
  TAILSCALE_API_KEY: z.string().min(1, 'TAILSCALE_API_KEY is required'),
  TAILSCALE_TAILNET: z.string().min(1, 'TAILSCALE_TAILNET is required'),
  TAILSCALE_API_URL: z.string().url().optional().default('https://api.tailscale.com'),
  TAILSCALE_TIMEOUT: z.coerce.number().optional().default(30000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
});

type Config = z.infer<typeof ConfigSchema>;

// Validate Configuration
function getConfig(): Config {
  const result = ConfigSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('[ERROR] Configuration Error:');
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    console.error('\n[INFO] Please set the required environment variables:');
    console.error('  TAILSCALE_API_KEY - Get from: https://login.tailscale.com/admin/settings/keys');
    console.error('  TAILSCALE_TAILNET - Your tailnet name (e.g., user@example.com)');
    process.exit(1);
  }
  
  return result.data;
}

// MCP Server Setup
export class TailscaleMCPServer {
  private server: Server;
  private client: TailscaleClient;
  private config: Config;

  constructor(configOverride?: Partial<Config>) {
    this.config = configOverride ? { ...getConfig(), ...configOverride } : getConfig();
    
    // Initialize Tailscale client
    this.client = new TailscaleClient({
      apiKey: this.config.TAILSCALE_API_KEY,
      tailnet: this.config.TAILSCALE_TAILNET,
      baseUrl: this.config.TAILSCALE_API_URL,
      timeout: this.config.TAILSCALE_TIMEOUT,
    });

    // Initialize MCP server
    this.server = new Server(
      {
        name: 'mcp-tailscale',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ...deviceTools,
          ...keyTools,
          ...dnsTools,
          ...aclTools,
          ...routeTools,
          ...userTools,
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Route to appropriate handler based on tool name prefix
        if (name.startsWith('tailscale_list_devices') || 
            name.startsWith('tailscale_get_device') || 
            name.startsWith('tailscale_authorize_device') || 
            name.startsWith('tailscale_delete_device') || 
            name.startsWith('tailscale_set_device_tags')) {
          return await handleDeviceTool(name, args, this.client);
        }
        
        if (name.startsWith('tailscale_list_keys') || 
            name.startsWith('tailscale_create_key') || 
            name.startsWith('tailscale_delete_key')) {
          return await handleKeyTool(name, args, this.client);
        }
        
        if (name.startsWith('tailscale_get_dns') || 
            name.startsWith('tailscale_set_dns') ||
            name.startsWith('tailscale_get_search') || 
            name.startsWith('tailscale_set_search')) {
          return await handleDnsTool(name, args, this.client);
        }
        
        if (name.startsWith('tailscale_get_acl') || 
            name.startsWith('tailscale_set_acl') ||
            name.startsWith('tailscale_validate_acl')) {
          return await handleAclTool(name, args, this.client);
        }
        
        if (name.startsWith('tailscale_list_routes') || 
            name.startsWith('tailscale_set_routes') ||
            name.startsWith('tailscale_set_exit_node')) {
          return await handleRouteTool(name, args, this.client);
        }
        
        if (name.startsWith('tailscale_list_users') || 
            name.startsWith('tailscale_get_user') ||
            name.startsWith('tailscale_delete_user') ||
            name.startsWith('tailscale_get_tailnet')) {
          return await handleUserTool(name, args, this.client);
        }

        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        // Handle Tailscale API errors specifically
        if (error instanceof TailscaleApiError) {
          throw new McpError(
            error.statusCode === 401 ? ErrorCode.InvalidRequest :
            error.statusCode === 404 ? ErrorCode.InvalidRequest :
            ErrorCode.InternalError,
            `Tailscale API Error (${error.statusCode}): ${error.message}`
          );
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    if (this.config.LOG_LEVEL === 'debug') {
      console.error('[DEBUG] Tailscale MCP Server started');
      console.error(`[DEBUG] Tailnet: ${this.config.TAILSCALE_TAILNET}`);
    }
  }

  async stop(): Promise<void> {
    await this.server.close();
  }
}

// Main Entry Point
async function main(): Promise<void> {
  const server = new TailscaleMCPServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await server.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await server.stop();
    process.exit(0);
  });

  await server.start();
}

// Run if called directly
main().catch((error) => {
  console.error('[FATAL] Server error:', error);
  process.exit(1);
});
