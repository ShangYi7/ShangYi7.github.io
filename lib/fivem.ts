import 'server-only';

export interface ServerConfig {
  name: string;
  id: string; // FiveM servers-frontend identifier (cfx id or endpoint)
  color?: string;
}

export interface PlayerSnapshot {
  players: number;
  maxPlayers?: number;
  lastUpdated: string;
  raw?: any;
}

// Fallback demo servers; replace with real IDs via NEXT_PUBLIC_FIVEM_SERVERS
const defaultServers: ServerConfig[] = [
  { name: '第七席', id: '6e9ro6', color: '#3b82f6' },
  { name: 'Eoxgen', id: 'polpm5', color: '#ef4444' },
  { name: '示例伺服器 C', id: 'example_c', color: '#10b981' },
];

export function getServerConfigs(): ServerConfig[] {
  const env = process.env.NEXT_PUBLIC_FIVEM_SERVERS;
  if (!env) return defaultServers;
  try {
    const parsed = JSON.parse(env);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }
    // Support object map format { name: id }
    return Object.entries(parsed).map(([name, id]) => ({ name, id: String(id) }));
  } catch (e) {
    console.warn('Failed to parse NEXT_PUBLIC_FIVEM_SERVERS, using defaults', e);
    return defaultServers;
  }
}

// Attempts to fetch players for a server id from FiveM public API
export async function fetchServerPlayers(id: string): Promise<PlayerSnapshot | null> {
  try {
    const url = `https://servers-frontend.fivem.net/api/servers/single/${encodeURIComponent(id)}`;
    const res = await fetch(url, {
      // Hint revalidation when used from server components/routes
      next: { revalidate: 60 },
      headers: {
        'accept': 'application/json',
      },
    });
    if (!res.ok) {
      return {
        players: 0,
        lastUpdated: new Date().toISOString(),
        raw: { status: res.status, statusText: res.statusText },
      };
    }
    const json = await res.json();
    // The FiveM API structure can vary; normalize common fields
    const payload: any = (json && (json.Data || json.data || json)) ?? {};
    const players =
      payload.clients ?? payload.players ?? payload.PlayerCount ?? payload.playersCount ?? 0;
    const maxPlayers =
      payload.sv_maxclients ?? payload.maxClients ?? payload.maxPlayers ?? payload.MaxPlayers;
    return {
      players: typeof players === 'number' ? players : Number(players) || 0,
      maxPlayers: typeof maxPlayers === 'number' ? maxPlayers : Number(maxPlayers) || undefined,
      lastUpdated: new Date().toISOString(),
      raw: json,
    };
  } catch (error) {
    console.warn('fetchServerPlayers error', error);
    return {
      players: 0,
      lastUpdated: new Date().toISOString(),
      raw: { error: String(error) },
    };
  }
}