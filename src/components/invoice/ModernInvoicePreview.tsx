import React from 'react';
import type { Invoice } from '../../types/invoice.types';
import type { Theme } from '../../types/theme.types';
import { formatCurrency } from '../../utils/calculations';

interface Props {
    invoice: Invoice;
    theme: Theme;
    scale?: number;
}

const spacingMap = { compact: 16, normal: 24, airy: 32 };

// ─── Shared Helpers ───────────────────────────────
const NotesBlock: React.FC<{ invoice: Invoice; colors: Theme['colors']; typography: Theme['typography']; br: number }> = ({ invoice, colors, typography, br }) => {
    if (!invoice.notes && !invoice.terms && !invoice.paymentInfo) return null;
    return (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 20, marginTop: 'auto' }}>
            {invoice.notes && (
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.textSecondary, marginBottom: 4 }}>Notes</div>
                    <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, whiteSpace: 'pre-line' }}>{invoice.notes}</div>
                </div>
            )}
            {invoice.terms && (
                <div style={{ marginBottom: invoice.paymentInfo ? 12 : 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.textSecondary, marginBottom: 4 }}>Terms & Conditions</div>
                    <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, whiteSpace: 'pre-line' }}>{invoice.terms}</div>
                </div>
            )}
            {invoice.paymentInfo && (
                <div>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.textSecondary, marginBottom: 4 }}>Payment Information</div>
                    <div style={{
                        fontSize: typography.baseFontSize - 1, color: colors.textSecondary, whiteSpace: 'pre-line',
                        padding: '10px 12px', background: colors.tableAltRow || 'rgba(0,0,0,0.02)',
                        borderRadius: Math.max(br - 6, 4), border: `1px solid ${colors.border}`,
                    }}>{invoice.paymentInfo}</div>
                </div>
            )}
        </div>
    );
};

const TotalsBlock: React.FC<{ invoice: Invoice; colors: Theme['colors']; typography: Theme['typography']; headingStyle: React.CSSProperties }> = ({ invoice, colors, typography, headingStyle }) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <div style={{ width: 260 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: typography.baseFontSize, color: colors.textSecondary }}>
                <span>Subtotal</span>
                <span style={{ color: colors.textPrimary }}>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.taxRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: typography.baseFontSize, color: colors.textSecondary }}>
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span style={{ color: colors.textPrimary }}>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                </div>
            )}
            {invoice.discountRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: typography.baseFontSize, color: colors.textSecondary }}>
                    <span>Discount ({invoice.discountRate}%)</span>
                    <span style={{ color: colors.textPrimary }}>-{formatCurrency(invoice.discountAmount, invoice.currency)}</span>
                </div>
            )}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0 6px', marginTop: 6,
                borderTop: `2px solid ${colors.accent}`,
                ...headingStyle, fontSize: typography.baseFontSize + 4,
            }}>
                <span>Total</span>
                <span style={{ color: colors.accent }}>{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
        </div>
    </div>
);

const LogoImg: React.FC<{ logo: string; maxH: number; maxW: number; mb?: number }> = ({ logo, maxH, maxW, mb = 12 }) => (
    <img src={logo} alt="Logo" style={{ maxHeight: maxH, maxWidth: maxW, objectFit: 'contain', marginBottom: mb }} />
);

