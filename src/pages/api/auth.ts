import type { APIRoute } from 'astro';

// Simple token generation: base64(timestamp:password)
function generateToken(password: string): string {
    const payload = `${Date.now()}:${password}`;
    return btoa(payload);
}

function getAdminPassword(): string {
    return import.meta.env.ADMIN_PASSWORD || '';
}

export const GET: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const token = authHeader.slice(7);
    try {
        const decoded = atob(token);
        const colonIndex = decoded.indexOf(':');
        if (colonIndex === -1) throw new Error('invalid token');
        const timestamp = decoded.substring(0, colonIndex);
        const password = decoded.substring(colonIndex + 1);
        const tokenAge = Date.now() - parseInt(timestamp);
        const adminPassword = getAdminPassword();
        if (adminPassword && password === adminPassword && tokenAge < 24 * 60 * 60 * 1000) {
            return new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch {}
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const text = await request.text();
        const body = JSON.parse(text);
        const { password } = body;

        if (!password) {
            return new Response(JSON.stringify({ error: 'Password required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const adminPassword = getAdminPassword();

        if (password !== adminPassword) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const token = generateToken(adminPassword);

        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Bad request', detail: e?.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
