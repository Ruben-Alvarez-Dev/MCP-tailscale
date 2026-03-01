# ═══════════════════════════════════════════════════════════════════════════
# Tailscale MCP Server - API Documentation
# ═══════════════════════════════════════════════════════════════════════════

## Overview

This MCP server provides complete access to the Tailscale API v2 through the Model Context Protocol.

## Base URL

```
https://api.tailscale.com
```

## Authentication

All requests require a Bearer token in the Authorization header:

```
Authorization: Bearer tskey-api-xxxxxxxxxxxxx
```

## Rate Limits

| Plan | Requests/minute |
|------|-----------------|
| Free | 60 |
| Personal | 120 |
| Enterprise | 300 |

## ═══════════════════════════════════════════════════════════════════════════
## TOOLS REFERENCE
## ═══════════════════════════════════════════════════════════════════════════

---

## 📱 Devices

### tailscale_list_devices

List all devices in the tailnet.

**Parameters**: None

**Response**:
```json
{
  "count": 5,
  "devices": [
    {
      "id": "node-abcdef123456",
      "name": "laptop",
      "hostname": "macbook-pro",
      "os": "macOS",
      "addresses": ["100.64.0.1", "fd7a:115c:a1e0::1"],
      "online": true,
      "authorized": true,
      "lastSeen": "2026-03-02T08:00:00Z",
      "tags": []
    }
  ]
}
```

---

### tailscale_get_device

Get detailed information about a specific device.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | string | Yes | Device ID (e.g., "node-abcdef123456") |

**Response**: Full device object with all properties.

---

### tailscale_authorize_device

Authorize or deauthorize a device.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | string | Yes | Device ID |
| authorized | boolean | No | Default: true |

**Response**:
```json
{
  "success": true,
  "message": "Device node-abc authorized successfully"
}
```

---

### tailscale_delete_device

Permanently delete a device.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | string | Yes | Device ID |

**Response**:
```json
{
  "success": true,
  "message": "Device node-abc deleted successfully"
}
```

---

### tailscale_set_device_tags

Set ACL tags on a device.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | string | Yes | Device ID |
| tags | array | Yes | List of tags (e.g., ["tag:server"]) |

---

## 🔑 API Keys

### tailscale_list_keys

List all API keys in the tailnet.

**Parameters**: None

**Response**:
```json
{
  "count": 3,
  "keys": [
    {
      "id": "k123456",
      "description": "CI/CD key",
      "created": "2026-01-15T10:00:00Z",
      "expires": "2026-04-15T10:00:00Z",
      "invalid": false
    }
  ]
}
```

---

### tailscale_create_key

Create a new API key.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| description | string | Yes | Key description |
| expirySeconds | number | No | Expiry in seconds (default: 7776000 = 90 days) |
| reusable | boolean | No | Allow multiple uses (default: false) |
| ephemeral | boolean | No | Create ephemeral key (default: false) |
| preauthorized | boolean | No | Auto-authorize devices (default: false) |
| tags | array | No | Tags for devices created with this key |

**Response**:
```json
{
  "success": true,
  "id": "k123456",
  "key": "tskey-auth-k123456...",
  "message": "⚠️ Save this key now! It will not be shown again."
}
```

---

### tailscale_delete_key

Delete an API key.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| keyId | string | Yes | Key ID to delete |

---

## 🌐 DNS

### tailscale_get_dns_nameservers

Get current DNS nameservers.

**Response**:
```json
{
  "dns": ["1.1.1.1", "8.8.8.8"]
}
```

---

### tailscale_set_dns_nameservers

Set DNS nameservers.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| nameservers | array | Yes | List of DNS server IPs |

---

### tailscale_get_dns_preferences

Get DNS preferences (MagicDNS status).

**Response**:
```json
{
  "magicDns": true
}
```

---

### tailscale_set_dns_preferences

Enable/disable MagicDNS.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| magicDns | boolean | Yes | Enable or disable |

---

### tailscale_get_search_paths

Get DNS search paths.

**Response**:
```json
{
  "searchPaths": ["example.com", "internal.example.com"]
}
```

---

### tailscale_set_search_paths

Set DNS search paths.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| searchPaths | array | Yes | List of search domains |

---

## 🛡️ ACLs

### tailscale_get_acl

Get current ACL policy.

**Response**:
```json
{
  "groups": {
    "group:admin": ["user@example.com"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["group:admin"],
      "dst": ["*:*"]
    }
  ],
  "tagOwners": {
    "tag:server": ["group:admin"]
  }
}
```

---

### tailscale_set_acl

Update ACL policy.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| policy | object | Yes | Complete ACL policy JSON |

**Note**: The policy is validated before being applied.

---

### tailscale_validate_acl

Validate an ACL policy without applying it.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| policy | object | Yes | ACL policy to validate |

**Response**:
```json
{
  "valid": true,
  "message": "ACL policy is valid"
}
```

---

## 🚦 Routes & Exit Nodes

### tailscale_list_routes

List routes for a device.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | string | Yes | Device ID |

**Response**:
```json
{
  "routes": ["10.0.0.0/24", "192.168.1.0/24"]
}
```

---

### tailscale_set_routes

Enable subnet routes on a device.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | string | Yes | Device ID |
| routes | array | Yes | List of CIDR routes to enable |

---

### tailscale_set_exit_node

Configure a device as an exit node.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | string | Yes | Device ID |
| enabled | boolean | Yes | Enable or disable exit node |

---

## 👥 Users & Tailnet

### tailscale_list_users

List all users in the tailnet.

**Response**:
```json
{
  "count": 10,
  "users": [
    {
      "id": "u123456",
      "loginName": "user@example.com",
      "displayName": "John Doe",
      "status": "active",
      "type": "member",
      "created": "2025-01-01T00:00:00Z",
      "lastSeen": "2026-03-02T08:00:00Z"
    }
  ]
}
```

---

### tailscale_get_user

Get details of a specific user.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| userId | string | Yes | User ID |

---

### tailscale_delete_user

Remove a user from the tailnet.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| userId | string | Yes | User ID to remove |

---

### tailscale_get_tailnet

Get tailnet information.

**Response**:
```json
{
  "name": "example.com",
  "domain": "example.com",
  "created": "2025-01-01T00:00:00Z",
  "expiry": "2026-01-01T00:00:00Z"
}
```

---

### tailscale_get_tailnet_settings

Get tailnet settings.

**Response**: Object with tailnet configuration settings.

---

## Error Handling

All tools return errors in this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common error codes:
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Official Tailscale API Documentation

For more details, see: https://tailscale.com/api