// ─── TEMPLATE: Brutalist ──────────────────────────
const BrutalistTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ padding: 36, fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, color: colors.textPrimary, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em`, background: colors.cardBg, minHeight: 1123, display: 'flex', flexDirection: 'column' }}>
            {/* Black header bar */}
            <div style={{ background: '#1a1a1a', margin: '-36px -36px 32px', padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {invoice.companyLogo && <LogoImg logo={invoice.companyLogo} maxH={Math.min(logoMaxH, 48)} maxW={Math.min(logoMaxW, 140)} mb={0} />}
                    <div style={{ ...headingStyle, fontSize: 22, color: '#ffffff' }}>{invoice.companyName || 'Your Company'}</div>
                </div>
                <div style={{ ...headingStyle, fontSize: 28, color: '#ffffff', letterSpacing: '0.1em' }}>INVOICE</div>
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28, gap: 20, flexWrap: 'wrap' }}>
                <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>
                    {invoice.companyAddress}
                    {invoice.companyPhone && `\n${invoice.companyPhone}`}
                    {invoice.companyEmail && `\n${invoice.companyEmail}`}
                </div>
                <div style={{ textAlign: 'right', fontSize: typography.baseFontSize - 1, color: colors.textSecondary, lineHeight: 1.8 }}>
                    <div><strong style={{ color: colors.textPrimary }}>Invoice #:</strong> {invoice.invoiceNumber}</div>
                    <div><strong style={{ color: colors.textPrimary }}>Date:</strong> {invoice.invoiceDate}</div>
                    <div><strong style={{ color: colors.textPrimary }}>Due:</strong> {invoice.dueDate}</div>
                </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: 28, padding: 20, background: '#1a1a1a', border: 'none' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Bill To</div>
                <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 1, color: '#ffffff', marginBottom: 4 }}>{invoice.clientName || 'Client Name'}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                {invoice.clientEmail && <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: typography.baseFontSize - 1, marginTop: 2 }}>{invoice.clientEmail}</div>}
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
                <thead><tr>
                    <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 700, textAlign: 'left', background: '#1a1a1a', color: '#fff', borderBottom: `3px solid ${colors.accentSecondary}` }}>Description</th>
                    <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 700, textAlign: 'center', width: 70, background: '#1a1a1a', color: '#fff', borderBottom: `3px solid ${colors.accentSecondary}` }}>Qty</th>
                    <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 700, textAlign: 'right', width: 100, background: '#1a1a1a', color: '#fff', borderBottom: `3px solid ${colors.accentSecondary}` }}>Rate</th>
                    <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 700, textAlign: 'right', width: 110, background: '#1a1a1a', color: '#fff', borderBottom: `3px solid ${colors.accentSecondary}` }}>Amount</th>
                </tr></thead>
                <tbody>{invoice.items.map((item, idx) => (
                    <tr key={item.id} style={idx % 2 === 1 ? { background: colors.tableAltRow } : {}}>
                        <td style={{ padding: '10px 12px', borderBottom: `1px solid ${colors.border}` }}>{item.description || '—'}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.rate, invoice.currency)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                    </tr>
                ))}</tbody>
            </table>

            <div style={{ flex: 1 }} />
            <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
            <NotesBlock invoice={invoice} colors={colors} typography={typography} br={0} />
        </div>
    );
};

// ─── TEMPLATE: Executive ──────────────────────────
const ExecutiveTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ padding: 48, fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, color: colors.textPrimary, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em`, background: colors.cardBg, minHeight: 1123, display: 'flex', flexDirection: 'column' }}>
            {/* Centered header */}
            <div style={{ textAlign: 'center', marginBottom: 36, borderBottom: `2px solid ${colors.accent}`, paddingBottom: 28 }}>
                {invoice.companyLogo && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><LogoImg logo={invoice.companyLogo} maxH={logoMaxH} maxW={logoMaxW} /></div>}
                <div style={{ ...headingStyle, fontSize: 24, marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</div>
                <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1 }}>
                    {invoice.companyAddress}{invoice.companyPhone ? ` • ${invoice.companyPhone}` : ''}{invoice.companyEmail ? ` • ${invoice.companyEmail}` : ''}
                </div>
            </div>

            {/* Invoice title + meta in elegant layout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
                <div>
                    <div style={{ ...headingStyle, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.15em', color: colors.accent, marginBottom: 8 }}>Invoice</div>
                    <div style={{ fontSize: typography.baseFontSize, color: colors.textSecondary, lineHeight: 1.8 }}>
                        <div># {invoice.invoiceNumber}</div>
                        <div>Date: {invoice.invoiceDate}</div>
                        <div>Due: {invoice.dueDate}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ ...headingStyle, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.15em', color: colors.accent, marginBottom: 8 }}>Bill To</div>
                    <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 1, marginBottom: 4 }}>{invoice.clientName || 'Client Name'}</div>
                    <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                    {invoice.clientEmail && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1 }}>{invoice.clientEmail}</div>}
                </div>
            </div>

            {/* Table with elegant borders */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
                <thead><tr style={{ borderTop: `2px solid ${colors.accent}`, borderBottom: `1px solid ${colors.accent}` }}>
                    <th style={{ padding: '12px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', color: colors.accent }}>Description</th>
                    <th style={{ padding: '12px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', width: 70, color: colors.accent }}>Qty</th>
                    <th style={{ padding: '12px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right', width: 100, color: colors.accent }}>Rate</th>
                    <th style={{ padding: '12px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right', width: 110, color: colors.accent }}>Amount</th>
                </tr></thead>
                <tbody>{invoice.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ padding: '12px 0' }}>{item.description || '—'}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                    </tr>
                ))}</tbody>
            </table>

            <div style={{ flex: 1 }} />
            <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
            <NotesBlock invoice={invoice} colors={colors} typography={typography} br={0} />
        </div>
    );
};

