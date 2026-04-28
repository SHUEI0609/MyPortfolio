globalThis.process ??= {};
globalThis.process.env ??= {};
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
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { env } = await import("cloudflare:workers");
    const kv = env.PORTFOLIO_DATA;
    const fileName = `${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    await kv.put(`img:${fileName}`, arrayBuffer, {
      metadata: { contentType: file.type }
    });
    const url = `/api/images/${fileName}`;
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Upload failed", detail: e?.message }), {
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
