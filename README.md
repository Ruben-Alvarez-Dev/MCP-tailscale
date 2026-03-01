# 🦎 Tailscale MCP Server

> Model Context Protocol (MCP) server para Tailscale API - Gestión completa de red

[![npm version](https://badge.fury.io/js/@jartos%2Fmcp-tailscale.svg)](https://badge.fury.io/js/@jartos/mcp-tailscale)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Herramientas Disponibles](#-herramientas-disponibles)
- [Uso con Claude Desktop](#-uso-con-claude-desktop)
- [Uso con Goose](#-uso-con-goose)
- [Uso Programático](#-uso-programático)
- [Desarrollo](#-desarrollo)
- [API Reference](#-api-reference)
- [Licencia](#-licencia)

## ✨ Características

- ✅ **Gestión completa de dispositivos** - Listar, autorizar, eliminar dispositivos
- ✅ **Control de ACLs** - Ver y actualizar políticas de acceso
- ✅ **Gestión de DNS** - Configurar Nameservers y Search Paths
- ✅ **API Keys** - Crear y gestionar claves de acceso
- ✅ **Routes & Subnet Routers** - Gestionar rutas de red
- ✅ **Users & Tailnet** - Información de usuarios y red
- ✅ **Exit Nodes** - Configurar nodos de salida
- ✅ **100% TypeScript** - Tipado completo con Zod validation
- ✅ **Stdio Transport** - Compatible con Claude Desktop, Goose, y otros clientes MCP

## 📦 Requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Cuenta de Tailscale** con acceso a la API
- **API Key** de Tailscale ([obtener aquí](https://login.tailscale.com/admin/settings/keys))

## 🚀 Instalación

### Opción 1: NPM (Recomendado)

```bash
npm install -g @jartos/mcp-tailscale
```

### Opción 2: Desde el código fuente

```bash
git clone https://github.com/jartos/mcp-tailscale.git
cd mcp-tailscale
npm install
npm run build
npm link
```

### Opción 3: NPX (Sin instalación)

```bash
npx @jartos/mcp-tailscale
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` o configura las variables de entorno:

```bash
# OBLIGATORIO
TAILSCALE_API_KEY=tskey-api-xxxxxxxxxxxxx
TAILSCALE_TAILNET=your-email@example.com

# OPCIONAL
TAILSCALE_API_URL=https://api.tailscale.com
TAILSCALE_TIMEOUT=30000
LOG_LEVEL=info
```

### Obtener Credenciales

1. Ve a [Tailscale Admin Console](https://login.tailscale.com/admin/settings/keys)
2. Crea una nueva API Key
3. Copia el `TAILSCALE_TAILNET` de tu [admin console](https://login.tailscale.com/admin/settings/general)

## 🔧 Herramientas Disponibles

### 📱 Dispositivos

| Herramienta | Descripción |
|-------------|-------------|
| `tailscale_list_devices` | Listar todos los dispositivos de la red |
| `tailscale_get_device` | Obtener detalles de un dispositivo específico |
| `tailscale_authorize_device` | Autorizar un dispositivo pendiente |
| `tailscale_delete_device` | Eliminar un dispositivo de la red |
| `tailscale_set_device_tags` | Asignar tags a un dispositivo |

### 🔑 API Keys

| Herramienta | Descripción |
|-------------|-------------|
| `tailscale_list_keys` | Listar todas las API keys |
| `tailscale_create_key` | Crear una nueva API key |
| `tailscale_delete_key` | Eliminar una API key |

### 🌐 DNS

| Herramienta | Descripción |
|-------------|-------------|
| `tailscale_get_dns_nameservers` | Obtener Nameservers configurados |
| `tailscale_set_dns_nameservers` | Configurar Nameservers |
| `tailscale_get_dns_preferences` | Obtener preferencias DNS |
| `tailscale_set_dns_preferences` | Configurar preferencias DNS |
| `tailscale_get_search_paths` | Obtener Search Paths |
| `tailscale_set_search_paths` | Configurar Search Paths |

### 🛡️ ACLs

| Herramienta | Descripción |
|-------------|-------------|
| `tailscale_get_acl` | Obtener política ACL actual |
| `tailscale_set_acl` | Actualizar política ACL |
| `tailscale_validate_acl` | Validar política ACL |

### 🚦 Routes & Exit Nodes

| Herramienta | Descripción |
|-------------|-------------|
| `tailscale_list_routes` | Listar rutas de un dispositivo |
| `tailscale_set_routes` | Configurar rutas anunciadas |
| `tailscale_set_exit_node` | Configurar dispositivo como Exit Node |

### 👥 Users & Tailnet

| Herramienta | Descripción |
|-------------|-------------|
| `tailscale_get_tailnet` | Obtener información del Tailnet |
| `tailscale_get_user` | Obtener información de usuario |
| `tailscale_list_users` | Listar usuarios del Tailnet |

## 🖥️ Uso con Claude Desktop

Añade a tu archivo de configuración de Claude Desktop:

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

### Con instalación global

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "mcp-tailscale",
      "env": {
        "TAILSCALE_API_KEY": "tskey-api-xxxxxxxxxxxxx",
        "TAILSCALE_TAILNET": "your-email@example.com"
      }
    }
  }
}
```

## 🪿 Uso con Goose

Añade a tu configuración de Goose (`~/.config/goose/config.yaml`):

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

O con el CLI de Goose:

```bash
goose extension add mcp-tailscale --command "npx -y @jartos/mcp-tailscale" \
  --env TAILSCALE_API_KEY=tskey-api-xxxxxxxxxxxxx \
  --env TAILSCALE_TAILNET=your-email@example.com
```

## 📚 Uso Programático

```typescript
import { TailscaleMCPServer } from '@jartos/mcp-tailscale';

const server = new TailscaleMCPServer({
  apiKey: 'tskey-api-xxxxxxxxxxxxx',
  tailnet: 'your-email@example.com',
});

// Iniciar el servidor
await server.start();
```

### Cliente Directo (sin MCP)

```typescript
import { TailscaleClient } from '@jartos/mcp-tailscale';

const client = new TailscaleClient({
  apiKey: 'tskey-api-xxxxxxxxxxxxx',
  tailnet: 'your-email@example.com',
});

// Listar dispositivos
const devices = await client.devices.list();

// Autorizar dispositivo
await client.devices.authorize('device-id');

// Configurar DNS
await client.dns.setNameservers(['1.1.1.1', '8.8.8.8']);
```

## 🛠️ Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/jartos/mcp-tailscale.git
cd mcp-tailscale

# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Compilar
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint

# Limpiar build
npm run clean
```

### Estructura del Proyecto

```
MCP-tailscale/
├── src/
│   ├── index.ts           # Entrada principal del servidor MCP
│   ├── client.ts          # Cliente API de Tailscale
│   ├── tools/             # Definición de herramientas MCP
│   │   ├── devices.ts     # Gestión de dispositivos
│   │   ├── keys.ts        # Gestión de API keys
│   │   ├── dns.ts         # Configuración DNS
│   │   ├── acl.ts         # Políticas ACL
│   │   ├── routes.ts      # Rutas y Exit Nodes
│   │   └── users.ts       # Usuarios y Tailnet
│   ├── types.ts           # Tipos TypeScript
│   └── utils.ts           # Utilidades
├── docs/
│   ├── API.md             # Documentación de la API
│   └── EXAMPLES.md        # Ejemplos de uso
├── tests/                 # Tests unitarios
├── dist/                  # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

## 📖 API Reference

Ver [docs/API.md](./docs/API.md) para documentación completa de la API.

### Ejemplos de Uso

Ver [docs/EXAMPLES.md](./docs/EXAMPLES.md) para ejemplos detallados.

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para historial de cambios.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces

- [Tailscale API Documentation](https://tailscale.com/api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai)
- [Goose](https://github.com/block/goose)

## ⚠️ Aviso Legal

Este proyecto no está afiliado, asociado, autorizado, respaldado por, o de ninguna manera oficialmente conectado con Tailscale Inc., o cualquiera de sus subsidiarias o afiliadas.

---

Hecho con ❤️ por el equipo de JartOS
