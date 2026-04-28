import type { APIRoute } from 'astro';

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || '';

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

export const POST: APIRoute = async ({ request }) => {
    if (!verifyAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), {
                status: 400, headers: { 'Content-Type': 'application/json' },
            });
        }

        const { env } = await import('cloudflare:workers');
        const kv = (env as any).PORTFOLIO_DATA;
        
        // 生成されたファイル名（衝突回避のためタイムスタンプを付与）
        const fileName = `${Date.now()}-${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        
        // KVに保存（キー名に'img:'プレフィックスを付ける）
        await kv.put(`img:${fileName}`, arrayBuffer, {
            metadata: { contentType: file.type }
        });

        // 画像を表示するためのURLを返す
        const url = `/api/images/${fileName}`;
        return new Response(JSON.stringify({ url }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Upload failed', detail: e?.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
        });
    }
};
