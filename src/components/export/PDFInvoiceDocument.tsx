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

// ──────────────────────────────────────────────
// Shared PDF helpers
// ──────────────────────────────────────────────
const base = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.6 },
    bold: { fontFamily: 'Helvetica-Bold' },
    logo: { objectFit: 'contain' as const, marginBottom: 10 },
});

interface PDFProps { invoice: Invoice; theme: Theme; }

function LogoBlock({ invoice }: { invoice: Invoice }) {
    if (!invoice.companyLogo) return null;
    return (
        <Image
            src={invoice.companyLogo}
            style={{
                ...base.logo,
                width: Math.min(150, Math.round(100 * (invoice.logoScale || 1))),
                height: Math.min(60, Math.round(40 * (invoice.logoScale || 1))),
            }}
        />
    );
}

function TotalsPDF({ invoice, accent }: { invoice: Invoice; accent: string }) {
    return (
        <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
            <View style={{ width: 220 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                    <Text style={{ color: '#666', fontSize: 10 }}>Subtotal</Text>
                    <Text style={{ fontSize: 10 }}>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
                </View>
                {invoice.taxRate > 0 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                        <Text style={{ color: '#666', fontSize: 10 }}>Tax ({invoice.taxRate}%)</Text>
                        <Text style={{ fontSize: 10 }}>{formatCurrency(invoice.taxAmount, invoice.currency)}</Text>
                    </View>
                )}
                {invoice.discountRate > 0 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                        <Text style={{ color: '#666', fontSize: 10 }}>Discount ({invoice.discountRate}%)</Text>
                        <Text style={{ fontSize: 10 }}>-{formatCurrency(invoice.discountAmount, invoice.currency)}</Text>
                    </View>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTopWidth: 2, borderTopColor: accent }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold' }}>Total</Text>
                    <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: accent }}>{formatCurrency(invoice.total, invoice.currency)}</Text>
                </View>
            </View>
        </View>
    );
}

function NotesPDF({ invoice }: { invoice: Invoice }) {
    if (!invoice.notes && !invoice.terms && !invoice.paymentInfo) return null;
    return (
        <View style={{ borderTopWidth: 0.5, borderTopColor: '#ddd', paddingTop: 16 }}>
            {!!invoice.notes && (
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8, color: '#666', marginBottom: 4 }}>Notes</Text>
                    <Text style={{ fontSize: 9, color: '#555', lineHeight: 1.6 }}>{invoice.notes}</Text>
                </View>
            )}
            {!!invoice.terms && (
                <View style={{ marginBottom: invoice.paymentInfo ? 10 : 0 }}>
                    <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8, color: '#666', marginBottom: 4 }}>Terms & Conditions</Text>
                    <Text style={{ fontSize: 9, color: '#555', lineHeight: 1.6 }}>{invoice.terms}</Text>
                </View>
            )}
            {!!invoice.paymentInfo && (
                <View style={{ padding: 10, backgroundColor: '#f8f8fa', borderRadius: 3, borderWidth: 0.5, borderColor: '#e0e0e5' }}>
                    <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8, color: '#666', marginBottom: 4 }}>Payment Information</Text>
                    <Text style={{ fontSize: 9, color: '#555', lineHeight: 1.6 }}>{invoice.paymentInfo}</Text>
                </View>
            )}
        </View>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Brutalist
