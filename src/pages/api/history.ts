import type { APIRoute } from 'astro';
import historyData from '../../../data/history.json';

const ADMIN_PASSWORD = '0566';

// In-memory cache for development (persists until server restart)
let memoryCache: any[] | null = null;

function verifyAuth(request: Request): boolean {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.slice(7);
    try {
        const decoded = atob(token);
        const [timestamp, password] = decoded.split(':');
        const tokenAge = Date.now() - parseInt(timestamp);
        return password === ADMIN_PASSWORD && tokenAge < 24 * 60 * 60 * 1000;
    } catch {
        return false;
    }
}

async function getKV(): Promise<KVNamespace | null> {
    try {
        const { env } = await import('cloudflare:workers');
        return (env as any).PORTFOLIO_DATA || null;
    } catch {
        return null;
    }
}

async function getData(kv: KVNamespace | null): Promise<any[]> {
    // Try KV first (production)
    if (kv) {
        try {
            const data = await kv.get('history');
            if (data) return JSON.parse(data);
        } catch {}
    }
    // Try in-memory cache (development)
    if (memoryCache !== null) {
        return [...memoryCache];
    }
    // Fallback to JSON file
    return [...historyData];
}

async function saveData(kv: KVNamespace | null, data: any[]): Promise<void> {
    if (kv) {
        await kv.put('history', JSON.stringify(data));
    }
    // Always update in-memory cache
    memoryCache = [...data];
}

export const GET: APIRoute = async () => {
    const kv = await getKV();
    const data = await getData(kv);
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST: APIRoute = async ({ request }) => {
    if (!verifyAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const kv = await getKV();
        const text = await request.text();
        const newItem = JSON.parse(text);
        const data = await getData(kv);
        data.unshift(newItem);
        await saveData(kv, data);
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Bad request', detail: e?.message }), {
            status: 400, headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const PUT: APIRoute = async ({ request }) => {
    if (!verifyAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const kv = await getKV();
        const text = await request.text();
        const { index, item } = JSON.parse(text);
        const data = await getData(kv);
        if (index < 0 || index >= data.length) {
            return new Response(JSON.stringify({ error: 'Index out of range' }), {
                status: 400, headers: { 'Content-Type': 'application/json' },
            });
        }
        data[index] = item;
        await saveData(kv, data);
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Bad request', detail: e?.message }), {
            status: 400, headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const DELETE: APIRoute = async ({ request }) => {
    if (!verifyAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const kv = await getKV();
        const text = await request.text();
        const { index } = JSON.parse(text);
        const data = await getData(kv);
        if (index < 0 || index >= data.length) {
            return new Response(JSON.stringify({ error: 'Index out of range' }), {
                status: 400, headers: { 'Content-Type': 'application/json' },
            });
        }
        data.splice(index, 1);
        await saveData(kv, data);
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Bad request', detail: e?.message }), {
            status: 400, headers: { 'Content-Type': 'application/json' },
        });
    }
};
