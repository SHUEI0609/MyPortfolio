import type { APIRoute } from 'astro';
import historyData from '../../../data/history.json';
import skillsData from '../../../data/skills.json';
import projectsData from '../../../data/projects.json';
import topicsData from '../../../data/topics.json';

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
        const { env } = await import('cloudflare:workers');
        const kv = (env as any).PORTFOLIO_DATA;
        if (!kv) {
            return new Response(JSON.stringify({ error: 'KV not available' }), {
                status: 500, headers: { 'Content-Type': 'application/json' },
            });
        }

        await kv.put('history', JSON.stringify(historyData));
        await kv.put('skills', JSON.stringify(skillsData));
        await kv.put('projects', JSON.stringify(projectsData));
        await kv.put('topics', JSON.stringify(topicsData));

        return new Response(JSON.stringify({ message: 'Seed completed successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Seed failed', detail: e?.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
        });
    }
};
