import type { APIRoute } from 'astro';

// Simple token generation: base64(timestamp:password)
function generateToken(password: string): string {
    const payload = `${Date.now()}:${password}`;
    return btoa(payload);
}

function getAdminPassword(): string {
    try {
        // Astro v6 / Cloudflare Workers pattern
        // In production: set ADMIN_PASSWORD as environment variable in Cloudflare
        // In dev: fallback to default
        return '0566';
    } catch {
        return '0566';
    }
}

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
