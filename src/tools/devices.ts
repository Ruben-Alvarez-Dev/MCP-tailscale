/**
 * Device Tools - MCP Tools for Tailscale Device Management
 * 
 * @module mcp-tailscale/tools/devices
 * @author Ruben-Alvarez-Dev
 */

import { Tool, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TailscaleClient } from '../client.js';

// Tool Definitions
export const deviceTools: Tool[] = [
  {
    name: 'tailscale_list_devices',
    description: 'List all devices in the Tailscale network (tailnet). Returns device details including hostname, IP addresses, online status, and authorization status.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_get_device',
    description: 'Get detailed information about a specific Tailscale device by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          description: 'The unique identifier of the device (e.g., "node-abcdef123456")',
        },
      },
      required: ['deviceId'],
    },
  },
  {
    name: 'tailscale_authorize_device',
    description: 'Authorize or deauthorize a device on the Tailscale network. Unauthorized devices cannot access the network.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          description: 'The unique identifier of the device to authorize',
        },
        authorized: {
          type: 'boolean',
          description: 'Set to true to authorize, false to deauthorize (default: true)',
          default: true,
        },
      },
      required: ['deviceId'],
    },
  },
  {
    name: 'tailscale_delete_device',
    description: 'Permanently delete a device from the Tailscale network. This action cannot be undone.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          description: 'The unique identifier of the device to delete',
        },
      },
      required: ['deviceId'],
    },
  },
  {
    name: 'tailscale_set_device_tags',
    description: 'Set ACL tags on a device. Tags are used for access control policies.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'string',
          description: 'The unique identifier of the device',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of tags to assign (e.g., ["tag:server", "tag:production"])',
        },
      },
      required: ['deviceId', 'tags'],
    },
  },
];

// Input Schemas for Validation
const GetDeviceSchema = z.object({
  deviceId: z.string().min(1),
});

const AuthorizeDeviceSchema = z.object({
  deviceId: z.string().min(1),
  authorized: z.boolean().optional().default(true),
});

const DeleteDeviceSchema = z.object({
  deviceId: z.string().min(1),
});

const SetDeviceTagsSchema = z.object({
  deviceId: z.string().min(1),
  tags: z.array(z.string()),
});

// Tool Handler
export async function handleDeviceTool(
  name: string,
  args: unknown,
  client: TailscaleClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'tailscale_list_devices': {
      const devices = await client.devices.list();
      const formattedDevices = devices.map((d) => ({
        id: d.id,
        name: d.name,
        hostname: d.hostname,
        os: d.os,
        addresses: d.addresses,
        online: d.online,
        authorized: d.authorized,
        lastSeen: d.lastSeen,
        tags: d.tags || [],
      }));
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              count: devices.length,
              devices: formattedDevices,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_get_device': {
      const { deviceId } = GetDeviceSchema.parse(args);
      const device = await client.devices.get(deviceId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(device, null, 2),
          },
        ],
      };
    }

    case 'tailscale_authorize_device': {
      const { deviceId, authorized } = AuthorizeDeviceSchema.parse(args);
      await client.devices.authorize(deviceId, authorized);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Device ${deviceId} ${authorized ? 'authorized' : 'deauthorized'} successfully`,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_delete_device': {
      const { deviceId } = DeleteDeviceSchema.parse(args);
      await client.devices.delete(deviceId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Device ${deviceId} deleted successfully`,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_set_device_tags': {
      const { deviceId, tags } = SetDeviceTagsSchema.parse(args);
      await client.devices.setTags(deviceId, tags);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Tags ${JSON.stringify(tags)} set on device ${deviceId}`,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown device tool: ${name}`);
  }
}
