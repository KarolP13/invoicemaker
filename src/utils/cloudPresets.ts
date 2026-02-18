/**
 * Cloud Presets — save/load invoice presets via jsonblob.com
 *
 * Uses a single master blob to store all presets keyed by user-chosen codes.
 * jsonblob.com is free, requires no API key, and has no rate limits.
 */
import type { Invoice } from '../types/invoice.types';

// ── jsonblob config ──────────────────────────
const BLOB_API = 'https://jsonblob.com/api/jsonBlob';
// We'll create the master blob on first save if it doesn't exist
const MASTER_BLOB_KEY = 'invoice-creator-presets-v1';

interface PresetStore {
    codes: Record<string, Partial<Invoice>>;
    _version: number;
}

// ── Local blob ID cache ──────────────────────
function getBlobId(): string | null {
    return localStorage.getItem(MASTER_BLOB_KEY);
}

function setBlobId(id: string): void {
    localStorage.setItem(MASTER_BLOB_KEY, id);
}

// ── API helpers ──────────────────────────────

async function createBlob(data: PresetStore): Promise<string> {
    const res = await fetch(BLOB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create preset store (${res.status})`);
    // The blob ID is in the Location header
    const location = res.headers.get('Location') || '';
    const id = location.split('/').pop() || '';
    if (!id) throw new Error('Failed to get blob ID from response');
    setBlobId(id);
    return id;
}

async function fetchBlob(blobId: string): Promise<PresetStore> {
    const res = await fetch(`${BLOB_API}/${blobId}`, {
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
        if (res.status === 404) throw new Error('Preset store not found. Save a preset first.');
        throw new Error(`Failed to fetch presets (${res.status})`);
    }
    return await res.json() as PresetStore;
}

async function updateBlob(blobId: string, data: PresetStore): Promise<void> {
    const res = await fetch(`${BLOB_API}/${blobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to save preset (${res.status})`);
}

async function getOrCreateStore(): Promise<{ store: PresetStore; blobId: string }> {
    let blobId = getBlobId();
    if (blobId) {
        try {
            const store = await fetchBlob(blobId);
            return { store, blobId };
        } catch {
            // Blob may have expired, create new one
        }
    }
    const emptyStore: PresetStore = { codes: {}, _version: 1 };
    blobId = await createBlob(emptyStore);
    return { store: emptyStore, blobId };
}

// ── Public API ───────────────────────────────

/** Validate the code format: 3-8 alphanumeric characters */
export function isValidCode(code: string): boolean {
    return /^[A-Za-z0-9]{3,8}$/.test(code);
}

/** Get the shareable blob ID (for cross-device use) */
export function getShareableId(): string | null {
    return getBlobId();
}

/** Set the blob ID (for loading from another device) */
export function setShareableId(id: string): void {
    setBlobId(id);
}

/** Save the current invoice data under a short user-chosen code */
export async function savePresetToCloud(code: string, invoice: Partial<Invoice>): Promise<string> {
    const normalizedCode = code.toUpperCase().trim();
    if (!isValidCode(normalizedCode)) {
        throw new Error('Code must be 3-8 alphanumeric characters');
    }

    // Strip computed fields — only save user-editable data
    const data = { ...invoice };
    delete (data as Record<string, unknown>).subtotal;
    delete (data as Record<string, unknown>).taxAmount;
    delete (data as Record<string, unknown>).discountAmount;
    delete (data as Record<string, unknown>).total;

    const { store, blobId } = await getOrCreateStore();
    store.codes[normalizedCode] = data;
    await updateBlob(blobId, store);
    return blobId;
}

/** Load a preset by its code */
export async function loadPresetFromCloud(code: string): Promise<Partial<Invoice>> {
    const normalizedCode = code.toUpperCase().trim();
    if (!isValidCode(normalizedCode)) {
        throw new Error('Code must be 3-8 alphanumeric characters');
    }

    const blobId = getBlobId();
    if (!blobId) throw new Error('No preset store found. Enter a Store ID or save a preset first.');

    const store = await fetchBlob(blobId);
    const data = store.codes[normalizedCode];
    if (!data) {
        throw new Error(`No preset found for code "${normalizedCode}"`);
    }
    return data;
}

/** List all saved preset codes */
export async function listPresetCodes(): Promise<string[]> {
    const blobId = getBlobId();
    if (!blobId) return [];
    try {
        const store = await fetchBlob(blobId);
        return Object.keys(store.codes);
    } catch {
        return [];
    }
}
