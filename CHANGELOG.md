# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-02-17

### Added
- Initial release of MCP Tailscale Server
- 25 MCP tools for complete Tailscale network management

#### Device Management (5 tools)
- `tailscale_list_devices` - List all devices in tailnet
- `tailscale_get_device` - Get device details by ID
- `tailscale_authorize_device` - Authorize/deauthorize devices
- `tailscale_delete_device` - Delete devices from network
- `tailscale_set_device_tags` - Set ACL tags on devices

#### API Keys (3 tools)
- `tailscale_list_keys` - List all API keys
- `tailscale_create_key` - Create new API keys with capabilities
- `tailscale_delete_key` - Delete API keys

#### DNS Configuration (6 tools)
- `tailscale_get_dns_nameservers` - Get configured nameservers
- `tailscale_set_dns_nameservers` - Set custom nameservers
- `tailscale_get_dns_preferences` - Get MagicDNS status
- `tailscale_set_dns_preferences` - Enable/disable MagicDNS
- `tailscale_get_search_paths` - Get DNS search paths
- `tailscale_set_search_paths` - Set search domains

#### ACL Policies (3 tools)
- `tailscale_get_acl` - Get current ACL policy
- `tailscale_set_acl` - Update ACL policy (with validation)
- `tailscale_validate_acl` - Validate ACL without applying

#### Routes & Exit Nodes (3 tools)
- `tailscale_list_routes` - List routes advertised by device
- `tailscale_set_routes` - Enable subnet routes
- `tailscale_set_exit_node` - Configure exit node

#### Users & Tailnet (5 tools)
- `tailscale_list_users` - List all tailnet members
- `tailscale_get_user` - Get user details
- `tailscale_delete_user` - Remove user from tailnet
- `tailscale_get_tailnet` - Get tailnet information
- `tailscale_get_tailnet_settings` - Get tailnet settings

### Technical Details
- Built with TypeScript and Zod validation
- MCP SDK with stdio transport
- Full Tailscale API v2 coverage
- IPv4 and IPv6 support
- Comprehensive error handling with McpError

### Documentation
- Complete API reference
- Practical usage examples
- Installation guide
- MIT License
