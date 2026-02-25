/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Routes Tools - MCP Tools for Tailscale Routes and Exit Nodes
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Tool, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TailscaleClient } from '../client.js';

// ─────────────────────────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────

export const routeTools: Tool[] = [
  {
    name: 'tailscale_list_routes',
    description: 'List the subnet routes that a device is currently advertising and those that are enabled.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          description: 'The unique identifier of the device',
        },
      },
      required: ['deviceId'],
    },
  },
  {
    name: 'tailscale_set_routes',
    description: 'Enable or disable subnet routes on a device. The device must already be advertising these routes.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          description: 'The unique identifier of the device',
        },
        routes: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of CIDR routes to enable (e.g., ["10.0.0.0/24", "192.168.1.0/24"])',
        },
      },
      required: ['deviceId', 'routes'],
    },
  },
  {
    name: 'tailscale_set_exit_node',
    description: 'Configure a device as an exit node for the tailnet. Exit nodes allow routing all traffic through that device.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          description: 'The unique identifier of the device',
        },
        enabled: {
          type: 'boolean',
          description: 'Enable (true) or disable (false) exit node functionality',
        },
      },
      required: ['deviceId', 'enabled'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas for Validation
// ─────────────────────────────────────────────────────────────────────────────

const ListRoutesSchema = z.object({
  deviceId: z.string().min(1),
});

const SetRoutesSchema = z.object({
  deviceId: z.string().min(1),
  routes: z.array(z.string()),
});

const SetExitNodeSchema = z.object({
  deviceId: z.string().min(1),
  enabled: z.boolean(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function handleRouteTool(
  name: string,
  args: unknown,
  client: TailscaleClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'tailscale_list_routes': {
      const { deviceId } = ListRoutesSchema.parse(args);
      const result = await client.routes.list(deviceId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'tailscale_set_routes': {
      const { deviceId, routes } = SetRoutesSchema.parse(args);
      await client.routes.set(deviceId, routes);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Routes enabled on device ${deviceId}`,
              routes,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_set_exit_node': {
      const { deviceId, enabled } = SetExitNodeSchema.parse(args);
      await client.routes.setExitNode(deviceId, enabled);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Exit node ${enabled ? 'enabled' : 'disabled'} on device ${deviceId}`,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown route tool: ${name}`);
  }
}
