import React from 'react';
import type { Invoice } from '../../types/invoice.types';
import type { Theme } from '../../types/theme.types';
import { formatCurrency } from '../../utils/calculations';

interface Props {
    invoice: Invoice;
    theme: Theme;
    scale?: number;
}

const shadowMap = {
    soft: '0 4px 24px rgba(0,0,0,0.08)',
    medium: '0 8px 40px rgba(0,0,0,0.14)',
    strong: '0 16px 64px rgba(0,0,0,0.22)',
};

const spacingMap = { compact: 16, normal: 24, airy: 32 };

const ModernInvoicePreview: React.FC<Props> = ({ invoice, theme, scale = 1 }) => {
    const { colors, typography, layout, effects } = theme;
    const sp = spacingMap[layout.spacing];

    const gradientBg =
        colors.gradientStops.length >= 2
            ? `linear-gradient(${effects.gradientAngle}deg, ${colors.gradientStops.join(', ')})`
            : colors.gradientStops[0] || '#f5f5f5';

    const cardPad = layout.cardPadding;
    const isCard = layout.style === 'card';
    const br = isCard ? layout.borderRadius : 0;

    const cardStyle: React.CSSProperties = {
        background: colors.cardBg,
        borderRadius: br,
        padding: cardPad,
        boxShadow: isCard ? shadowMap[effects.shadowDepth] : 'none',
        fontFamily: typography.fontFamily,
        fontSize: typography.baseFontSize,
        lineHeight: typography.lineHeight,
        letterSpacing: `${typography.letterSpacing}em`,
        color: colors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        minHeight: isCard ? 'calc(1123px - ' + (sp + 8) * 2 + 'px)' : '1123px',
        ...(effects.blurStrength > 0 && colors.cardBg.includes('rgba')
            ? { backdropFilter: `blur(${effects.blurStrength}px)`, WebkitBackdropFilter: `blur(${effects.blurStrength}px)` }
            : {}),
        border: `1px solid ${colors.border}`,
    };

    const headingStyle: React.CSSProperties = {
        fontFamily: typography.headingFontFamily,
        fontWeight: typography.headingWeight,
        letterSpacing: `${typography.letterSpacing}em`,
    };

    const isBrutalist = theme.id === 'modern-brutalist';

    const thStyle: React.CSSProperties = {
        padding: '10px 12px',
        fontSize: typography.baseFontSize - 1,
        fontWeight: 600,
        textAlign: 'left',
        background: colors.tableHeaderBg,
        color: isBrutalist ? '#ffffff' : colors.textSecondary,
        borderBottom: `1px solid ${colors.border}`,
    };

    const tdStyle: React.CSSProperties = {
        padding: '10px 12px',
        fontSize: typography.baseFontSize,
        borderBottom: `1px solid ${colors.border}`,
        verticalAlign: 'top',
    };

    // Scale the logo
    const logoMaxH = 48 * (invoice.logoScale || 1);
    const logoMaxW = 160 * (invoice.logoScale || 1);

    return (
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.3s ease' }}>
            <div className="invoice-page" style={{ borderRadius: isCard ? br + 4 : 0 }}>
                {/* Background */}
                <div className="invoice-bg" style={{ background: gradientBg }}>
                    {effects.grainIntensity > 0 && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            opacity: effects.grainIntensity,
                            filter: 'url(#grain-filter)',
                            mixBlendMode: 'overlay',
                            width: '200%', height: '200%',
                        }} />
                    )}
                </div>

                {/* Content */}
                <div className="invoice-content" style={{ padding: isCard ? sp + 8 : 0 }}>
                    <div style={cardStyle}>
                        {/* ── Header ── */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            marginBottom: sp * 1.5, flexWrap: 'wrap', gap: sp,
                        }}>
                            {/* Left: logo + company */}
                            <div style={{ maxWidth: '55%' }}>
                                {invoice.companyLogo && (
                                    <img
                                        src={invoice.companyLogo}
                                        alt="Logo"
                                        style={{ maxHeight: logoMaxH, maxWidth: logoMaxW, objectFit: 'contain', marginBottom: 12 }}
                                    />
                                )}
                                <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 6, marginBottom: 4 }}>
                                    {invoice.companyName || 'Your Company'}
                                </div>
                                <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>
                                    {invoice.companyAddress}
                                </div>
                                {invoice.companyPhone && (
                                    <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>
                                        {invoice.companyPhone}
                                    </div>
                                )}
                                {invoice.companyEmail && (
                                    <div style={{ color: colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>
                                        {invoice.companyEmail}
                                    </div>
                                )}
                                {invoice.companyWebsite && (
                                    <div style={{ color: colors.accent, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>
                                        {invoice.companyWebsite}
                                    </div>
                                )}
                            </div>

                            {/* Right: invoice title + details */}
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    ...headingStyle, fontSize: typography.baseFontSize + 14,
                                    color: colors.accent, marginBottom: 12, fontWeight: typography.headingWeight,
                                }}>
                                    INVOICE
                                </div>
                                <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, lineHeight: 1.8 }}>
                                    <div><strong style={{ color: colors.textPrimary }}>Invoice #:</strong> {invoice.invoiceNumber}</div>
                                    <div><strong style={{ color: colors.textPrimary }}>Date:</strong> {invoice.invoiceDate}</div>
                                    <div><strong style={{ color: colors.textPrimary }}>Due:</strong> {invoice.dueDate}</div>
                                </div>
                            </div>
                        </div>

                        {/* ── Bill To ── */}
                        <div style={{
                            marginBottom: sp * 1.5, padding: sp * 0.75,
                            background: colors.tableHeaderBg,
                            borderRadius: Math.max(br - 4, 0),
                        }}>
                            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: isBrutalist ? 'rgba(255,255,255,0.5)' : colors.textSecondary, marginBottom: 6 }}>
                                Bill To
                            </div>
                            <div style={{ ...headingStyle, fontSize: typography.baseFontSize + 1, marginBottom: 4, color: isBrutalist ? '#ffffff' : colors.textPrimary }}>
                                {invoice.clientName || 'Client Name'}
                            </div>
                            <div style={{ color: isBrutalist ? 'rgba(255,255,255,0.7)' : colors.textSecondary, fontSize: typography.baseFontSize - 1, whiteSpace: 'pre-line' }}>
                                {invoice.clientAddress}
                            </div>
                            {invoice.clientEmail && (
                                <div style={{ color: isBrutalist ? 'rgba(255,255,255,0.7)' : colors.textSecondary, fontSize: typography.baseFontSize - 1, marginTop: 2 }}>
                                    {invoice.clientEmail}
                                </div>
                            )}
                        </div>

                        {/* ── Table ── */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: sp * 1.5 }}>
                            <thead>
                                <tr>
                                    <th style={{ ...thStyle, borderTopLeftRadius: Math.max(br - 8, 0) }}>Description</th>
                                    <th style={{ ...thStyle, textAlign: 'center', width: 70 }}>Qty</th>
                                    <th style={{ ...thStyle, textAlign: 'right', width: 100 }}>Rate</th>
                                    <th style={{ ...thStyle, textAlign: 'right', width: 110, borderTopRightRadius: Math.max(br - 8, 0) }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, idx) => (
                                    <tr key={item.id} style={idx % 2 === 1 ? { background: colors.tableAltRow } : {}}>
                                        <td style={tdStyle}>{item.description || '—'}</td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 500 }}>
                                            {formatCurrency(item.quantity * item.rate, invoice.currency)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ── Spacer to push totals toward bottom ── */}
                        <div style={{ flex: 1 }} />

                        {/* ── Totals ── */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: sp * 1.5 }}>
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

                        {/* ── Notes & Terms ── */}
                        {(invoice.notes || invoice.terms || invoice.paymentInfo) && (
                            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: sp }}>
                                {invoice.notes && (
                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.textSecondary, marginBottom: 4 }}>
                                            Notes
                                        </div>
                                        <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, whiteSpace: 'pre-line' }}>
                                            {invoice.notes}
                                        </div>
                                    </div>
                                )}
                                {invoice.terms && (
                                    <div style={{ marginBottom: invoice.paymentInfo ? 12 : 0 }}>
                                        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.textSecondary, marginBottom: 4 }}>
                                            Terms & Conditions
                                        </div>
                                        <div style={{ fontSize: typography.baseFontSize - 1, color: colors.textSecondary, whiteSpace: 'pre-line' }}>
                                            {invoice.terms}
                                        </div>
                                    </div>
                                )}
                                {invoice.paymentInfo && (
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.textSecondary, marginBottom: 4 }}>
                                            Payment Information
                                        </div>
                                        <div style={{
                                            fontSize: typography.baseFontSize - 1, color: colors.textSecondary, whiteSpace: 'pre-line',
                                            padding: '10px 12px', background: colors.tableAltRow || 'rgba(0,0,0,0.02)',
                                            borderRadius: Math.max(br - 6, 4), border: `1px solid ${colors.border}`,
                                        }}>
                                            {invoice.paymentInfo}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Glow border effect */}
                {effects.glowIntensity > 0 && (
                    <div style={{
                        position: 'absolute', inset: -2,
                        borderRadius: br + 6,
                        border: `1px solid ${colors.accent}`,
                        opacity: effects.glowIntensity * 0.4,
                        boxShadow: `0 0 ${20 * effects.glowIntensity}px ${colors.accent}, inset 0 0 ${20 * effects.glowIntensity}px ${colors.accent}`,
                        pointerEvents: 'none',
                    }} />
                )}
            </div>
        </div>
    );
};

export default ModernInvoicePreview;
