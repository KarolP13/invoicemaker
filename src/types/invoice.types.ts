// ──────────────────────────────────────────────
// Invoice Types
// ──────────────────────────────────────────────

export interface LineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Invoice {
    // Company Info
    companyLogo: string | null; // base64 data URL
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite: string;

    // Client Info
    clientName: string;
    clientAddress: string;
    clientEmail: string;

    // Invoice Details
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;

    // Line Items
    items: LineItem[];

    // Financial
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountRate: number;
    discountAmount: number;
    total: number;

    // Additional
    notes: string;
    terms: string;
    paymentInfo: string;
    currency: string;

    // Logo
    logoScale: number;    // 0.3–2
}

export const defaultInvoice: Invoice = {
    companyLogo: null,
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    invoiceNumber: 'INV-001',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    items: [
        { id: '1', description: '', quantity: 1, rate: 0, amount: 0 },
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    terms: 'Payment is due within 30 days of invoice date.',
    paymentInfo: '',
    currency: 'USD',
    logoScale: 1,
};
