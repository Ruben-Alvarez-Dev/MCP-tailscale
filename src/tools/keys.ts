/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Key Tools - MCP Tools for Tailscale API Key Management
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Tool, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TailscaleClient } from '../client.js';

// ─────────────────────────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────

export const keyTools: Tool[] = [
  {
    name: 'tailscale_list_keys',
    description: 'List all API keys in the tailnet. Shows key descriptions, creation dates, and expiry.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_create_key',
    description: 'Create a new API key for the tailnet. Can configure expiry, capabilities, and tags.',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Human-readable description of the key purpose',
        },
        expirySeconds: {
          type: 'number',
          description: 'Key expiration time in seconds (default: 7776000 = 90 days)',
          default: 7776000,
        },
        reusable: {
          type: 'boolean',
          description: 'Allow key to be used multiple times (default: false)',
          default: false,
        },
        ephemeral: {
          type: 'boolean',
          description: 'Create ephemeral device key (default: false)',
          default: false,
        },
        preauthorized: {
          type: 'boolean',
          description: 'Auto-authorize devices created with this key (default: false)',
          default: false,
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to apply to devices created with this key (e.g., ["tag:server"])',
        },
      },
      required: ['description'],
    },
  },
  {
    name: 'tailscale_delete_key',
    description: 'Delete an API key by its ID. This immediately invalidates the key.',
    inputSchema: {
      type: 'object',
      properties: {
        keyId: {
          type: 'string',
          description: 'The unique identifier of the API key to delete',
        },
      },
      required: ['keyId'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas for Validation
// ─────────────────────────────────────────────────────────────────────────────

const CreateKeySchema = z.object({
  description: z.string().min(1),
  expirySeconds: z.number().positive().optional().default(7776000),
  reusable: z.boolean().optional().default(false),
  ephemeral: z.boolean().optional().default(false),
  preauthorized: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),
});

const DeleteKeySchema = z.object({
  keyId: z.string().min(1),
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function handleKeyTool(
  name: string,
  args: unknown,
  client: TailscaleClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'tailscale_list_keys': {
      const keys = await client.keys.list();
      const formattedKeys = keys.map((k) => ({
        id: k.id,
        description: k.description,
        created: k.created,
        expires: k.expires,
        invalid: k.invalid,
      }));
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              count: keys.length,
              keys: formattedKeys,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_create_key': {
      const params = CreateKeySchema.parse(args);
      const result = await client.keys.create({
        description: params.description,
        expirySeconds: params.expirySeconds,
        capabilities: {
          devices: {
            create: {
              reusable: params.reusable,
              ephemeral: params.ephemeral,
              preauthorized: params.preauthorized,
              tags: params.tags,
            },
          },
        },
      });
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              id: result.id,
              key: result.key,
              message: '⚠️ Save this key now! It will not be shown again.',
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_delete_key': {
      const { keyId } = DeleteKeySchema.parse(args);
      await client.keys.delete(keyId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `API key ${keyId} deleted successfully`,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown key tool: ${name}`);
  }
}