// ─── TEMPLATE: Midnight Pro ───────────────────────
const MidnightTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ display: 'flex', minHeight: 1123, fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em` }}>
            {/* Left accent strip */}
            <div style={{ width: 6, background: `linear-gradient(180deg, ${colors.accent}, ${colors.accentSecondary})`, flexShrink: 0 }} />

            {/* Main content on dark background */}
            <div style={{ flex: 1, padding: 40, background: colors.cardBg, color: colors.textPrimary, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 20 }}>
                    <div>
                        {invoice.companyLogo && <LogoImg logo={invoice.companyLogo} maxH={logoMaxH} maxW={logoMaxW} />}
                        <div style={{ ...headingStyle, fontSize: 20, marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</div>
                        <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>
                            {invoice.companyAddress}
                            {invoice.companyPhone && `\n${invoice.companyPhone}`}
                            {invoice.companyEmail && `\n${invoice.companyEmail}`}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ ...headingStyle, fontSize: 32, color: colors.accent, marginBottom: 12, letterSpacing: '0.05em' }}>INVOICE</div>
                        <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, lineHeight: 1.8 }}>
                            <div><span style={{ color: colors.accent }}>#{invoice.invoiceNumber}</span></div>
                            <div>{invoice.invoiceDate}</div>
                            <div>Due: {invoice.dueDate}</div>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div style={{ marginBottom: 28, padding: 20, background: colors.tableHeaderBg, borderLeft: `3px solid ${colors.accent}` }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.accent, marginBottom: 6 }}>Bill To</div>
                    <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 1, marginBottom: 4 }}>{invoice.clientName || 'Client Name'}</div>
                    <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                    {invoice.clientEmail && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>{invoice.clientEmail}</div>}
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
                    <thead><tr>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'left', color: colors.accent, borderBottom: `1px solid ${colors.border}` }}>Description</th>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'center', width: 70, color: colors.accent, borderBottom: `1px solid ${colors.border}` }}>Qty</th>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'right', width: 100, color: colors.accent, borderBottom: `1px solid ${colors.border}` }}>Rate</th>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'right', width: 110, color: colors.accent, borderBottom: `1px solid ${colors.border}` }}>Amount</th>
                    </tr></thead>
                    <tbody>{invoice.items.map((item, idx) => (
                        <tr key={item.id} style={idx % 2 === 1 ? { background: colors.tableAltRow } : {}}>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${colors.border}` }}>{item.description || '—'}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.rate, invoice.currency)}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500, borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                        </tr>
                    ))}</tbody>
                </table>

                <div style={{ flex: 1 }} />
                <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
                <NotesBlock invoice={invoice} colors={colors} typography={typography} br={0} />
            </div>
        </div>
    );
};

