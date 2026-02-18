import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    pdf,
} from '@react-pdf/renderer';
import type { Invoice } from '../../types/invoice.types';
import type { Theme } from '../../types/theme.types';
import { formatCurrency } from '../../utils/calculations';

// Use built-in Helvetica — no external font loading needed, reliable PDF output
const s = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1a1a2e',
        lineHeight: 1.6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    companyName: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 8,
    },
    invoiceTitle: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'right',
        marginBottom: 16,
    },
    secondaryLine: {
        color: '#555',
        fontSize: 9,
        marginBottom: 3,
    },
    bold: { fontFamily: 'Helvetica-Bold' },
    billTo: {
        marginBottom: 28,
        padding: 16,
        backgroundColor: '#f2f2f5',
        borderRadius: 4,
    },
    label: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#888',
        marginBottom: 6,
    },
    clientName: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#111',
        marginBottom: 4,
    },
    clientDetail: {
        fontSize: 9,
        color: '#555',
        marginBottom: 2,
    },
    table: { marginBottom: 28 },
    thRow: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tdRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    tdRowAlt: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        backgroundColor: '#fafafa',
    },
    colDesc: { flex: 1, paddingRight: 8 },
    colQty: { width: 50, textAlign: 'center' },
    colRate: { width: 80, textAlign: 'right' },
    colAmt: { width: 90, textAlign: 'right' },
    thText: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: '#555',
    },
    totalsContainer: { alignItems: 'flex-end', marginBottom: 28 },
    totalsBox: { width: 220 },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    totalLabel: { color: '#666', fontSize: 10 },
    totalValue: { fontSize: 10 },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        marginTop: 8,
        borderTopWidth: 2,
        borderTopColor: '#222',
    },
    grandTotalText: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
    grandTotalAmount: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#222' },
    notes: {
        borderTopWidth: 0.5,
        borderTopColor: '#ddd',
        paddingTop: 18,
    },
    notesLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: '#666',
        marginBottom: 6,
    },
    notesText: { fontSize: 9, color: '#555', lineHeight: 1.6 },
    logo: { marginBottom: 10, objectFit: 'contain' as const },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    detailLabel: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        color: '#333',
        marginRight: 4,
    },
    detailValue: {
        fontSize: 9,
        color: '#555',
    },
});

interface PDFProps {
    invoice: Invoice;
    theme: Theme;
}

