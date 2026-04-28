globalThis.process ??= {};
globalThis.process.env ??= {};
function generateToken(password) {
  const payload = `${Date.now()}:${password}`;
  return btoa(payload);
}
function getAdminPassword() {
  return "0566";
}
const GET = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = atob(token);
    const colonIndex = decoded.indexOf(":");
    if (colonIndex === -1) throw new Error("invalid token");
    const timestamp = decoded.substring(0, colonIndex);
    const password = decoded.substring(colonIndex + 1);
    const tokenAge = Date.now() - parseInt(timestamp);
    const adminPassword = getAdminPassword();
    if (adminPassword && password === adminPassword && tokenAge < 24 * 60 * 60 * 1e3) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch {
  }
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  try {
    const text = await request.text();
    const body = JSON.parse(text);
    const { password } = body;
    if (!password) {
      return new Response(JSON.stringify({ error: "Password required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const adminPassword = getAdminPassword();
    if (password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = generateToken(adminPassword);
    return new Response(JSON.stringify({ token }), {
      status: 200,
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
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