// ─── TEMPLATE: Clean Minimal ──────────────────────
const MinimalTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ padding: 52, fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, color: colors.textPrimary, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em`, background: colors.cardBg, minHeight: 1123, display: 'flex', flexDirection: 'column' }}>
            {/* Ultra-minimal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
                <div>
                    {invoice.companyLogo && <LogoImg logo={invoice.companyLogo} maxH={logoMaxH} maxW={logoMaxW} />}
                    <div style={{ ...headingStyle, fontSize: 16, marginBottom: 8 }}>{invoice.companyName || 'Your Company'}</div>
                    <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 2, whiteSpace: 'pre-line' }}>
                        {invoice.companyAddress}
                        {invoice.companyPhone && `\n${invoice.companyPhone}`}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ ...headingStyle, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.textSecondary, marginBottom: 12 }}>Invoice</div>
                    <div style={{ fontSize: 28, fontWeight: 300, color: colors.textPrimary, marginBottom: 8 }}>{invoice.invoiceNumber}</div>
                    <div style={{ fontSize: typography.baseFontSize - 2, color: colors.textSecondary }}>{invoice.invoiceDate} — Due {invoice.dueDate}</div>
                </div>
            </div>

            {/* Bill To — just text, no box */}
            <div style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em', color: colors.textSecondary, marginBottom: 8 }}>Billed To</div>
                <div style={{ ...headingStyle, fontSize: typography.baseFontSize, marginBottom: 2 }}>{invoice.clientName || 'Client Name'}</div>
                <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                {invoice.clientEmail && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>{invoice.clientEmail}</div>}
            </div>

            {/* Table — hairline borders only */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 36 }}>
                <thead><tr>
                    <th style={{ padding: '8px 0', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'left', color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Description</th>
                    <th style={{ padding: '8px 0', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', width: 60, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Qty</th>
                    <th style={{ padding: '8px 0', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'right', width: 90, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Rate</th>
                    <th style={{ padding: '8px 0', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'right', width: 100, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Amount</th>
                </tr></thead>
                <tbody>{invoice.items.map((item) => (
                    <tr key={item.id}>
                        <td style={{ padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>{item.description || '—'}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.rate, invoice.currency)}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 500, borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                    </tr>
                ))}</tbody>
            </table>

            <div style={{ flex: 1 }} />
            <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
            <NotesBlock invoice={invoice} colors={colors} typography={typography} br={0} />
        </div>
    );
};

// ─── TEMPLATE: Corporate Classic ──────────────────
const ClassicTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, color: colors.textPrimary, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em`, background: colors.cardBg, minHeight: 1123, display: 'flex', flexDirection: 'column' }}>
            {/* Blue header banner */}
            <div style={{ background: colors.accent, padding: '32px 40px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {invoice.companyLogo && <LogoImg logo={invoice.companyLogo} maxH={Math.min(logoMaxH, 44)} maxW={Math.min(logoMaxW, 140)} mb={0} />}
                    <div>
                        <div style={{ ...headingStyle, fontSize: 20, marginBottom: 2 }}>{invoice.companyName || 'Your Company'}</div>
                        <div style={{ fontSize: typography.baseFontSize - 2, opacity: 0.8 }}>{invoice.companyEmail}{invoice.companyPhone ? ` • ${invoice.companyPhone}` : ''}</div>
                    </div>
                </div>
                <div style={{ ...headingStyle, fontSize: 32, letterSpacing: '0.08em' }}>INVOICE</div>
            </div>

            {/* Content */}
            <div style={{ padding: '32px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Meta + Bill To side by side */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 24 }}>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.accent, marginBottom: 8 }}>Invoice Details</div>
                        <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, lineHeight: 1.8 }}>
                            <div><strong>Number:</strong> {invoice.invoiceNumber}</div>
                            <div><strong>Date:</strong> {invoice.invoiceDate}</div>
                            <div><strong>Due Date:</strong> {invoice.dueDate}</div>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.accent, marginBottom: 8 }}>Bill To</div>
                        <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 1, marginBottom: 4 }}>{invoice.clientName || 'Client Name'}</div>
                        <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                        {invoice.clientEmail && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>{invoice.clientEmail}</div>}
                    </div>
                </div>

                {/* Table with blue header */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
                    <thead><tr>
                        <th style={{ padding: '12px 14px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'left', background: colors.accent, color: '#ffffff', borderRadius: '4px 0 0 0' }}>Description</th>
                        <th style={{ padding: '12px 14px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'center', width: 70, background: colors.accent, color: '#ffffff' }}>Qty</th>
                        <th style={{ padding: '12px 14px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'right', width: 100, background: colors.accent, color: '#ffffff' }}>Rate</th>
                        <th style={{ padding: '12px 14px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'right', width: 110, background: colors.accent, color: '#ffffff', borderRadius: '0 4px 0 0' }}>Amount</th>
                    </tr></thead>
                    <tbody>{invoice.items.map((item, idx) => (
                        <tr key={item.id} style={idx % 2 === 1 ? { background: colors.tableAltRow } : {}}>
                            <td style={{ padding: '12px 14px', borderBottom: `1px solid ${colors.border}` }}>{item.description || '—'}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.rate, invoice.currency)}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 500, borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                        </tr>
                    ))}</tbody>
                </table>

                <div style={{ flex: 1 }} />
                <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
                <NotesBlock invoice={invoice} colors={colors} typography={typography} br={4} />
            </div>
        </div>
    );
};

// ─── TEMPLATE: Tech Startup ──────────────────────
const TechTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ padding: 40, fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, color: colors.textPrimary, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em`, background: colors.cardBg, minHeight: 1123, display: 'flex', flexDirection: 'column' }}>
            {/* Header with accent top bar */}
            <div style={{ borderTop: `4px solid ${colors.accent}`, margin: '-40px -40px 32px', padding: '28px 40px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                    <div>
                        {invoice.companyLogo && <LogoImg logo={invoice.companyLogo} maxH={logoMaxH} maxW={logoMaxW} />}
                        <div style={{ ...headingStyle, fontSize: 18, marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</div>
                        <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 2, whiteSpace: 'pre-line' }}>
                            {invoice.companyAddress}{invoice.companyPhone ? ` • ${invoice.companyPhone}` : ''}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-block', background: colors.accent, color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>INVOICE</div>
                        <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: typography.baseFontSize - 1, color: colors.textSecondary, lineHeight: 1.8 }}>
                            <div>{invoice.invoiceNumber}</div>
                            <div>{invoice.invoiceDate}</div>
                            <div>Due: {invoice.dueDate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To with accent dot */}
            <div style={{ marginBottom: 28, padding: '16px 20px', border: `1px solid ${colors.border}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.accent }} />
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.accent }}>Bill To</div>
                </div>
                <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 1, marginBottom: 4 }}>{invoice.clientName || 'Client Name'}</div>
                <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                {invoice.clientEmail && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>{invoice.clientEmail}</div>}
            </div>

            {/* Table with dotted borders */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
                <thead><tr>
                    <th style={{ padding: '10px 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', color: colors.accent, borderBottom: `2px dotted ${colors.accent}` }}>Description</th>
                    <th style={{ padding: '10px 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', width: 70, color: colors.accent, borderBottom: `2px dotted ${colors.accent}` }}>Qty</th>
                    <th style={{ padding: '10px 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right', width: 100, color: colors.accent, borderBottom: `2px dotted ${colors.accent}` }}>Rate</th>
                    <th style={{ padding: '10px 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right', width: 110, color: colors.accent, borderBottom: `2px dotted ${colors.accent}` }}>Amount</th>
                </tr></thead>
                <tbody>{invoice.items.map((item, idx) => (
                    <tr key={item.id} style={idx % 2 === 1 ? { background: colors.tableAltRow } : {}}>
                        <td style={{ padding: '10px 12px', borderBottom: `1px dotted ${colors.border}` }}>{item.description || '—'}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: `1px dotted ${colors.border}` }}>{item.quantity}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: `1px dotted ${colors.border}` }}>{formatCurrency(item.rate, invoice.currency)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: `1px dotted ${colors.border}` }}>
                            <span style={{ background: `${colors.accent}15`, padding: '2px 10px', borderRadius: 12, fontWeight: 600, color: colors.accent }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</span>
                        </td>
                    </tr>
                ))}</tbody>
            </table>

            <div style={{ flex: 1 }} />
            <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
            <NotesBlock invoice={invoice} colors={colors} typography={typography} br={8} />
        </div>
    );
};

