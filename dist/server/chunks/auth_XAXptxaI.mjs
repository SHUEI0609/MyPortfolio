globalThis.process ??= {};
globalThis.process.env ??= {};
function generateToken(password) {
  const payload = `${Date.now()}:${password}`;
  return btoa(payload);
}
function getAdminPassword() {
  try {
    return "0566";
  } catch {
    return "0566";
  }
}
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
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
