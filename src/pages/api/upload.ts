import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyAdminRequest } from '../../utils/adminAuth';

/**
 * ArrayBuffer の画像データを WebP に変換する。
 * Cloudflare Workers の OffscreenCanvas + ImageDecoder を使用。
 * 変換に失敗した場合は元の ArrayBuffer をそのまま返す。
 */
async function convertToWebP(
    arrayBuffer: ArrayBuffer,
    mimeType: string,
    quality = 0.85
): Promise<{ data: ArrayBuffer; contentType: string }> {
    try {
        // すでに WebP の場合はそのまま返す
        if (mimeType === 'image/webp') {
            return { data: arrayBuffer, contentType: 'image/webp' };
        }

        // ImageDecoder が利用可能か確認（Cloudflare Workers でサポート）
        if (typeof ImageDecoder === 'undefined') {
            return { data: arrayBuffer, contentType: mimeType };
        }

        // 画像をデコード
        const decoder = new (ImageDecoder as any)({
            data: arrayBuffer,
            type: mimeType,
        });
        const { image } = await decoder.decode();

        // OffscreenCanvas に描画して WebP として encode
        const canvas = new OffscreenCanvas(image.displayWidth, image.displayHeight);
        const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.drawImage(image, 0, 0);

        const blob = await canvas.convertToBlob({ type: 'image/webp', quality });
        const webpBuffer = await blob.arrayBuffer();

        return { data: webpBuffer, contentType: 'image/webp' };
    } catch {
        // 変換失敗時は元データをそのまま返す
        return { data: arrayBuffer, contentType: mimeType };
    }
}

export const POST: APIRoute = async ({ request }) => {
    if (!(await verifyAdminRequest(request))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const kv = env.PORTFOLIO_DATA;

        const originalBuffer = await file.arrayBuffer();

        // WebP に変換（対応していない環境では元のまま）
        const { data: imageData, contentType } = await convertToWebP(
            originalBuffer,
            file.type || 'image/png'
        );

        // ファイル名を WebP 拡張子に統一
        const baseName = file.name.replace(/\.[^.]+$/, '');
        const ext = contentType === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'bin');
        const fileName = `${Date.now()}-${baseName}.${ext}`;

        // KV に保存
        await kv.put(`img:${fileName}`, imageData, {
            metadata: { contentType },
        });

        const url = `/api/images/${fileName}`;
        return new Response(JSON.stringify({ url, contentType }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(
            JSON.stringify({ error: 'Upload failed', detail: e?.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
