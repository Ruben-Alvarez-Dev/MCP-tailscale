# MCP Tailscale

> Model Context Protocol (MCP) server for Tailscale API - Complete network management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

## Features

- **25 MCP Tools** for complete Tailscale management
- **Device Management** - List, authorize, delete, tag devices
- **API Keys** - Create and manage access keys
- **DNS Configuration** - Nameservers, MagicDNS, search paths
- **ACL Policies** - Get, set, validate access control
- **Routes & Exit Nodes** - Subnet routing configuration
- **Users & Tailnet** - Member and network management
- **100% TypeScript** - Full type safety with Zod validation
- **Stdio Transport** - Compatible with Claude Desktop, Goose, etc.

## Requirements

- Node.js >= 18.0.0
- Tailscale account with API access
- API Key from [Tailscale Admin](https://login.tailscale.com/admin/settings/keys)

## Installation

### NPX (Recommended)

```bash
npx mcp-tailscale
```

### Global Install

```bash
npm install -g mcp-tailscale
mcp-tailscale
```

### From Source

```bash
git clone https://github.com/Ruben-Alvarez-Dev/MCP-tailscale.git
cd MCP-tailscale
npm install
npm run build
npm link
```

## Configuration

Create a `.env` file or set environment variables:

```bash
# Required
TAILSCALE_API_KEY=tskey-api-xxxxxxxxxxxxx
TAILSCALE_TAILNET=your-email@example.com

# Optional
TAILSCALE_API_URL=https://api.tailscale.com
TAILSCALE_TIMEOUT=30000
LOG_LEVEL=info
```

## Usage with Claude Desktop

Add to your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "npx",
      "args": ["mcp-tailscale"],
      "env": {
        "TAILSCALE_API_KEY": "tskey-api-xxxxxxxxxxxxx",
        "TAILSCALE_TAILNET": "your-email@example.com"
      }
    }
  }
}
```

## Usage with Goose

Add to `~/.config/goose/config.yaml`:

```yaml
extensions:
  mcp-tailscale:
    enabled: true
    type: stdio
    name: mcp-tailscale
    description: Tailscale MCP Server - Network management (25 tools)
    cmd: npx
    args:
      - mcp-tailscale
    env:
      TAILSCALE_API_KEY: tskey-api-xxxxxxxxxxxxx
      TAILSCALE_TAILNET: your-email@example.com
    timeout: 60
```

## Available Tools

### Devices (5 tools)
| Tool | Description |
|------|-------------|
| `tailscale_list_devices` | List all devices in tailnet |
| `tailscale_get_device` | Get device details by ID |
| `tailscale_authorize_device` | Authorize/deauthorize device |
| `tailscale_delete_device` | Delete device from network |
| `tailscale_set_device_tags` | Set ACL tags on device |

### API Keys (3 tools)
| Tool | Description |
|------|-------------|
| `tailscale_list_keys` | List all API keys |
| `tailscale_create_key` | Create new API key |
| `tailscale_delete_key` | Delete API key |

### DNS (6 tools)
| Tool | Description |
|------|-------------|
| `tailscale_get_dns_nameservers` | Get configured nameservers |
| `tailscale_set_dns_nameservers` | Set custom nameservers |
| `tailscale_get_dns_preferences` | Get MagicDNS status |
| `tailscale_set_dns_preferences` | Enable/disable MagicDNS |
| `tailscale_get_search_paths` | Get DNS search paths |
| `tailscale_set_search_paths` | Set search domains |

### ACLs (3 tools)
| Tool | Description |
|------|-------------|
| `tailscale_get_acl` | Get current ACL policy |
| `tailscale_set_acl` | Update ACL policy |
| `tailscale_validate_acl` | Validate ACL without applying |

### Routes & Exit Nodes (3 tools)
| Tool | Description |
|------|-------------|
| `tailscale_list_routes` | List device routes |
| `tailscale_set_routes` | Enable subnet routes |
| `tailscale_set_exit_node` | Configure exit node |

### Users & Tailnet (5 tools)
| Tool | Description |
|------|-------------|
| `tailscale_list_users` | List all users |
| `tailscale_get_user` | Get user details |
| `tailscale_delete_user` | Remove user |
| `tailscale_get_tailnet` | Get tailnet info |
| `tailscale_get_tailnet_settings` | Get tailnet settings |

## Documentation

- [API Reference](./docs/API.md) - Complete tool documentation
- [Examples](./docs/EXAMPLES.md) - Usage examples
- [Installation Guide](./docs/INSTALLATION.md) - Detailed setup

## Development

```bash
npm install     # Install dependencies
npm run build   # Compile TypeScript
npm run dev     # Development mode
npm test        # Run tests
npm run lint    # Lint code
```

## Project Structure

```
MCP-tailscale/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── client.ts         # Tailscale API client
│   └── tools/            # Tool implementations
│       ├── devices.ts    # Device tools
│       ├── keys.ts       # API key tools
│       ├── dns.ts        # DNS tools
│       ├── acl.ts        # ACL tools
│       ├── routes.ts     # Route tools
│       └── users.ts      # User tools
├── docs/                 # Documentation
├── dist/                 # Compiled code
├── package.json
└── README.md
```

## License

MIT License - See [LICENSE](LICENSE) for details.

## Links

- [Tailscale API Documentation](https://tailscale.com/api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai)

## Disclaimer

This project is not affiliated with Tailscale Inc.

---

Made by [Ruben-Alvarez-Dev](https://github.com/Ruben-Alvarez-Dev)
