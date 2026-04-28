import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
    const { name } = params;
    if (!name) {
        return new Response('Not Found', { status: 404 });
    }

    try {
        const { env } = await import('cloudflare:workers');
        const kv = (env as any).PORTFOLIO_DATA;

        if (!kv) {
            return new Response('KV Binding Not Found', { status: 500 });
        }

        const key = `img:${name}`;
        const { value, metadata } = await kv.getWithMetadata(key, { type: 'arrayBuffer' });

        if (!value) {
            return new Response('Image Not Found', { status: 404 });
        }

        const contentType = (metadata as any)?.contentType || 'image/png';

        return new Response(value, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            },
        });
    } catch (e: any) {
        return new Response(`Error: ${e.message}`, { status: 500 });
    }
};