// ──────────────────────────────────────────────
function BrutalistPDF({ invoice }: PDFProps) {
    return (
        <Page size="A4" style={[base.page, { padding: 0, color: '#111' }]}>
            {/* Black header bar */}
            <View style={{ backgroundColor: '#1a1a1a', paddingHorizontal: 36, paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {invoice.companyLogo && <Image src={invoice.companyLogo} style={{ width: 48, height: 24, objectFit: 'contain' as const, marginRight: 14 }} />}
                    <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>{invoice.companyName || 'Your Company'}</Text>
                </View>
                <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: 3 }}>INVOICE</Text>
            </View>

            <View style={{ padding: 36 }}>
                {/* Meta */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                    <View>
                        {!!invoice.companyAddress && <Text style={{ fontSize: 9, color: '#555', marginBottom: 2 }}>{invoice.companyAddress}</Text>}
                        {!!invoice.companyPhone && <Text style={{ fontSize: 9, color: '#555', marginBottom: 2 }}>{invoice.companyPhone}</Text>}
                        {!!invoice.companyEmail && <Text style={{ fontSize: 9, color: '#555' }}>{invoice.companyEmail}</Text>}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 9, marginBottom: 2 }}><Text style={base.bold}>Invoice #:</Text> {invoice.invoiceNumber}</Text>
                        <Text style={{ fontSize: 9, marginBottom: 2 }}><Text style={base.bold}>Date:</Text> {invoice.invoiceDate}</Text>
                        <Text style={{ fontSize: 9 }}><Text style={base.bold}>Due:</Text> {invoice.dueDate}</Text>
                    </View>
                </View>

                {/* Bill To */}
                <View style={{ backgroundColor: '#1a1a1a', padding: 16, marginBottom: 24 }}>
                    <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 4 }}>Bill To</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#fff', marginBottom: 3 }}>{invoice.clientName || 'Client Name'}</Text>
                    {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#bbb' }}>{invoice.clientAddress}</Text>}
                    {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#bbb', marginTop: 2 }}>{invoice.clientEmail}</Text>}
                </View>

                {/* Table */}
                <View style={{ marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: '#1a1a1a', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 3, borderBottomColor: '#ff4500' }}>
                        <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: '#fff' }}>Description</Text>
                        <Text style={{ width: 50, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: '#fff' }}>Qty</Text>
                        <Text style={{ width: 80, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: '#fff' }}>Rate</Text>
                        <Text style={{ width: 90, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: '#fff' }}>Amount</Text>
                    </View>
                    {invoice.items.map((item, idx) => (
                        <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#ddd', backgroundColor: idx % 2 === 1 ? '#f5f5f5' : 'transparent' }}>
                            <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                            <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                            <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                            <Text style={{ width: 90, textAlign: 'right', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                        </View>
                    ))}
                </View>

                <TotalsPDF invoice={invoice} accent="#ff4500" />
                <NotesPDF invoice={invoice} />
            </View>
        </Page>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Executive
// ──────────────────────────────────────────────
function ExecutivePDF({ invoice }: PDFProps) {
    const accent = '#8b6914';
    return (
        <Page size="A4" style={[base.page, { padding: 48, color: '#1c1a15' }]}>
            {/* Centered header */}
            <View style={{ alignItems: 'center', marginBottom: 28, borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 24 }}>
                <LogoBlock invoice={invoice} />
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</Text>
                <Text style={{ fontSize: 9, color: '#6b6356' }}>
                    {invoice.companyAddress}{invoice.companyPhone ? ` • ${invoice.companyPhone}` : ''}{invoice.companyEmail ? ` • ${invoice.companyEmail}` : ''}
                </Text>
            </View>

            {/* Two-col: Invoice info + Bill To */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
                <View>
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 2, color: accent, marginBottom: 8 }}>Invoice</Text>
                    <Text style={{ fontSize: 9, color: '#6b6356', marginBottom: 2 }}># {invoice.invoiceNumber}</Text>
                    <Text style={{ fontSize: 9, color: '#6b6356', marginBottom: 2 }}>Date: {invoice.invoiceDate}</Text>
                    <Text style={{ fontSize: 9, color: '#6b6356' }}>Due: {invoice.dueDate}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 2, color: accent, marginBottom: 8 }}>Bill To</Text>
                    <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{invoice.clientName || 'Client Name'}</Text>
                    {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#6b6356', textAlign: 'right' }}>{invoice.clientAddress}</Text>}
                    {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#6b6356' }}>{invoice.clientEmail}</Text>}
                </View>
            </View>

            {/* Table — elegant borders */}
            <View style={{ marginBottom: 28 }}>
                <View style={{ flexDirection: 'row', borderTopWidth: 2, borderTopColor: accent, borderBottomWidth: 1, borderBottomColor: accent, paddingVertical: 8 }}>
                    <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: accent }}>Description</Text>
                    <Text style={{ width: 50, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: accent }}>Qty</Text>
                    <Text style={{ width: 80, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: accent }}>Rate</Text>
                    <Text style={{ width: 90, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: accent }}>Amount</Text>
                </View>
                {invoice.items.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#d4c5a9' }}>
                        <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                        <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                        <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                        <Text style={{ width: 90, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                    </View>
                ))}
            </View>

            <TotalsPDF invoice={invoice} accent={accent} />
            <NotesPDF invoice={invoice} />
        </Page>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Midnight Pro
// ──────────────────────────────────────────────
function MidnightPDF({ invoice }: PDFProps) {
    const accent = '#38bdf8';
    const bg = '#1e293b';
    return (
        <Page size="A4" style={[base.page, { padding: 0, color: '#e2e8f0' }]}>
            <View style={{ flexDirection: 'row', minHeight: '100%' }}>
                {/* Left accent strip */}
                <View style={{ width: 6, backgroundColor: accent }} />

                <View style={{ flex: 1, padding: 36, backgroundColor: bg }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
                        <View>
                            <LogoBlock invoice={invoice} />
                            <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</Text>
                            {!!invoice.companyAddress && <Text style={{ fontSize: 9, color: '#94a3b8' }}>{invoice.companyAddress}</Text>}
                            {!!invoice.companyPhone && <Text style={{ fontSize: 9, color: '#94a3b8' }}>{invoice.companyPhone}</Text>}
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: accent, marginBottom: 8 }}>INVOICE</Text>
                            <Text style={{ fontSize: 9, color: accent }}>#{invoice.invoiceNumber}</Text>
                            <Text style={{ fontSize: 9, color: '#94a3b8' }}>{invoice.invoiceDate}</Text>
                            <Text style={{ fontSize: 9, color: '#94a3b8' }}>Due: {invoice.dueDate}</Text>
                        </View>
                    </View>

                    {/* Bill To */}
                    <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#334155', borderLeftWidth: 3, borderLeftColor: accent }}>
                        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: accent, marginBottom: 4 }}>Bill To</Text>
                        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{invoice.clientName || 'Client Name'}</Text>
                        {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#94a3b8' }}>{invoice.clientAddress}</Text>}
                        {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{invoice.clientEmail}</Text>}
                    </View>

                    {/* Table */}
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#475569' }}>
                            <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: accent }}>Description</Text>
                            <Text style={{ width: 50, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Qty</Text>
                            <Text style={{ width: 80, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Rate</Text>
                            <Text style={{ width: 90, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Amount</Text>
                        </View>
                        {invoice.items.map((item, idx) => (
                            <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#334155', backgroundColor: idx % 2 === 1 ? '#253347' : 'transparent' }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                                <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                                <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                                <Text style={{ width: 90, textAlign: 'right', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Totals — light text */}
                    <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
                        <View style={{ width: 220 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                                <Text style={{ color: '#94a3b8', fontSize: 10 }}>Subtotal</Text>
                                <Text style={{ fontSize: 10 }}>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
                            </View>
                            {invoice.taxRate > 0 && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                                    <Text style={{ color: '#94a3b8', fontSize: 10 }}>Tax ({invoice.taxRate}%)</Text>
                                    <Text style={{ fontSize: 10 }}>{formatCurrency(invoice.taxAmount, invoice.currency)}</Text>
                                </View>
                            )}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTopWidth: 2, borderTopColor: accent }}>
                                <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold' }}>Total</Text>
                                <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: accent }}>{formatCurrency(invoice.total, invoice.currency)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Notes */}
                    {(invoice.notes || invoice.terms || invoice.paymentInfo) && (
                        <View style={{ borderTopWidth: 0.5, borderTopColor: '#475569', paddingTop: 14 }}>
                            {!!invoice.notes && <View style={{ marginBottom: 8 }}><Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#94a3b8', marginBottom: 3 }}>NOTES</Text><Text style={{ fontSize: 9, color: '#94a3b8' }}>{invoice.notes}</Text></View>}
                            {!!invoice.terms && <View style={{ marginBottom: 8 }}><Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#94a3b8', marginBottom: 3 }}>TERMS</Text><Text style={{ fontSize: 9, color: '#94a3b8' }}>{invoice.terms}</Text></View>}
                            {!!invoice.paymentInfo && <View><Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#94a3b8', marginBottom: 3 }}>PAYMENT INFO</Text><Text style={{ fontSize: 9, color: '#94a3b8' }}>{invoice.paymentInfo}</Text></View>}
                        </View>
                    )}
                </View>
            </View>
        </Page>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Classic (blue banner header)
// ──────────────────────────────────────────────
function ClassicPDF({ invoice }: PDFProps) {
    const accent = '#1e40af';
    return (
        <Page size="A4" style={[base.page, { padding: 0, color: '#1e293b' }]}>
            {/* Blue header */}
            <View style={{ backgroundColor: accent, paddingHorizontal: 36, paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {invoice.companyLogo && <Image src={invoice.companyLogo} style={{ width: 48, height: 24, objectFit: 'contain' as const, marginRight: 14 }} />}
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#fff' }}>{invoice.companyName || 'Your Company'}</Text>
                        {!!invoice.companyEmail && <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)' }}>{invoice.companyEmail}{invoice.companyPhone ? ` • ${invoice.companyPhone}` : ''}</Text>}
                    </View>
                </View>
                <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#fff' }}>INVOICE</Text>
            </View>

            <View style={{ padding: 36 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
                    <View>
                        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: accent, marginBottom: 6 }}>Invoice Details</Text>
                        <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>Number: {invoice.invoiceNumber}</Text>
                        <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>Date: {invoice.invoiceDate}</Text>
                        <Text style={{ fontSize: 9, color: '#64748b' }}>Due: {invoice.dueDate}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: accent, marginBottom: 6 }}>Bill To</Text>
                        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{invoice.clientName || 'Client Name'}</Text>
                        {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#64748b' }}>{invoice.clientAddress}</Text>}
                        {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#64748b' }}>{invoice.clientEmail}</Text>}
                    </View>
                </View>

                {/* Table with blue header */}
                <View style={{ marginBottom: 28 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: accent, paddingVertical: 8, paddingHorizontal: 10 }}>
                        <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: '#fff' }}>Description</Text>
                        <Text style={{ width: 50, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff' }}>Qty</Text>
                        <Text style={{ width: 80, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff' }}>Rate</Text>
                        <Text style={{ width: 90, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff' }}>Amount</Text>
                    </View>
                    {invoice.items.map((item, idx) => (
                        <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', backgroundColor: idx % 2 === 1 ? '#f1f5f9' : 'transparent' }}>
                            <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                            <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                            <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                            <Text style={{ width: 90, textAlign: 'right', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                        </View>
                    ))}
                </View>

                <TotalsPDF invoice={invoice} accent={accent} />
                <NotesPDF invoice={invoice} />
            </View>
        </Page>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Minimal (hairlines, lots of whitespace)
// ──────────────────────────────────────────────
function MinimalPDF({ invoice }: PDFProps) {
    return (
        <Page size="A4" style={[base.page, { padding: 52, color: '#18181b' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                <View>
                    <LogoBlock invoice={invoice} />
                    <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 6 }}>{invoice.companyName || 'Your Company'}</Text>
                    {!!invoice.companyAddress && <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.companyAddress}</Text>}
                    {!!invoice.companyPhone && <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.companyPhone}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 3, color: '#71717a', marginBottom: 10 }}>Invoice</Text>
                    <Text style={{ fontSize: 24, fontFamily: 'Helvetica', marginBottom: 6 }}>{invoice.invoiceNumber}</Text>
                    <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.invoiceDate} — Due {invoice.dueDate}</Text>
                </View>
            </View>

            {/* Bill To — plain text */}
            <View style={{ marginBottom: 32 }}>
                <Text style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: '#71717a', marginBottom: 6 }}>Billed To</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>{invoice.clientName || 'Client Name'}</Text>
                {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.clientAddress}</Text>}
                {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>{invoice.clientEmail}</Text>}
            </View>

            {/* Table */}
            <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' }}>
                    <Text style={{ flex: 1, fontSize: 8, textTransform: 'uppercase', letterSpacing: 1.5, color: '#71717a' }}>Description</Text>
                    <Text style={{ width: 50, textAlign: 'center', fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, color: '#71717a' }}>Qty</Text>
                    <Text style={{ width: 80, textAlign: 'right', fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, color: '#71717a' }}>Rate</Text>
                    <Text style={{ width: 90, textAlign: 'right', fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, color: '#71717a' }}>Amount</Text>
                </View>
                {invoice.items.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#e4e4e7' }}>
                        <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                        <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                        <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                        <Text style={{ width: 90, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                    </View>
                ))}
            </View>

            <TotalsPDF invoice={invoice} accent="#18181b" />
            <NotesPDF invoice={invoice} />
        </Page>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Tech (dotted lines, pill badges)
// ──────────────────────────────────────────────
function TechPDF({ invoice }: PDFProps) {
    const accent = '#059669';
    return (
        <Page size="A4" style={[base.page, { padding: 40, color: '#064e3b', borderTopWidth: 4, borderTopColor: accent }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
                <View>
                    <LogoBlock invoice={invoice} />
                    <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</Text>
                    {!!invoice.companyAddress && <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.companyAddress}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <View style={{ backgroundColor: accent, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#fff' }}>INVOICE</Text>
                    </View>
                    <Text style={{ fontSize: 9, color: '#6b7280', fontFamily: 'Courier', marginBottom: 2 }}>{invoice.invoiceNumber}</Text>
                    <Text style={{ fontSize: 9, color: '#6b7280', fontFamily: 'Courier' }}>{invoice.invoiceDate} | Due: {invoice.dueDate}</Text>
                </View>
            </View>

            {/* Bill To */}
            <View style={{ marginBottom: 24, padding: 14, borderWidth: 1, borderColor: '#d1fae5', borderRadius: 6 }}>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: accent, marginBottom: 4 }}>Bill To</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>{invoice.clientName || 'Client Name'}</Text>
                {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.clientAddress}</Text>}
                {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>{invoice.clientEmail}</Text>}
            </View>

            {/* Table with dotted borders */}
            <View style={{ marginBottom: 28 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 2, borderBottomColor: accent, borderStyle: 'dotted' }}>
                    <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: accent }}>Description</Text>
                    <Text style={{ width: 50, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Qty</Text>
                    <Text style={{ width: 80, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Rate</Text>
                    <Text style={{ width: 90, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Amount</Text>
                </View>
                {invoice.items.map((item, idx) => (
                    <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#d1fae5', backgroundColor: idx % 2 === 1 ? '#f0fdf4' : 'transparent' }}>
                        <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                        <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                        <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                        <Text style={{ width: 90, textAlign: 'right', fontSize: 10, fontFamily: 'Helvetica-Bold', color: accent }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                    </View>
                ))}
            </View>

            <TotalsPDF invoice={invoice} accent={accent} />
            <NotesPDF invoice={invoice} />
        </Page>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Elegant (serif feel, accent top border)
// ──────────────────────────────────────────────
function ElegantPDF({ invoice }: PDFProps) {
    const accent = '#9d174d';
    return (
        <Page size="A4" style={[base.page, { padding: 48, color: '#1c1917', borderTopWidth: 3, borderTopColor: accent }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
                <View>
                    <LogoBlock invoice={invoice} />
                    <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</Text>
                    {!!invoice.companyAddress && <Text style={{ fontSize: 9, color: '#78716c' }}>{invoice.companyAddress}</Text>}
                    {!!invoice.companyPhone && <Text style={{ fontSize: 9, color: '#78716c' }}>{invoice.companyPhone}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 32, color: accent, marginBottom: 8 }}>Invoice</Text>
                    <Text style={{ fontSize: 9, color: '#78716c', marginBottom: 2 }}>No. {invoice.invoiceNumber}</Text>
                    <Text style={{ fontSize: 9, color: '#78716c', marginBottom: 2 }}>{invoice.invoiceDate}</Text>
                    <Text style={{ fontSize: 9, color: '#78716c' }}>Due {invoice.dueDate}</Text>
                </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#e7e5e4', marginBottom: 24 }} />

            {/* Bill To */}
            <View style={{ marginBottom: 28 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.5, color: accent, marginBottom: 6 }}>Bill To</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{invoice.clientName || 'Client Name'}</Text>
                {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#78716c' }}>{invoice.clientAddress}</Text>}
                {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>{invoice.clientEmail}</Text>}
            </View>

            {/* Table */}
            <View style={{ marginBottom: 28 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 8, borderTopWidth: 2, borderTopColor: accent, borderBottomWidth: 2, borderBottomColor: accent }}>
                    <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: accent }}>Description</Text>
                    <Text style={{ width: 50, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Qty</Text>
                    <Text style={{ width: 80, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Rate</Text>
                    <Text style={{ width: 90, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Amount</Text>
                </View>
                {invoice.items.map((item, idx) => (
                    <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#e7e5e4', backgroundColor: idx % 2 === 1 ? '#fdfcfb' : 'transparent' }}>
                        <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                        <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                        <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                        <Text style={{ width: 90, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                    </View>
                ))}
            </View>

            <TotalsPDF invoice={invoice} accent={accent} />
            <NotesPDF invoice={invoice} />
        </Page>
    );
}

// ──────────────────────────────────────────────
// TEMPLATE: Fresh Modern (accent sidebar)
// ──────────────────────────────────────────────
function FreshPDF({ invoice }: PDFProps) {
    const accent = '#7c3aed';
    return (
        <Page size="A4" style={[base.page, { padding: 0, color: '#1e1b4b' }]}>
            <View style={{ flexDirection: 'row', minHeight: '100%' }}>
                {/* Left sidebar */}
                <View style={{ width: 48, backgroundColor: accent }} />

                <View style={{ flex: 1, padding: 36 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
                        <View>
                            <LogoBlock invoice={invoice} />
                            <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</Text>
                            {!!invoice.companyAddress && <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.companyAddress}</Text>}
                            {!!invoice.companyPhone && <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.companyPhone}</Text>}
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: accent, marginBottom: 3 }}># {invoice.invoiceNumber}</Text>
                            <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.invoiceDate}</Text>
                            <Text style={{ fontSize: 9, color: '#6b7280' }}>Due: {invoice.dueDate}</Text>
                        </View>
                    </View>

                    {/* Bill To with left bar */}
                    <View style={{ marginBottom: 24, padding: 14, borderLeftWidth: 4, borderLeftColor: accent, backgroundColor: '#faf5ff' }}>
                        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: accent, marginBottom: 4 }}>Bill To</Text>
                        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>{invoice.clientName || 'Client Name'}</Text>
                        {!!invoice.clientAddress && <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.clientAddress}</Text>}
                        {!!invoice.clientEmail && <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>{invoice.clientEmail}</Text>}
                    </View>

                    {/* Table */}
                    <View style={{ marginBottom: 28 }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, backgroundColor: '#f5f3ff', borderBottomWidth: 2, borderBottomColor: accent }}>
                            <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: accent }}>Description</Text>
                            <Text style={{ width: 50, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Qty</Text>
                            <Text style={{ width: 80, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Rate</Text>
                            <Text style={{ width: 90, textAlign: 'right', fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent }}>Amount</Text>
                        </View>
                        {invoice.items.map((item, idx) => (
                            <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', backgroundColor: idx % 2 === 1 ? '#faf5ff' : 'transparent' }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>{item.description || '—'}</Text>
                                <Text style={{ width: 50, textAlign: 'center', fontSize: 10 }}>{String(item.quantity)}</Text>
                                <Text style={{ width: 80, textAlign: 'right', fontSize: 10 }}>{formatCurrency(item.rate, invoice.currency)}</Text>
                                <Text style={{ width: 90, textAlign: 'right', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</Text>
                            </View>
                        ))}
                    </View>

                    <TotalsPDF invoice={invoice} accent={accent} />
                    <NotesPDF invoice={invoice} />
                </View>
            </View>
        </Page>
    );
}

// ──────────────────────────────────────────────
// Template Router
// ──────────────────────────────────────────────
const templateMap: Record<string, React.FC<PDFProps>> = {
    brutalist: BrutalistPDF,
    executive: ExecutivePDF,
    midnight: MidnightPDF,
    minimal: MinimalPDF,
    classic: ClassicPDF,
    tech: TechPDF,
    elegant: ElegantPDF,
    fresh: FreshPDF,
};

const PDFInvoiceDocument: React.FC<PDFProps> = ({ invoice, theme }) => {
    const TemplatePDF = templateMap[theme.templateId] || BrutalistPDF;
    return (
        <Document>
            <TemplatePDF invoice={invoice} theme={theme} />
        </Document>
    );
};

// ──────────────────────────────────────────────
// JSON export/import helpers
// ──────────────────────────────────────────────

export interface InvoiceJSON {
    _schema: 'invoice-creator-v1';
    invoice: Omit<Invoice, 'companyLogo'> & { companyLogo: string | null };
}

export function exportInvoiceJSON(invoice: Invoice): string {
    const payload: InvoiceJSON = { _schema: 'invoice-creator-v1', invoice };
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
    const data = parsed._schema === 'invoice-creator-v1' ? parsed.invoice : parsed;
    if (!data || typeof data !== 'object') throw new Error('Invalid invoice JSON format');
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
