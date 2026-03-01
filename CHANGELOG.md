# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-02

### Added

#### Initial Release

- **Full MCP Server Implementation**
  - Stdio transport for Claude Desktop, Goose, and other MCP clients
  - TypeScript with full type definitions
  - Zod schema validation for all inputs

#### Device Management (5 tools)
- `tailscale_list_devices` - List all devices in tailnet
- `tailscale_get_device` - Get device details
- `tailscale_authorize_device` - Authorize/deauthorize devices
- `tailscale_delete_device` - Delete devices from network
- `tailscale_set_device_tags` - Set ACL tags on devices

#### API Key Management (3 tools)
- `tailscale_list_keys` - List all API keys
- `tailscale_create_key` - Create new API keys with capabilities
- `tailscale_delete_key` - Delete API keys

#### DNS Configuration (6 tools)
- `tailscale_get_dns_nameservers` - Get DNS servers
- `tailscale_set_dns_nameservers` - Set DNS servers
- `tailscale_get_dns_preferences` - Get MagicDNS status
- `tailscale_set_dns_preferences` - Enable/disable MagicDNS
- `tailscale_get_search_paths` - Get search paths
- `tailscale_set_search_paths` - Set search paths

#### ACL Management (3 tools)
- `tailscale_get_acl` - Get current ACL policy
- `tailscale_set_acl` - Update ACL policy
- `tailscale_validate_acl` - Validate ACL before applying

#### Routes & Exit Nodes (3 tools)
- `tailscale_list_routes` - List device routes
- `tailscale_set_routes` - Enable subnet routes
- `tailscale_set_exit_node` - Configure exit nodes

#### Users & Tailnet (5 tools)
- `tailscale_list_users` - List all users
- `tailscale_get_user` - Get user details
- `tailscale_delete_user` - Remove users
- `tailscale_get_tailnet` - Get tailnet info
- `tailscale_get_tailnet_settings` - Get tailnet settings

#### Documentation
- Complete README with installation instructions
- API.md with full tool reference
- EXAMPLES.md with usage examples
- INSTALLATION.md with client-specific guides

#### Developer Experience
- Full TypeScript support
- Source maps for debugging
- ESLint configuration
- Jest test setup
- Comprehensive error handling
- Environment variable configuration

### Security
- API key validation
- Input sanitization with Zod
- No sensitive data logging
- Secure environment variable handling

---

## Future Plans

### [1.1.0] - Planned

- Add support for Tailscale SSH features
- Add policy file validation with detailed error messages
- Add batch operations for devices
- Add webhook support for events
- Add caching layer for frequent queries

### [1.2.0] - Planned

- Support for Tailscale Funnel
- Support for Tailscale Serve
- Integration with Tailscale ACL testing
- Metrics and monitoring tools

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-03-02 | Initial release with full API coverage |
