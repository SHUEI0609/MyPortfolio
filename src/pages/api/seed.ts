import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import historyData from '../../../data/history.json';
import skillsData from '../../../data/skills.json';
import projectsData from '../../../data/projects.json';
import topicsData from '../../../data/topics.json';
import mindmapData from '../../../data/mindmap.json';
import aboutData from '../../../data/about.json';
import { verifyAdminRequest } from '../../utils/adminAuth';

export const POST: APIRoute = async ({ request }) => {
    if (!(await verifyAdminRequest(request))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const kv = env.PORTFOLIO_DATA;
        if (!kv) {
            return new Response(JSON.stringify({ error: 'KV not available' }), {
                status: 500, headers: { 'Content-Type': 'application/json' },
            });
        }

        await kv.put('history', JSON.stringify(historyData));
        await kv.put('skills', JSON.stringify(skillsData));
        await kv.put('projects', JSON.stringify(projectsData));
        await kv.put('topics', JSON.stringify(topicsData));
        await kv.put('mindmap', JSON.stringify(mindmapData));
        await kv.put('about', JSON.stringify(aboutData));

        return new Response(JSON.stringify({ message: 'Seed completed successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Seed failed', detail: e?.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
        });
    }
};
