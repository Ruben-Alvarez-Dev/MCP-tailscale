/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Tailscale API Client
 * HTTP client for Tailscale API v2
 * ═══════════════════════════════════════════════════════════════════════════
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TailscaleClientConfig {
  apiKey: string;
  tailnet: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Device {
  id: string;
  name: string;
  hostname: string;
  os: string;
  addresses: string[];
  hostnameAliases?: string[];
  created: string;
  lastSeen: string;
  isExternal: boolean;
  authorized: boolean;
  user: {
    id: string;
    loginName: string;
    displayName: string;
  };
  tags?: string[];
  keyExpiryDisabled: boolean;
  blocksIncomingConnections: boolean;
  enabledRoutes?: string[];
  advertizedRoutes?: string[];
  clientVersion: string;
  updateAvailable: boolean;
  routing: {
    advertisedRoutes: string[];
    enabledRoutes: string[];
  };
  derp: string;
  exitNodeOption: boolean;
  exitNode: boolean;
  online: boolean;
}

export interface ApiKey {
  id: string;
  description: string;
  created: string;
  expires: string;
  invalid: boolean;
}

export interface CreateKeyRequest {
  description: string;
  expirySeconds?: number;
  capabilities?: {
    devices?: {
      create?: {
        reusable?: boolean;
        ephemeral?: boolean;
        preauthorized?: boolean;
        tags?: string[];
      };
    };
  };
}

export interface DnsNameservers {
  dns: string[];
}

export interface DnsPreferences {
  magicDns: boolean;
}

export interface SearchPaths {
  searchPaths: string[];
}

export interface AclPolicy {
  groups?: Record<string, string[]>;
  acls?: Array<{
    action: string;
    src: string[];
    dst: string[];
  }>;
  tagOwners?: Record<string, string[]>;
  tests?: Array<{
    src: string;
    accept?: string[];
    deny?: string[];
  }>;
  [key: string]: unknown;
}

export interface User {
  id: string;
  loginName: string;
  displayName: string;
  profilePicUrl?: string;
  created: string;
  lastSeen?: string;
  status: string;
  type: string;
}

export interface TailnetInfo {
  name: string;
  domain: string;
  created: string;
  expiry: string;
  adminKey?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Error Class
// ─────────────────────────────────────────────────────────────────────────────

export class TailscaleApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'TailscaleApiError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tailscale Client
// ─────────────────────────────────────────────────────────────────────────────

export class TailscaleClient {
  private client: AxiosInstance;
  private _tailnet: string;

  constructor(config: TailscaleClientConfig) {
    this._tailnet = config.tailnet;
    
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.tailscale.com',
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          throw new TailscaleApiError(
            `Tailscale API Error: ${error.response.status} ${error.response.statusText}`,
            error.response.status,
            error.response.data
          );
        }
        throw error;
      }
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // DEVICES API
  // ═════════════════════════════════════════════════════════════════════════

  devices = {
    list: async (): Promise<Device[]> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/devices`);
      return response.data.devices || [];
    },

    get: async (deviceId: string): Promise<Device> => {
      const response = await this.client.get(`/api/v2/device/${deviceId}`);
      return response.data;
    },

    authorize: async (deviceId: string, authorized: boolean = true): Promise<void> => {
      await this.client.post(
        `/api/v2/tailnet/${this._tailnet}/devices/${deviceId}/authorized`,
        { authorized }
      );
    },

    delete: async (deviceId: string): Promise<void> => {
      await this.client.delete(`/api/v2/tailnet/${this._tailnet}/devices/${deviceId}`);
    },

    setTags: async (deviceId: string, tags: string[]): Promise<void> => {
      await this.client.post(
        `/api/v2/tailnet/${this._tailnet}/devices/${deviceId}/tags`,
        { tags }
      );
    },
  };

  // ═════════════════════════════════════════════════════════════════════════
  // API KEYS API
  // ═════════════════════════════════════════════════════════════════════════

  keys = {
    list: async (): Promise<ApiKey[]> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/keys`);
      return response.data.keys || [];
    },

    create: async (request: CreateKeyRequest): Promise<{ id: string; key: string }> => {
      const response = await this.client.post(
        `/api/v2/tailnet/${this._tailnet}/keys`,
        request
      );
      return response.data;
    },

    delete: async (keyId: string): Promise<void> => {
      await this.client.delete(`/api/v2/tailnet/${this._tailnet}/keys/${keyId}`);
    },
  };

  // ═════════════════════════════════════════════════════════════════════════
  // DNS API
  // ═════════════════════════════════════════════════════════════════════════

  dns = {
    getNameservers: async (): Promise<DnsNameservers> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/dns/nameservers`);
      return response.data;
    },

    setNameservers: async (nameservers: string[]): Promise<DnsNameservers> => {
      const response = await this.client.post(
        `/api/v2/tailnet/${this._tailnet}/dns/nameservers`,
        { dns: nameservers }
      );
      return response.data;
    },

    getPreferences: async (): Promise<DnsPreferences> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/dns/preferences`);
      return response.data;
    },

    setPreferences: async (magicDns: boolean): Promise<DnsPreferences> => {
      const response = await this.client.post(
        `/api/v2/tailnet/${this._tailnet}/dns/preferences`,
        { magicDns }
      );
      return response.data;
    },

    getSearchPaths: async (): Promise<SearchPaths> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/dns/searchpaths`);
      return response.data;
    },

    setSearchPaths: async (searchPaths: string[]): Promise<SearchPaths> => {
      const response = await this.client.post(
        `/api/v2/tailnet/${this._tailnet}/dns/searchpaths`,
        { searchPaths }
      );
      return response.data;
    },
  };

  // ═════════════════════════════════════════════════════════════════════════
  // ACL API
  // ═════════════════════════════════════════════════════════════════════════

  acl = {
    get: async (): Promise<AclPolicy> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/acl`);
      return response.data;
    },

    set: async (policy: AclPolicy): Promise<void> => {
      await this.client.post(`/api/v2/tailnet/${this._tailnet}/acl`, policy);
    },

    validate: async (policy: AclPolicy): Promise<{ valid: boolean; message?: string }> => {
      try {
        await this.client.post(`/api/v2/tailnet/${this._tailnet}/acl/validate`, policy);
        return { valid: true };
      } catch (error) {
        if (error instanceof TailscaleApiError) {
          return { valid: false, message: error.message };
        }
        throw error;
      }
    },
  };

  // ═════════════════════════════════════════════════════════════════════════
  // ROUTES API
  // ═════════════════════════════════════════════════════════════════════════

  routes = {
    list: async (deviceId: string): Promise<{ routes: string[] }> => {
      const response = await this.client.get(`/api/v2/device/${deviceId}/routes`);
      return response.data;
    },

    set: async (deviceId: string, routes: string[]): Promise<void> => {
      await this.client.post(`/api/v2/device/${deviceId}/routes`, { routes });
    },

    setExitNode: async (deviceId: string, enabled: boolean): Promise<void> => {
      const device = await this.devices.get(deviceId);
      const currentRoutes = device.advertizedRoutes || [];
      const routes = enabled
        ? [...currentRoutes, '0.0.0.0/0', '::/0']
        : currentRoutes.filter((r: string) => r !== '0.0.0.0/0' && r !== '::/0');
      
      await this.client.post(`/api/v2/device/${deviceId}/routes`, { routes });
    },
  };

  // ═════════════════════════════════════════════════════════════════════════
  // USERS & TAILNET API
  // ═════════════════════════════════════════════════════════════════════════

  users = {
    list: async (): Promise<User[]> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/members`);
      return response.data.members || [];
    },

    get: async (userId: string): Promise<User> => {
      const users = await this.users.list();
      const user = users.find((u) => u.id === userId);
      if (!user) {
        throw new TailscaleApiError(`User not found: ${userId}`, 404);
      }
      return user;
    },

    delete: async (userId: string): Promise<void> => {
      await this.client.delete(`/api/v2/tailnet/${this._tailnet}/members/${userId}`);
    },
  };

  tailnetApi = {
    get: async (): Promise<TailnetInfo> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}`);
      return response.data;
    },

    getSettings: async (): Promise<Record<string, unknown>> => {
      const response = await this.client.get(`/api/v2/tailnet/${this._tailnet}/settings`);
      return response.data;
    },
  };
}
