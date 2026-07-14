import type { APIRoute } from 'astro';
import { createAdminToken, verifyAdminPassword, verifyAdminRequest } from '../../utils/adminAuth';

export const GET: APIRoute = async ({ request }) => {
    if (await verifyAdminRequest(request)) {
        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
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

        if (!(await verifyAdminPassword(password))) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const token = await createAdminToken();

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
