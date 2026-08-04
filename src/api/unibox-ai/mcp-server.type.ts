import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

/** Safe metadata for one tenant-owned MCP server. Credential values are never part of this type. */
export interface McpServer {
    id: UUID;
    key: string;
    name: string;
    url: string;
    allowedTools: string[];
    hasCredentials: boolean;
    isActive: boolean;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/mcp-servers`. */
export type McpServersPage = Paginated<McpServer>;

/** `POST /api/v1/mcp-servers`. */
export interface CreateMcpServerBody {
    key: string;
    name: string;
    url: string;
    allowedTools: string[];
    credentials?: Record<string, string>;
}

/** `PATCH /api/v1/mcp-servers/:id`. Omit credentials to keep them; `null` clears them. */
export interface UpdateMcpServerBody {
    name?: string;
    url?: string;
    allowedTools?: string[];
    credentials?: Nullable<Record<string, string>>;
    isActive?: boolean;
}
