/**
 * parsePDFToInvoice — extracts text from a PDF and maps it to Invoice fields.
 *
 * Uses pdfjs-dist to read pages, then applies heuristics to identify:
 *   - Company name (largest / boldest text, first page, top-left)
 *   - Invoice number, date, due date (patterns like INV-xxx, date formats)
 *   - Client / "Bill To" block
 *   - Line items (description + qty + rate + amount rows)
 *   - Totals, notes, terms
 */
import type { Invoice, LineItem } from '../types/invoice.types';
import { v4 as uuid } from 'uuid';

// ── PDF.js setup ─────────────────────────────
let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjs() {
    if (!pdfjsLib) {
        pdfjsLib = await import('pdfjs-dist');
        // Use the bundled worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.mjs',
            import.meta.url,
        ).toString();
    }
    return pdfjsLib;
}

// ── Text extraction ──────────────────────────
interface TextItem {
    str: string;
    x: number;
    y: number;
    fontSize: number;
}

async function extractTextItems(file: File): Promise<TextItem[]> {
    const pdfjs = await getPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const items: TextItem[] = [];

    for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const content = await page.getTextContent();

        for (const item of content.items) {
            if ('str' in item && item.str.trim()) {
                const tx = item.transform;
                items.push({
                    str: item.str.trim(),
                    x: tx[4],
                    y: tx[5],
                    fontSize: Math.abs(tx[0]) || 12,
                });
            }
        }
    }

    return items;
}

// ── Heuristic field extraction ───────────────

/** Join all text items into lines based on Y proximity */
function itemsToLines(items: TextItem[]): string[] {
    if (items.length === 0) return [];

    // Sort by Y descending (top of page = high Y), then X ascending
    const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);

    const lines: string[] = [];
    let currentLine = sorted[0].str;
    let currentY = sorted[0].y;

    for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];
        // Same line if Y is within 3 units
        if (Math.abs(item.y - currentY) < 3) {
            currentLine += '  ' + item.str;
        } else {
            lines.push(currentLine);
            currentLine = item.str;
            currentY = item.y;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Date patterns
const dateRegex = /\b(\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/;
const invoiceNumRegex = /(?:invoice\s*#?\s*:?\s*|inv[- ]?)([A-Z0-9][-A-Z0-9]+)/i;
const currencyRegex = /[\$€£¥]/;



function extractInvoiceNumber(lines: string[]): string {
    for (const line of lines) {
        const m = line.match(invoiceNumRegex);
        if (m) return m[1];
    }
    return 'INV-001';
}

function extractDate(lines: string[], keywords: string[]): string {
    for (const line of lines) {
        const lower = line.toLowerCase();
        if (keywords.some((kw) => lower.includes(kw))) {
            const m = line.match(dateRegex);
            if (m) return m[1];
        }
    }
    return '';
}

function extractBillTo(lines: string[]): { clientName: string; clientAddress: string; clientEmail: string } {
    const result = { clientName: '', clientAddress: '', clientEmail: '' };

    // Find "Bill To" marker
    let billToIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/bill\s*to/i.test(lines[i])) {
            billToIdx = i;
            break;
        }
    }

    if (billToIdx === -1) return result;

    // Collect next 4 non-empty lines after "Bill To"
    const block: string[] = [];
    for (let i = billToIdx + 1; i < Math.min(billToIdx + 6, lines.length); i++) {
        const line = lines[i].trim();
        if (!line) continue;
        // Stop if we hit table headers or another section
        if (/^(description|item|qty|quantity|rate|amount|total|subtotal|notes|terms)/i.test(line)) break;
        block.push(line);
    }

    if (block.length > 0) result.clientName = block[0];

    // Check for email in block
    const addressParts: string[] = [];
    for (let i = 1; i < block.length; i++) {
        const emailMatch = block[i].match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
            result.clientEmail = emailMatch[0];
        } else {
            addressParts.push(block[i]);
        }
    }
    result.clientAddress = addressParts.join('\n');

    return result;
}

