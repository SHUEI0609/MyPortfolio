import { env } from 'cloudflare:workers';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 60 * 1000;
const encoder = new TextEncoder();

function toBase64Url(data: ArrayBuffer | Uint8Array): string {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): ArrayBuffer {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

export async function verifyAdminPassword(provided: string): Promise<boolean> {
    const expected = env.ADMIN_PASSWORD || '';
    if (!provided || !expected) return false;

    const verificationPayload = encoder.encode('portfolio-admin-login');
    const [providedKey, expectedKey] = await Promise.all([
        importHmacKey(provided),
        importHmacKey(expected),
    ]);
    const providedSignature = await crypto.subtle.sign('HMAC', providedKey, verificationPayload);
    return crypto.subtle.verify('HMAC', expectedKey, providedSignature, verificationPayload);
}

export async function createAdminToken(): Promise<string> {
    const secret = env.ADMIN_PASSWORD || '';
    if (!secret) throw new Error('Admin authentication is not configured');

    const payload = `${Date.now()}.${crypto.randomUUID()}`;
    const key = await importHmacKey(secret);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return `${toBase64Url(encoder.encode(payload))}.${toBase64Url(signature)}`;
}

export async function verifyAdminRequest(request: Request): Promise<boolean> {
    const secret = env.ADMIN_PASSWORD || '';
    if (!secret) return false;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return false;

    try {
        const token = authHeader.slice(7);
        const [encodedPayload, encodedSignature, extra] = token.split('.');
        if (!encodedPayload || !encodedSignature || extra) return false;

        const payloadBytes = fromBase64Url(encodedPayload);
        const payload = new TextDecoder().decode(payloadBytes);
        const [issuedAtText, nonce, extraPayload] = payload.split('.');
        const issuedAt = Number(issuedAtText);
        const age = Date.now() - issuedAt;
        if (!Number.isFinite(issuedAt) || !nonce || extraPayload) return false;
        if (age < -CLOCK_SKEW_MS || age >= TOKEN_TTL_MS) return false;

        const key = await importHmacKey(secret);
        return crypto.subtle.verify(
            'HMAC',
            key,
            fromBase64Url(encodedSignature),
            payloadBytes
        );
    } catch {
        return false;
    }
}
