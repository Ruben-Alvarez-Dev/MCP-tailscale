/**
 * DNS Tools - MCP Tools for Tailscale DNS Configuration
 * 
 * @module mcp-tailscale/tools/dns
 * @author Ruben-Alvarez-Dev
 */

import { Tool, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TailscaleClient } from '../client.js';

// Tool Definitions
export const dnsTools: Tool[] = [
  {
    name: 'tailscale_get_dns_nameservers',
    description: 'Get the DNS nameservers configured for the tailnet.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_set_dns_nameservers',
    description: 'Configure DNS nameservers for the tailnet. Use this to set custom DNS servers like Cloudflare (1.1.1.1) or Google (8.8.8.8).',
    inputSchema: {
      type: 'object',
      properties: {
        nameservers: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of DNS server IPs (e.g., ["1.1.1.1", "8.8.8.8"])',
        },
      },
      required: ['nameservers'],
    },
  },
  {
    name: 'tailscale_get_dns_preferences',
    description: 'Get DNS preferences including MagicDNS status.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_set_dns_preferences',
    description: 'Enable or disable MagicDNS for the tailnet. MagicDNS provides automatic DNS resolution for devices.',
    inputSchema: {
      type: 'object',
      properties: {
        magicDns: {
          type: 'boolean',
          description: 'Enable (true) or disable (false) MagicDNS',
        },
      },
      required: ['magicDns'],
    },
  },
  {
    name: 'tailscale_get_search_paths',
    description: 'Get the DNS search paths configured for the tailnet.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_set_search_paths',
    description: 'Configure DNS search paths for the tailnet. Search paths allow short hostname resolution.',
    inputSchema: {
      type: 'object',
      properties: {
        searchPaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of search domains (e.g., ["example.com", "internal.example.com"])',
        },
      },
      required: ['searchPaths'],
    },
  },
];

// Input Schemas for Validation
const SetNameserversSchema = z.object({
  nameservers: z.array(z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]+$/, 'Must be a valid IPv4 or IPv6 address')).min(1),
});

const SetDnsPreferencesSchema = z.object({
  magicDns: z.boolean(),
});

const SetSearchPathsSchema = z.object({
  searchPaths: z.array(z.string()),
});

// Tool Handler
export async function handleDnsTool(
  name: string,
  args: unknown,
  client: TailscaleClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'tailscale_get_dns_nameservers': {
      const result = await client.dns.getNameservers();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'tailscale_set_dns_nameservers': {
      const { nameservers } = SetNameserversSchema.parse(args);
      const result = await client.dns.setNameservers(nameservers);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `DNS nameservers updated to: ${nameservers.join(', ')}`,
              ...result,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_get_dns_preferences': {
      const result = await client.dns.getPreferences();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'tailscale_set_dns_preferences': {
      const { magicDns } = SetDnsPreferencesSchema.parse(args);
      const result = await client.dns.setPreferences(magicDns);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `MagicDNS ${magicDns ? 'enabled' : 'disabled'}`,
              ...result,
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_get_search_paths': {
      const result = await client.dns.getSearchPaths();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'tailscale_set_search_paths': {
      const { searchPaths } = SetSearchPathsSchema.parse(args);
      const result = await client.dns.setSearchPaths(searchPaths);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'Search paths updated',
              ...result,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown DNS tool: ${name}`);
  }
}
