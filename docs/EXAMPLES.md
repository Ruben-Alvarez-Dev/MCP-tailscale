# ═══════════════════════════════════════════════════════════════════════════
# Tailscale MCP Server - Usage Examples
# ═══════════════════════════════════════════════════════════════════════════

## Examples for Using Tailscale MCP with LLMs

---

## 📱 Device Management Examples

### Example 1: List all devices and check status

**User prompt**:
```
Show me all devices in my Tailscale network
```

**LLM will call**: `tailscale_list_devices`

**Response you'll see**:
```json
{
  "count": 5,
  "devices": [
    {
      "id": "node-abc123",
      "name": "macbook-pro",
      "hostname": "Rubens-MBP",
      "os": "macOS",
      "addresses": ["100.64.0.1", "fd7a:115c:a1e0::1"],
      "online": true,
      "authorized": true,
      "lastSeen": "2026-03-02T08:00:00Z"
    },
    {
      "id": "node-def456",
      "name": "iphone",
      "hostname": "Rubens-iPhone",
      "os": "iOS",
      "addresses": ["100.64.0.2"],
      "online": false,
      "authorized": true,
      "lastSeen": "2026-03-01T22:00:00Z"
    }
  ]
}
```

---

### Example 2: Authorize a new device

**User prompt**:
```
Authorize device node-xyz789 to my network
```

**LLM will call**: `tailscale_authorize_device`

**Parameters**:
```json
{
  "deviceId": "node-xyz789",
  "authorized": true
}
```

---

### Example 3: Tag a server device

**User prompt**:
```
Tag the device "production-server" with tag:server and tag:production
```

**LLM will call**: `tailscale_set_device_tags`

**Parameters**:
```json
{
  "deviceId": "node-prod123",
  "tags": ["tag:server", "tag:production"]
}
```

---

## 🌐 DNS Configuration Examples

### Example 4: Set custom DNS servers

**User prompt**:
```
Configure my tailnet to use Cloudflare and Google DNS
```

**LLM will call**: `tailscale_set_dns_nameservers`

**Parameters**:
```json
{
  "nameservers": ["1.1.1.1", "8.8.8.8"]
}
```

---

### Example 5: Enable MagicDNS

**User prompt**:
```
Enable MagicDNS for my network
```

**LLM will call**: `tailscale_set_dns_preferences`

**Parameters**:
```json
{
  "magicDns": true
}
```

---

### Example 6: Set search paths for internal domains

**User prompt**:
```
Add search paths for internal.example.com and staging.example.com
```

**LLM will call**: `tailscale_set_search_paths`

**Parameters**:
```json
{
  "searchPaths": ["internal.example.com", "staging.example.com"]
}
```

---

## 🛡️ ACL Management Examples

### Example 7: View current ACL policy

**User prompt**:
```
Show me the current ACL policy for my tailnet
```

**LLM will call**: `tailscale_get_acl`

---

### Example 8: Update ACL to allow specific access

**User prompt**:
```
Update the ACL to allow developers to access all servers
```

**LLM will call**: `tailscale_set_acl` (after validation)

**Parameters**:
```json
{
  "policy": {
    "groups": {
      "group:devs": ["dev1@example.com", "dev2@example.com"]
    },
    "acls": [
      {
        "action": "accept",
        "src": ["group:devs"],
        "dst": ["tag:server:*"]
      }
    ],
    "tagOwners": {
      "tag:server": ["group:admins"]
    }
  }
}
```

---

### Example 9: Validate ACL before applying

**User prompt**:
```
Validate this ACL policy: {"acls": [{"action": "accept", "src": ["*"], "dst": ["*:*"]}]}
```

**LLM will call**: `tailscale_validate_acl`

---

## 🚦 Routes & Exit Nodes Examples

### Example 10: Set up a subnet router

**User prompt**:
```
Enable subnet routes 10.0.0.0/24 and 192.168.1.0/24 on device node-router1
```

**LLM will call**: `tailscale_set_routes`

**Parameters**:
```json
{
  "deviceId": "node-router1",
  "routes": ["10.0.0.0/24", "192.168.1.0/24"]
}
```

---

### Example 11: Configure an exit node

**User prompt**:
```
Make device node-exitnode1 an exit node for my network
```

**LLM will call**: `tailscale_set_exit_node`

**Parameters**:
```json
{
  "deviceId": "node-exitnode1",
  "enabled": true
}
```

---

## 🔑 API Key Management Examples

### Example 12: Create an auth key for servers

**User prompt**:
```
Create a reusable auth key for servers that auto-authorizes devices, expires in 30 days
```

**LLM will call**: `tailscale_create_key`

**Parameters**:
```json
{
  "description": "Server auth key - auto-authorized",
  "expirySeconds": 2592000,
  "reusable": true,
  "preauthorized": true,
  "tags": ["tag:server"]
}
```

---

### Example 13: List and delete old keys

**User prompt**:
```
List all API keys and then delete key k123456
```

**LLM will call**:
1. `tailscale_list_keys`
2. `tailscale_delete_key` with `{"keyId": "k123456"}`

---

## 👥 User Management Examples

### Example 14: List all users

**User prompt**:
```
Show me all users in my tailnet
```

**LLM will call**: `tailscale_list_users`

---

### Example 15: Remove inactive user

**User prompt**:
```
Remove user u789012 from the network
```

**LLM will call**: `tailscale_delete_user`

**Parameters**:
```json
{
  "userId": "u789012"
}
```

---

## 🔧 Complex Workflow Examples

### Example 16: Onboard a new server

**User prompt**:
```
I need to onboard a new server. Create an auth key, tell me how to use it, 
and set up the ACL to allow admin access to tag:server
```

**LLM will**:
1. Call `tailscale_create_key` with server tags
2. Return instructions for using the key
3. Call `tailscale_get_acl` to see current policy
4. Suggest ACL updates if needed

---

### Example 17: Security audit

**User prompt**:
```
Help me audit my network security. Show me all devices, users, 
and the current ACL policy
```

**LLM will call**:
1. `tailscale_list_devices`
2. `tailscale_list_users`
3. `tailscale_get_acl`

Then analyze the results and provide security recommendations.

---

### Example 18: Set up split DNS

**User prompt**:
```
I want to use my internal DNS server 10.0.0.53 for internal.example.com 
but use Cloudflare for everything else
```

**LLM will**:
1. Call `tailscale_set_dns_nameservers` with `["10.0.0.53", "1.1.1.1"]`
2. Call `tailscale_set_search_paths` with `["internal.example.com"]`

---

## 📝 Natural Language Examples

You can use natural language with your LLM:

- "What devices are offline?"
- "Help me set up an exit node"
- "Show me all API keys that are about to expire"
- "Allow the developers group to access staging servers"
- "Configure my network to use my Pi-hole at 100.64.0.5"
- "Delete all unauthorized devices"
- "Create a key for my CI/CD pipeline"

The LLM will understand and call the appropriate tools automatically.

---

## ⚠️ Important Notes

1. **API Keys**: Created keys are only shown once - save them!
2. **ACL Changes**: Always validate ACLs before applying
3. **Device Deletion**: Cannot be undone - be careful!
4. **Exit Nodes**: Device must advertise routes first
5. **Tags**: Must be prefixed with `tag:` (e.g., `tag:server`)

---

## 🔗 Related Documentation

- [Tailscale API Docs](https://tailscale.com/api)
- [ACL Syntax](https://tailscale.com/kb/1018/acls)
- [Exit Nodes](https://tailscale.com/kb/1103/exit-nodes)
- [Subnet Routers](https://tailscale.com/kb/1019/subnets)