// ─── TEMPLATE: Elegant ────────────────────────────
const ElegantTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ padding: 48, fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, color: colors.textPrimary, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em`, background: colors.cardBg, minHeight: 1123, display: 'flex', flexDirection: 'column' }}>
            {/* Accent top border only */}
            <div style={{ borderTop: `3px solid ${colors.accent}`, margin: '-48px -48px 36px', padding: '36px 48px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                    <div>
                        {invoice.companyLogo && <LogoImg logo={invoice.companyLogo} maxH={logoMaxH} maxW={logoMaxW} />}
                        <div style={{ ...headingStyle, fontSize: 26, marginBottom: 4, fontStyle: 'normal' }}>{invoice.companyName || 'Your Company'}</div>
                        <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, fontStyle: 'italic' }}>
                            {invoice.companyAddress}
                        </div>
                        {invoice.companyPhone && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, fontStyle: 'italic' }}>{invoice.companyPhone}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ ...headingStyle, fontSize: 36, color: colors.accent, marginBottom: 8, fontStyle: 'italic' }}>Invoice</div>
                        <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, lineHeight: 1.8 }}>
                            <div>No. {invoice.invoiceNumber}</div>
                            <div>{invoice.invoiceDate}</div>
                            <div>Due {invoice.dueDate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: colors.border, marginBottom: 28 }} />

            {/* Bill To */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: colors.accent, marginBottom: 8, fontStyle: 'normal' }}>Bill To</div>
                <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 2, marginBottom: 4 }}>{invoice.clientName || 'Client Name'}</div>
                <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, fontStyle: 'italic', whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                {invoice.clientEmail && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, fontStyle: 'italic', marginTop: 2 }}>{invoice.clientEmail}</div>}
            </div>

            {/* Table — minimal elegant */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
                <thead><tr style={{ borderBottom: `2px solid ${colors.accent}` }}>
                    <th style={{ padding: '10px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', color: colors.accent }}>Description</th>
                    <th style={{ padding: '10px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', width: 70, color: colors.accent }}>Qty</th>
                    <th style={{ padding: '10px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right', width: 100, color: colors.accent }}>Rate</th>
                    <th style={{ padding: '10px 0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right', width: 110, color: colors.accent }}>Amount</th>
                </tr></thead>
                <tbody>{invoice.items.map((item, idx) => (
                    <tr key={item.id} style={idx % 2 === 1 ? { background: colors.tableAltRow } : {}}>
                        <td style={{ padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>{item.description || '—'}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.rate, invoice.currency)}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 500, borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                    </tr>
                ))}</tbody>
            </table>

            <div style={{ flex: 1 }} />
            <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
            <NotesBlock invoice={invoice} colors={colors} typography={typography} br={0} />
        </div>
    );
};

// ─── TEMPLATE: Fresh Modern ──────────────────────
const FreshTemplate: React.FC<{ invoice: Invoice; theme: Theme }> = ({ invoice, theme }) => {
    const { colors, typography } = theme;
    const headingStyle: React.CSSProperties = { fontFamily: typography.headingFontFamily, fontWeight: typography.headingWeight };
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ display: 'flex', minHeight: 1123, fontFamily: typography.fontFamily, fontSize: typography.baseFontSize, lineHeight: typography.lineHeight, letterSpacing: `${typography.letterSpacing}em` }}>
            {/* Left accent sidebar */}
            <div style={{ width: 56, background: `linear-gradient(180deg, ${colors.accent}, ${colors.accentSecondary})`, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 36 }}>
                <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7, transform: 'rotate(180deg)' }}>INVOICE</div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: 40, background: colors.cardBg, color: colors.textPrimary, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 20 }}>
                    <div>
                        {invoice.companyLogo && <LogoImg logo={invoice.companyLogo} maxH={logoMaxH} maxW={logoMaxW} />}
                        <div style={{ ...headingStyle, fontSize: 20, marginBottom: 4 }}>{invoice.companyName || 'Your Company'}</div>
                        <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>
                            {invoice.companyAddress}
                            {invoice.companyPhone && `\n${invoice.companyPhone}`}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ ...headingStyle, fontSize: 14, color: colors.accent, marginBottom: 4 }}># {invoice.invoiceNumber}</div>
                        <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, lineHeight: 1.8 }}>
                            <div>{invoice.invoiceDate}</div>
                            <div>Due: {invoice.dueDate}</div>
                        </div>
                    </div>
                </div>

                {/* Bill To with colored left bar */}
                <div style={{ marginBottom: 28, padding: '16px 20px', borderLeft: `4px solid ${colors.accent}`, background: colors.tableAltRow }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.accent, marginBottom: 6 }}>Bill To</div>
                    <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 1, marginBottom: 4 }}>{invoice.clientName || 'Client Name'}</div>
                    <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>{invoice.clientAddress}</div>
                    {invoice.clientEmail && <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>{invoice.clientEmail}</div>}
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
                    <thead><tr>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'left', background: colors.tableHeaderBg, color: colors.accent, borderBottom: `2px solid ${colors.accent}` }}>Description</th>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'center', width: 70, background: colors.tableHeaderBg, color: colors.accent, borderBottom: `2px solid ${colors.accent}` }}>Qty</th>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'right', width: 100, background: colors.tableHeaderBg, color: colors.accent, borderBottom: `2px solid ${colors.accent}` }}>Rate</th>
                        <th style={{ padding: '10px 12px', fontSize: typography.baseFontSize - 1, fontWeight: 600, textAlign: 'right', width: 110, background: colors.tableHeaderBg, color: colors.accent, borderBottom: `2px solid ${colors.accent}` }}>Amount</th>
                    </tr></thead>
                    <tbody>{invoice.items.map((item, idx) => (
                        <tr key={item.id} style={idx % 2 === 1 ? { background: colors.tableAltRow } : {}}>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${colors.border}` }}>{item.description || '—'}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.rate, invoice.currency)}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500, borderBottom: `1px solid ${colors.border}` }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                        </tr>
                    ))}</tbody>
                </table>

                <div style={{ flex: 1 }} />
                <TotalsBlock invoice={invoice} colors={colors} typography={typography} headingStyle={headingStyle} />
                <NotesBlock invoice={invoice} colors={colors} typography={typography} br={0} />
            </div>
        </div>
    );
};