const PDFInvoiceDocument: React.FC<PDFProps> = ({ invoice, theme }) => {
    const accent = theme.colors.accent;
    const pdfAccent = (accent === '#000000' || accent === '#1a1a1a') ? '#222222' : accent;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Header */}
                <View style={s.headerRow}>
                    <View style={{ maxWidth: '55%' }}>
                        {invoice.companyLogo && (
                            <Image
                                src={{ uri: invoice.companyLogo, method: 'GET', headers: {}, body: '' }}
                                style={{
                                    ...s.logo,
                                    width: Math.min(150, Math.round(100 * (invoice.logoScale || 1))),
                                    height: Math.min(60, Math.round(40 * (invoice.logoScale || 1))),
                                }}
                            />
                        )}
                        <Text style={s.companyName}>{invoice.companyName || 'Your Company'}</Text>
                        {!!invoice.companyAddress && <Text style={s.secondaryLine}>{invoice.companyAddress}</Text>}
                        {!!invoice.companyPhone && <Text style={s.secondaryLine}>{invoice.companyPhone}</Text>}
                        {!!invoice.companyEmail && <Text style={s.secondaryLine}>{invoice.companyEmail}</Text>}
                        {!!invoice.companyWebsite && <Text style={[s.secondaryLine, { color: pdfAccent }]}>{invoice.companyWebsite}</Text>}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[s.invoiceTitle, { color: pdfAccent }]}>INVOICE</Text>
                        <View style={s.detailRow}>
                            <Text style={s.detailLabel}>Invoice #:</Text>
                            <Text style={s.detailValue}>{invoice.invoiceNumber}</Text>
                        </View>
                        <View style={s.detailRow}>
                            <Text style={s.detailLabel}>Date:</Text>
                            <Text style={s.detailValue}>{invoice.invoiceDate}</Text>
                        </View>
                        <View style={s.detailRow}>
                            <Text style={s.detailLabel}>Due:</Text>
                            <Text style={s.detailValue}>{invoice.dueDate}</Text>
                        </View>
                    </View>
                </View>

                {/* Bill To */}
                <View style={s.billTo}>
                    <Text style={s.label}>Bill To</Text>
                    <Text style={s.clientName}>{invoice.clientName || 'Client Name'}</Text>
                    {!!invoice.clientAddress && <Text style={s.clientDetail}>{invoice.clientAddress}</Text>}
                    {!!invoice.clientEmail && <Text style={s.clientDetail}>{invoice.clientEmail}</Text>}
                </View>

                {/* Table */}
                <View style={s.table}>
                    <View style={s.thRow}>
                        <Text style={[s.thText, s.colDesc]}>Description</Text>
                        <Text style={[s.thText, s.colQty]}>Qty</Text>
                        <Text style={[s.thText, s.colRate]}>Rate</Text>
                        <Text style={[s.thText, s.colAmt]}>Amount</Text>
                    </View>
                    {invoice.items.map((item, idx) => (
                        <View key={item.id} style={idx % 2 === 1 ? s.tdRowAlt : s.tdRow}>
                            <Text style={s.colDesc}>{item.description || '—'}</Text>
                            <Text style={s.colQty}>{String(item.quantity)}</Text>
                            <Text style={s.colRate}>{formatCurrency(item.rate, invoice.currency)}</Text>
                            <Text style={[s.colAmt, { fontFamily: 'Helvetica-Bold' }]}>
                                {formatCurrency(item.quantity * item.rate, invoice.currency)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={s.totalsContainer}>
                    <View style={s.totalsBox}>
                        <View style={s.totalRow}>
                            <Text style={s.totalLabel}>Subtotal</Text>
                            <Text style={s.totalValue}>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
                        </View>
                        {invoice.taxRate > 0 && (
                            <View style={s.totalRow}>
                                <Text style={s.totalLabel}>Tax ({invoice.taxRate}%)</Text>
                                <Text style={s.totalValue}>{formatCurrency(invoice.taxAmount, invoice.currency)}</Text>
                            </View>
                        )}
                        {invoice.discountRate > 0 && (
                            <View style={s.totalRow}>
                                <Text style={s.totalLabel}>Discount ({invoice.discountRate}%)</Text>
                                <Text style={s.totalValue}>-{formatCurrency(invoice.discountAmount, invoice.currency)}</Text>
                            </View>
                        )}
                        <View style={[s.grandTotalRow, { borderTopColor: pdfAccent }]}>
                            <Text style={s.grandTotalText}>Total</Text>
                            <Text style={[s.grandTotalAmount, { color: pdfAccent }]}>
                                {formatCurrency(invoice.total, invoice.currency)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Notes & Terms */}
                {(invoice.notes || invoice.terms || invoice.paymentInfo) && (
                    <View style={s.notes}>
                        {!!invoice.notes && (
                            <View style={{ marginBottom: 12 }}>
                                <Text style={s.notesLabel}>Notes</Text>
                                <Text style={s.notesText}>{invoice.notes}</Text>
                            </View>
                        )}
                        {!!invoice.terms && (
                            <View style={{ marginBottom: invoice.paymentInfo ? 12 : 0 }}>
                                <Text style={s.notesLabel}>Terms & Conditions</Text>
                                <Text style={s.notesText}>{invoice.terms}</Text>
                            </View>
                        )}
                        {!!invoice.paymentInfo && (
                            <View style={{ padding: 10, backgroundColor: '#f8f8fa', borderRadius: 3, borderWidth: 0.5, borderColor: '#e0e0e5' }}>
                                <Text style={s.notesLabel}>Payment Information</Text>
                                <Text style={s.notesText}>{invoice.paymentInfo}</Text>
                            </View>
                        )}
                    </View>
                )}
            </Page>
        </Document>
    );
};

// ──────────────────────────────────────────────
// JSON export/import helpers
// ──────────────────────────────────────────────

/** The JSON schema exported alongside or instead of PDF */
export interface InvoiceJSON {
    _schema: 'invoice-creator-v1';
    invoice: Omit<Invoice, 'companyLogo'> & { companyLogo: string | null };
}

export function exportInvoiceJSON(invoice: Invoice): string {
    const payload: InvoiceJSON = {
        _schema: 'invoice-creator-v1',
        invoice,
    };
    return JSON.stringify(payload, null, 2);
}

export function downloadInvoiceJSON(invoice: Invoice) {
    const json = exportInvoiceJSON(invoice);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber || 'invoice'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseInvoiceJSON(text: string): Invoice {
    const parsed = JSON.parse(text);

    // Support both raw invoice object and wrapped schema
    const data = parsed._schema === 'invoice-creator-v1' ? parsed.invoice : parsed;

    // Validate required fields exist
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid invoice JSON format');
    }

    // Return with defaults for any missing fields
    return {
        companyLogo: data.companyLogo ?? null,
        companyName: data.companyName ?? '',
        companyAddress: data.companyAddress ?? '',
        companyPhone: data.companyPhone ?? '',
        companyEmail: data.companyEmail ?? '',
        companyWebsite: data.companyWebsite ?? '',
        clientName: data.clientName ?? '',
        clientAddress: data.clientAddress ?? '',
        clientEmail: data.clientEmail ?? '',
        invoiceNumber: data.invoiceNumber ?? 'INV-001',
        invoiceDate: data.invoiceDate ?? new Date().toISOString().split('T')[0],
        dueDate: data.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        items: Array.isArray(data.items) ? data.items.map((item: Record<string, unknown>, idx: number) => ({
            id: String(item.id ?? idx + 1),
            description: String(item.description ?? ''),
            quantity: Number(item.quantity ?? 1),
            rate: Number(item.rate ?? 0),
            amount: Number(item.amount ?? (Number(item.quantity ?? 1) * Number(item.rate ?? 0))),
        })) : [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
        subtotal: Number(data.subtotal ?? 0),
        taxRate: Number(data.taxRate ?? 0),
        taxAmount: Number(data.taxAmount ?? 0),
        discountRate: Number(data.discountRate ?? 0),
        discountAmount: Number(data.discountAmount ?? 0),
        total: Number(data.total ?? 0),
        notes: data.notes ?? '',
        terms: data.terms ?? '',
        paymentInfo: data.paymentInfo ?? '',
        currency: data.currency ?? 'USD',
        logoScale: Number(data.logoScale ?? 1),
    };
}

// Utility to trigger PDF download
export async function downloadInvoicePDF(invoice: Invoice, theme: Theme) {
    try {
        const blob = await pdf(<PDFInvoiceDocument invoice={invoice} theme={theme} />).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoice.invoiceNumber || 'invoice'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
        console.error('PDF generation error:', err);
        alert('PDF generation failed. Please try again.');
    }
}

export default PDFInvoiceDocument;
