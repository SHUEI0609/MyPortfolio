globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as skillsData } from "./skills_MVJtQhuk.mjs";
import { v as verifyAdminRequest } from "./adminAuth_kZerk0bA.mjs";
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
      const data = await kv.get("skills");
      if (data) return JSON.parse(data);
    } catch {
    }
    return [];
  }
  return [...skillsData];
}
async function saveData(kv, data) {
  if (kv) {
    await kv.put("skills", JSON.stringify(data));
  }
}
const GET = async () => {
  const kv = await getKV();
  const data = await getData(kv);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  if (!await verifyAdminRequest(request)) {
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
  if (!await verifyAdminRequest(request)) {
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
  if (!await verifyAdminRequest(request)) {
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