function extractLineItems(lines: string[]): LineItem[] {
    const items: LineItem[] = [];

    // Look for table-like rows: description followed by numbers
    // Pattern: text  number  number  number (desc, qty, rate, amount)
    const numberRow = /^(.+?)\s{2,}(\d+(?:\.\d+)?)\s{2,}[\$€£¥]?([\d,]+(?:\.\d{2})?)\s{2,}[\$€£¥]?([\d,]+(?:\.\d{2})?)$/;

    for (const line of lines) {
        const m = line.match(numberRow);
        if (m) {
            const desc = m[1].trim();
            // Skip header rows
            if (/^(description|item|service)/i.test(desc)) continue;
            const qty = parseFloat(m[2]);
            const rate = parseFloat(m[3].replace(/,/g, ''));
            const amount = parseFloat(m[4].replace(/,/g, ''));
            items.push({
                id: uuid(),
                description: desc,
                quantity: qty,
                rate,
                amount: amount || qty * rate,
            });
        }
    }

    // If no structured rows found, try simpler pattern: description + single amount
    if (items.length === 0) {
        const simpleRow = /^(.+?)\s{2,}[\$€£¥]?([\d,]+(?:\.\d{2})?)$/;
        for (const line of lines) {
            const m = line.match(simpleRow);
            if (m) {
                const desc = m[1].trim();
                if (/^(description|item|subtotal|total|tax|discount|bill|invoice|date|due|notes|terms|payment)/i.test(desc)) continue;
                if (desc.length < 3) continue;
                const amount = parseFloat(m[2].replace(/,/g, ''));
                if (amount > 0) {
                    items.push({
                        id: uuid(),
                        description: desc,
                        quantity: 1,
                        rate: amount,
                        amount,
                    });
                }
            }
        }
    }

    return items.length > 0
        ? items
        : [{ id: uuid(), description: '', quantity: 1, rate: 0, amount: 0 }];
}

function extractCompanyInfo(items: TextItem[], lines: string[]) {
    // Company name is usually the largest text in the top-left
    const topItems = items
        .filter((i) => i.y > (items[0]?.y ?? 0) * 0.7) // top 30% of page
        .sort((a, b) => b.fontSize - a.fontSize);

    const companyName = topItems[0]?.str || '';

    // Look for phone, email, website near the top
    let companyPhone = '';
    let companyEmail = '';
    let companyWebsite = '';
    let companyAddress = '';

    const topLines = lines.slice(0, 10);
    const addressParts: string[] = [];

    for (const line of topLines) {
        if (line === companyName) continue;
        if (/invoice|bill\s*to/i.test(line)) break;

        const phoneMatch = line.match(/(\+?1?\s*[-.(]?\d{3}[-.)]\s*\d{3}[-.]?\d{4})/);
        if (phoneMatch && !companyPhone) {
            companyPhone = phoneMatch[1];
            continue;
        }

        const emailMatch = line.match(/([\w.-]+@[\w.-]+\.\w+)/);
        if (emailMatch && !companyEmail) {
            companyEmail = emailMatch[1];
            continue;
        }

        const webMatch = line.match(/((?:https?:\/\/)?[\w.-]+\.(?:com|co|io|dev|xyz|net|org)[\w/]*)/i);
        if (webMatch && !companyWebsite) {
            companyWebsite = webMatch[1];
            continue;
        }

        // Remaining top lines are likely address
        if (line.trim() && !currencyRegex.test(line) && !/^\d+\s*$/.test(line)) {
            addressParts.push(line.trim());
        }
    }

    companyAddress = addressParts.join('\n');

    return { companyName, companyAddress, companyPhone, companyEmail, companyWebsite };
}

function extractTotal(lines: string[]): number {
    // Look for "Total" line with a dollar amount — take the last one (grand total)
    let total = 0;
    for (const line of lines) {
        if (/\btotal\b/i.test(line)) {
            const m = line.match(/[\$€£¥]?\s*([\d,]+(?:\.\d{2})?)/);
            if (m) total = parseFloat(m[1].replace(/,/g, ''));
        }
    }
    return total;
}

// ── Main export ──────────────────────────────

export async function parsePDFToInvoice(file: File): Promise<Partial<Invoice>> {
    const items = await extractTextItems(file);
    const lines = itemsToLines(items);

    const company = extractCompanyInfo(items, lines);
    const billTo = extractBillTo(lines);
    const lineItems = extractLineItems(lines);
    const invoiceNumber = extractInvoiceNumber(lines);
    const invoiceDate = extractDate(lines, ['date', 'issued', 'invoice date']) || new Date().toISOString().split('T')[0];
    const dueDate = extractDate(lines, ['due', 'due date', 'payment due']) || '';
    const total = extractTotal(lines);

    // Extract notes/terms
    let notes = '';
    let terms = '';
    for (let i = 0; i < lines.length; i++) {
        if (/^notes?\b/i.test(lines[i])) {
            notes = lines.slice(i + 1, i + 4).filter((l) => l && !/^(terms|total|subtotal)/i.test(l)).join('\n');
        }
        if (/^terms?\b/i.test(lines[i])) {
            terms = lines.slice(i + 1, i + 4).filter((l) => l && !/^(notes|total|subtotal)/i.test(l)).join('\n');
        }
    }

    return {
        ...company,
        ...billTo,
        invoiceNumber,
        invoiceDate,
        dueDate,
        items: lineItems,
        total,
        notes,
        terms,
    };
}
