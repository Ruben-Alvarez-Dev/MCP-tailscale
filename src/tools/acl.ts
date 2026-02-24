/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ACL Tools - MCP Tools for Tailscale Access Control Policies
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Tool, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TailscaleClient, AclPolicy } from '../client.js';

// ─────────────────────────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────

export const aclTools: Tool[] = [
  {
    name: 'tailscale_get_acl',
    description: 'Get the current ACL (Access Control List) policy for the tailnet. Shows groups, acls, tagOwners, and tests.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'tailscale_set_acl',
    description: 'Update the ACL policy for the tailnet. WARNING: This replaces the entire ACL policy.',
    inputSchema: {
      type: 'object',
      properties: {
        policy: {
          type: 'object',
          description: 'Complete ACL policy JSON object',
        },
      },
      required: ['policy'],
    },
  },
  {
    name: 'tailscale_validate_acl',
    description: 'Validate an ACL policy without applying it. Use this to test changes before deployment.',
    inputSchema: {
      type: 'object',
      properties: {
        policy: {
          type: 'object',
          description: 'ACL policy JSON object to validate',
        },
      },
      required: ['policy'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas for Validation
// ─────────────────────────────────────────────────────────────────────────────

const SetAclSchema = z.object({
  policy: z.record(z.unknown()),
});

const ValidateAclSchema = z.object({
  policy: z.record(z.unknown()),
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function handleAclTool(
  name: string,
  args: unknown,
  client: TailscaleClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'tailscale_get_acl': {
      const policy = await client.acl.get();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(policy, null, 2),
          },
        ],
      };
    }

    case 'tailscale_set_acl': {
      const { policy } = SetAclSchema.parse(args);
      
      // Validate first
      const validation = await client.acl.validate(policy as AclPolicy);
      if (!validation.valid) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'ACL validation failed',
                message: validation.message,
              }, null, 2),
            },
          ],
        };
      }
      
      await client.acl.set(policy as AclPolicy);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'ACL policy updated successfully',
            }, null, 2),
          },
        ],
      };
    }

    case 'tailscale_validate_acl': {
      const { policy } = ValidateAclSchema.parse(args);
      const result = await client.acl.validate(policy as AclPolicy);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: result.valid,
              message: result.valid ? 'ACL policy is valid' : result.message,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown ACL tool: ${name}`);
  }
}
