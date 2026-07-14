import type { APIRoute } from 'astro';
import topicsData from '../../../data/topics.json';
import { verifyAdminRequest } from '../../utils/adminAuth';

async function getKV(): Promise<KVNamespace | null> {
    try {
        const { env } = await import('cloudflare:workers');
        return (env as any).PORTFOLIO_DATA || null;
    } catch {
        return null;
    }
}

/**
 * KV が利用可能（本番）なら KV のみを参照。
 * KV が利用不可（ローカル開発）なら JSON ファイルを返す。
 */
async function getData(kv: KVNamespace | null): Promise<any[]> {
    if (kv) {
        try {
            const data = await kv.get('topics');
            if (data) return JSON.parse(data);
        } catch {}
        // KV は利用可能だがデータがない場合（初回未シード）は空配列
        return [];
    }
    // ローカル開発環境: JSON ファイルを使用
    return [...topicsData];
}

async function saveData(kv: KVNamespace | null, data: any[]): Promise<void> {
    if (kv) {
        await kv.put('topics', JSON.stringify(data));
    }
}

export const GET: APIRoute = async () => {
    const kv = await getKV();
    const data = await getData(kv);
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST: APIRoute = async ({ request }) => {
    if (!(await verifyAdminRequest(request))) {
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
    if (!(await verifyAdminRequest(request))) {
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
    if (!(await verifyAdminRequest(request))) {
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
