globalThis.process ??= {};
globalThis.process.env ??= {};
import { h as historyData } from "./history_cVNaS2H_.mjs";
import { s as skillsData } from "./skills_hDREXqGS.mjs";
import { p as projectsData } from "./projects_lnHvERnJ.mjs";
import { t as topicsData } from "./topics_B_oeesir.mjs";
const ADMIN_PASSWORD = "0566";
function verifyAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  try {
    const decoded = atob(token);
    const [timestamp, password] = decoded.split(":");
    const tokenAge = Date.now() - parseInt(timestamp);
    return password === ADMIN_PASSWORD && tokenAge < 24 * 60 * 60 * 1e3;
  } catch {
    return false;
  }
}
const POST = async ({ request }) => {
  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { env } = await import("cloudflare:workers");
    const kv = env.PORTFOLIO_DATA;
    if (!kv) {
      return new Response(JSON.stringify({ error: "KV not available" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    await kv.put("history", JSON.stringify(historyData));
    await kv.put("skills", JSON.stringify(skillsData));
    await kv.put("projects", JSON.stringify(projectsData));
    await kv.put("topics", JSON.stringify(topicsData));
    return new Response(JSON.stringify({ message: "Seed completed successfully" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Seed failed", detail: e?.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
