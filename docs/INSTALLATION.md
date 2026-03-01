# ═══════════════════════════════════════════════════════════════════════════
# Tailscale MCP Server - Installation Guide
# ═══════════════════════════════════════════════════════════════════════════

## 📋 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Tailscale API Key ([get one here](https://login.tailscale.com/admin/settings/keys))
- Your Tailnet name (usually your email or organization name)

---

## 🚀 Installation Methods

### Method 1: NPX (Recommended - No Installation)

```bash
# Run directly without installing
npx @jartos/mcp-tailscale

# Or with environment variables
TAILSCALE_API_KEY=tskey-api-xxx TAILSCALE_TAILNET=user@example.com npx @jartos/mcp-tailscale
```

---

### Method 2: Global NPM Installation

```bash
# Install globally
npm install -g @jartos/mcp-tailscale

# Run
TAILSCALE_API_KEY=tskey-api-xxx TAILSCALE_TAILNET=user@example.com mcp-tailscale
```

---

### Method 3: From Source

```bash
# Clone repository
git clone https://github.com/jartos/mcp-tailscale.git
cd mcp-tailscale

# Install dependencies
npm install

# Build
npm run build

# Run
TAILSCALE_API_KEY=tskey-api-xxx TAILSCALE_TAILNET=user@example.com npm start

# Or link globally
npm link
mcp-tailscale
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TAILSCALE_API_KEY` | ✅ Yes | Your Tailscale API key |
| `TAILSCALE_TAILNET` | ✅ Yes | Your tailnet name (e.g., user@example.com) |
| `TAILSCALE_API_URL` | No | API base URL (default: https://api.tailscale.com) |
| `TAILSCALE_TIMEOUT` | No | Request timeout in ms (default: 30000) |
| `LOG_LEVEL` | No | Logging level: debug, info, warn, error (default: info) |

### Configuration Files

#### Option A: .env file

Create `.env` in the working directory:

```bash
TAILSCALE_API_KEY=tskey-api-xxxxxxxxxxxxx
TAILSCALE_TAILNET=your-email@example.com
```

#### Option B: Environment variables

```bash
export TAILSCALE_API_KEY=tskey-api-xxxxxxxxxxxxx
export TAILSCALE_TAILNET=your-email@example.com
```

#### Option C: Pass directly

```bash
TAILSCALE_API_KEY=xxx TAILSCALE_TAILNET=user@example.com npx @jartos/mcp-tailscale
```

---

## 🔌 Client Configuration

### Claude Desktop

Edit your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "npx",
      "args": ["-y", "@jartos/mcp-tailscale"],
      "env": {
        "TAILSCALE_API_KEY": "tskey-api-xxxxxxxxxxxxx",
        "TAILSCALE_TAILNET": "your-email@example.com"
      }
    }
  }
}
```

After editing, restart Claude Desktop.

---

### Goose

Add to `~/.config/goose/config.yaml`:

```yaml
extensions:
  mcp-tailscale:
    command: npx
    args:
      - "-y"
      - "@jartos/mcp-tailscale"
    env:
      TAILSCALE_API_KEY: tskey-api-xxxxxxxxxxxxx
      TAILSCALE_TAILNET: your-email@example.com
```

Or use the CLI:

```bash
goose extension add mcp-tailscale \
  --command "npx -y @jartos/mcp-tailscale" \
  --env TAILSCALE_API_KEY=tskey-api-xxxxxxxxxxxxx \
  --env TAILSCALE_TAILNET=your-email@example.com
```

---

### Cursor / Windsurf / Other MCP Clients

Most MCP clients use a similar configuration format:

```json
{
  "mcp": {
    "servers": {
      "tailscale": {
        "command": "npx",
        "args": ["-y", "@jartos/mcp-tailscale"],
        "env": {
          "TAILSCALE_API_KEY": "tskey-api-xxxxxxxxxxxxx",
          "TAILSCALE_TAILNET": "your-email@example.com"
        }
      }
    }
  }
}
```

---

## ✅ Verification

After configuration, test with your LLM:

```
List all devices in my Tailscale network
```

If configured correctly, the LLM will call the MCP server and show your devices.

---

## 🐛 Troubleshooting

### Error: "TAILSCALE_API_KEY is required"

**Solution**: Set the `TAILSCALE_API_KEY` environment variable or add it to your client config.

---

### Error: "Unauthorized (401)"

**Solutions**:
1. Verify your API key is correct
2. Check if the API key has expired
3. Generate a new API key from the admin console

---

### Error: "Tailnet not found"

**Solutions**:
1. Verify `TAILSCALE_TAILNET` is correct (usually your email)
2. Check in the admin console: https://login.tailscale.com/admin/settings/general

---

### Tools not appearing in Claude/Goose

**Solutions**:
1. Restart the client after configuration
2. Check the config file syntax is valid JSON
3. Check client logs for MCP server errors
4. Try running the server manually to see error output:
   ```bash
   npx @jartos/mcp-tailscale
   ```

---

### Rate limiting errors

**Solution**: Tailscale API has rate limits. Wait a minute and try again. Consider upgrading your plan for higher limits.

---

## 🔒 Security Best Practices

1. **API Key Storage**: Store API keys securely, never commit to git
2. **Least Privilege**: Create API keys with minimal required permissions
3. **Key Rotation**: Rotate API keys periodically
4. **Environment Variables**: Use environment variables, not hardcoded values
5. **Access Control**: Use ACLs to restrict what the MCP can do

---

## 📊 Getting Your Credentials

### API Key

1. Go to https://login.tailscale.com/admin/settings/keys
2. Click "Generate API key"
3. Add a description (e.g., "MCP Server")
4. Set expiration as needed
5. Copy the key immediately (shown only once!)

### Tailnet Name

1. Go to https://login.tailscale.com/admin/settings/general
2. Look for "Tailnet name" or your organization name
3. Usually format: `user@example.com` or `organization-name`

---

## 🆘 Support

- **Issues**: https://github.com/jartos/mcp-tailscale/issues
- **Tailscale API Docs**: https://tailscale.com/api
- **MCP Documentation**: https://modelcontextprotocol.io

---

## 📝 License

MIT License - See LICENSE file for details.
