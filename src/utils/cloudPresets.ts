/**
 * Cloud Presets — save/load invoice presets via localStorage
 * 
 * Uses localStorage for reliable preset storage.
 * Presets are shareable via exportable JSON codes.
 */
import type { Invoice } from '../types/invoice.types';

const STORAGE_KEY = 'invoice-creator-presets-v2';

interface PresetStore {
    codes: Record<string, Partial<Invoice>>;
    _version: number;
}

// ── Storage helpers ──────────────────────────
function getStore(): PresetStore {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as PresetStore;
            if (parsed && typeof parsed === 'object' && parsed.codes) {
                return parsed;
            }
        }
    } catch {
        // corrupted — reset
    }
    return { codes: {}, _version: 2 };
}

function saveStore(store: PresetStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ── Public API ───────────────────────────────

/** Validate the code format: 3-8 alphanumeric characters */
export function isValidCode(code: string): boolean {
    return /^[A-Za-z0-9]{3,8}$/.test(code);
}

/** Get the shareable store export as a Base64 string */
export function getShareableId(): string | null {
    const store = getStore();
    if (Object.keys(store.codes).length === 0) return null;
    try {
        return btoa(JSON.stringify(store));
    } catch {
        return null;
    }
}

/** Import a store from a Base64 string (for cross-device sharing) */
export function setShareableId(encoded: string): void {
    try {
        const decoded = JSON.parse(atob(encoded)) as PresetStore;
        if (decoded && decoded.codes && typeof decoded.codes === 'object') {
            // Merge with existing presets
            const existing = getStore();
            const merged: PresetStore = {
                codes: { ...existing.codes, ...decoded.codes },
                _version: 2,
            };
            saveStore(merged);
        }
    } catch {
        // Invalid encoded string — ignore
        throw new Error('Invalid Store ID format. Please paste a valid export code.');
    }
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

    const store = getStore();
    store.codes[normalizedCode] = data;
    saveStore(store);

    // Return a share code for the store
    return btoa(JSON.stringify(store)).slice(0, 12) + '…';
}

/** Load a preset by its code */
export async function loadPresetFromCloud(code: string): Promise<Partial<Invoice>> {
    const normalizedCode = code.toUpperCase().trim();
    if (!isValidCode(normalizedCode)) {
        throw new Error('Code must be 3-8 alphanumeric characters');
    }

    const store = getStore();
    const data = store.codes[normalizedCode];
    if (!data) {
        const available = Object.keys(store.codes);
        if (available.length === 0) {
            throw new Error('No presets saved yet. Save a preset first!');
        }
        throw new Error(`No preset found for code "${normalizedCode}". Available: ${available.join(', ')}`);
    }
    return data;
}

/** List all saved preset codes */
export async function listPresetCodes(): Promise<string[]> {
    const store = getStore();
    return Object.keys(store.codes);
}

/** Delete a preset by code */
export async function deletePreset(code: string): Promise<void> {
    const normalizedCode = code.toUpperCase().trim();
    const store = getStore();
    delete store.codes[normalizedCode];
    saveStore(store);
}

/** Export all presets as a shareable string */
export function exportAllPresets(): string {
    const store = getStore();
    return btoa(JSON.stringify(store));
}

/** Import presets from a shareable string */
export function importPresets(encoded: string): number {
    try {
        const decoded = JSON.parse(atob(encoded)) as PresetStore;
        if (!decoded?.codes) throw new Error('Invalid format');

        const existing = getStore();
        const newCodes = Object.keys(decoded.codes).filter(k => !existing.codes[k]);
        const merged: PresetStore = {
            codes: { ...existing.codes, ...decoded.codes },
            _version: 2,
        };
        saveStore(merged);
        return newCodes.length;
    } catch {
        throw new Error('Invalid preset data. Please paste a valid export code.');
    }
}
