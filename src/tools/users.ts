/**
 * ═══════════════════════════════════════════════════════════════════════════
 * User Tools - MCP Tools for Tailscale Users and Tailnet Management
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Tool, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TailscaleClient } from '../client.js';

// ─────────────────────────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────

export const userTools: Tool[] = [
  {
    name: 'tailscale_list_users',
    description: 'List all users (members) in the tailnet. Shows user details including status and last seen.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_get_user',
    description: 'Get detailed information about a specific user by their ID.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The unique identifier of the user',
        },
      },
      required: ['userId'],
    },
  },
  {
    name: 'tailscale_delete_user',
    description: 'Remove a user from the tailnet. They will no longer be able to access the network.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The unique identifier of the user to remove',
        },
      },
      required: ['userId'],
    },
  },
  {
    name: 'tailscale_get_tailnet',
    description: 'Get information about the current tailnet including name, domain, and creation date.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_get_tailnet_settings',
    description: 'Get the current settings for the tailnet.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas for Validation
// ─────────────────────────────────────────────────────────────────────────────

const GetUserSchema = z.object({
  userId: z.string().min(1),
});

const DeleteUserSchema = z.object({
  userId: z.string().min(1),
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function handleUserTool(
  name: string,
  args: unknown,
  client: TailscaleClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'tailscale_list_users': {
      const users = await client.users.list();
      const formattedUsers = users.map((u) => ({
        id: u.id,
        loginName: u.loginName,
        displayName: u.displayName,
        status: u.status,
        type: u.type,
        created: u.created,
        lastSeen: u.lastSeen,
      }));
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              count: users.length,
              users: formattedUsers,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_get_user': {
      const { userId } = GetUserSchema.parse(args);
      const user = await client.users.get(userId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(user, null, 2),
          },
        ],
      };
    }

    case 'tailscale_delete_user': {
      const { userId } = DeleteUserSchema.parse(args);
      await client.users.delete(userId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `User ${userId} removed from tailnet`,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_get_tailnet': {
      const tailnet = await client.tailnetApi.get();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(tailnet, null, 2),
          },
        ],
      };
    }

    case 'tailscale_get_tailnet_settings': {
      const settings = await client.tailnetApi.getSettings();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(settings, null, 2),
          },
        ],
      };
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown user tool: ${name}`);
  }
}
