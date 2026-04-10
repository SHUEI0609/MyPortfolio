globalThis.process ??= {};
globalThis.process.env ??= {};
import { p as projectsData } from "./projects_lnHvERnJ.mjs";
const ADMIN_PASSWORD = "0566";
let memoryCache = null;
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
async function getKV() {
  try {
    const { env } = await import("cloudflare:workers");
    return env.PORTFOLIO_DATA || null;
  } catch {
    return null;
  }
}
async function getData(kv) {
  if (kv) {
    try {
      const data = await kv.get("projects");
      if (data) return JSON.parse(data);
    } catch {
    }
  }
  if (memoryCache !== null) return [...memoryCache];
  return [...projectsData];
}
async function saveData(kv, data) {
  if (kv) await kv.put("projects", JSON.stringify(data));
  memoryCache = [...data];
}
const GET = async () => {
  const kv = await getKV();
  const data = await getData(kv);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const kv = await getKV();
    const text = await request.text();
    const newItem = JSON.parse(text);
    const data = await getData(kv);
    data.push(newItem);
    await saveData(kv, data);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad request", detail: e?.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async ({ request }) => {
  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const kv = await getKV();
    const text = await request.text();
    const { index, item } = JSON.parse(text);
    const data = await getData(kv);
    if (index < 0 || index >= data.length) {
      return new Response(JSON.stringify({ error: "Index out of range" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    data[index] = item;
    await saveData(kv, data);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad request", detail: e?.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ request }) => {
  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const kv = await getKV();
    const text = await request.text();
    const { index } = JSON.parse(text);
    const data = await getData(kv);
    if (index < 0 || index >= data.length) {
      return new Response(JSON.stringify({ error: "Index out of range" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    data.splice(index, 1);
    await saveData(kv, data);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad request", detail: e?.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
