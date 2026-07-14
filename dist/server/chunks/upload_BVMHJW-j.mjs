globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { v as verifyAdminRequest } from "./adminAuth_kZerk0bA.mjs";
async function convertToWebP(arrayBuffer, mimeType, quality = 0.85) {
  try {
    if (mimeType === "image/webp") {
      return { data: arrayBuffer, contentType: "image/webp" };
    }
    if (typeof ImageDecoder === "undefined") {
      return { data: arrayBuffer, contentType: mimeType };
    }
    const decoder = new ImageDecoder({
      data: arrayBuffer,
      type: mimeType
    });
    const { image } = await decoder.decode();
    const canvas = new OffscreenCanvas(image.displayWidth, image.displayHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const blob = await canvas.convertToBlob({ type: "image/webp", quality });
    const webpBuffer = await blob.arrayBuffer();
    return { data: webpBuffer, contentType: "image/webp" };
  } catch {
    return { data: arrayBuffer, contentType: mimeType };
  }
}
const POST = async ({ request }) => {
  if (!await verifyAdminRequest(request)) {
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
    const kv = env.PORTFOLIO_DATA;
    const originalBuffer = await file.arrayBuffer();
    const { data: imageData, contentType } = await convertToWebP(
      originalBuffer,
      file.type || "image/png"
    );
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const ext = contentType === "image/webp" ? "webp" : file.name.split(".").pop() || "bin";
    const fileName = `${Date.now()}-${baseName}.${ext}`;
    await kv.put(`img:${fileName}`, imageData, {
      metadata: { contentType }
    });
    const url = `/api/images/${fileName}`;
    return new Response(JSON.stringify({ url, contentType }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Upload failed", detail: e?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
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