// ─── Template Router ─────────────────────────────
const templateMap: Record<string, React.FC<{ invoice: Invoice; theme: Theme }>> = {
    brutalist: BrutalistTemplate,
    executive: ExecutiveTemplate,
    midnight: MidnightTemplate,
    minimal: MinimalTemplate,
    classic: ClassicTemplate,
    tech: TechTemplate,
    elegant: ElegantTemplate,
    fresh: FreshTemplate,
};

const ModernInvoicePreview: React.FC<Props> = ({ invoice, theme, scale = 1 }) => {
    const { layout } = theme;
    const sp = spacingMap[layout.spacing];
    const isCard = layout.style === 'card';
    const br = isCard ? layout.borderRadius : 0;

    const TemplateComponent = templateMap[theme.templateId] || BrutalistTemplate;

    return (
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.3s ease' }}>
            <div className="invoice-page" style={{ borderRadius: isCard ? br + 4 : 0 }}>
                {/* For card mode, add padding and shadow */}
                {isCard ? (
                    <div className="invoice-content" style={{ padding: sp + 8 }}>
                        <div style={{
                            borderRadius: br,
                            boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
                            overflow: 'hidden',
                            border: `1px solid ${theme.colors.border}`,
                        }}>
                            <TemplateComponent invoice={invoice} theme={theme} />
                        </div>
                    </div>
                ) : (
                    <div className="invoice-content">
                        <TemplateComponent invoice={invoice} theme={theme} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernInvoicePreview;
