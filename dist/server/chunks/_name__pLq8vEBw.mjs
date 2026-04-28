globalThis.process ??= {};
globalThis.process.env ??= {};
const GET = async ({ params }) => {
  const { name } = params;
  if (!name) {
    return new Response("Not Found", { status: 404 });
  }
  try {
    const { env } = await import("cloudflare:workers");
    const kv = env.PORTFOLIO_DATA;
    if (!kv) {
      return new Response("KV Binding Not Found", { status: 500 });
    }
    const key = `img:${name}`;
    const { value, metadata } = await kv.getWithMetadata(key, { type: "arrayBuffer" });
    if (!value) {
      return new Response("Image Not Found", { status: 404 });
    }
    const contentType = metadata?.contentType || "image/png";
    return new Response(value, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
