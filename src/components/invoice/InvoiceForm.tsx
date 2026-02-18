import React from 'react';
import type { Invoice } from '../../types/invoice.types';
import LogoUploader from '../branding/LogoUploader';

interface Props {
    invoice: Invoice;
    setField: (field: keyof Invoice, value: unknown) => void;
    setLogo: (v: string | null) => void;
}

const Field: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    multiline?: boolean;
    placeholder?: string;
}> = ({ label, value, onChange, type = 'text', multiline, placeholder }) => (
    <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 500 }}>
            {label}
        </label>
        {multiline ? (
            <textarea
                className="modern-input"
                rows={3}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                style={{ resize: 'vertical' }}
            />
        ) : (
            <input
                className="modern-input"
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
    </div>
);

const InvoiceForm: React.FC<Props> = ({ invoice, setField, setLogo }) => (
    <div>
        {/* Logo */}
        <div className="panel-section">
            <LogoUploader
                logo={invoice.companyLogo}
                logoScale={invoice.logoScale}
                onLogoChange={setLogo}
                onLogoScaleChange={(s) => setField('logoScale', s)}
            />
        </div>

        {/* Company Info */}
        <div className="panel-section">
            <div className="section-label">Your Company</div>
            <Field label="Company Name" value={invoice.companyName} onChange={(v) => setField('companyName', v)} placeholder="Acme Inc." />
            <Field label="Address" value={invoice.companyAddress} onChange={(v) => setField('companyAddress', v)} placeholder="123 Main St, City" multiline />
            <Field label="Phone" value={invoice.companyPhone} onChange={(v) => setField('companyPhone', v)} placeholder="+1 (555) 123-4567" />
            <Field label="Email" value={invoice.companyEmail} onChange={(v) => setField('companyEmail', v)} placeholder="hello@acme.com" type="email" />
            <Field label="Website" value={invoice.companyWebsite} onChange={(v) => setField('companyWebsite', v)} placeholder="www.acme.com" />
        </div>

        {/* Client Info */}
        <div className="panel-section">
            <div className="section-label">Bill To</div>
            <Field label="Client Name" value={invoice.clientName} onChange={(v) => setField('clientName', v)} placeholder="Client Corp" />
            <Field label="Client Address" value={invoice.clientAddress} onChange={(v) => setField('clientAddress', v)} placeholder="456 Oak Ave, Town" multiline />
            <Field label="Client Email" value={invoice.clientEmail} onChange={(v) => setField('clientEmail', v)} placeholder="client@corp.com" type="email" />
        </div>

        {/* Invoice Details */}
        <div className="panel-section">
            <div className="section-label">Invoice Details</div>
            <Field label="Invoice Number" value={invoice.invoiceNumber} onChange={(v) => setField('invoiceNumber', v)} />
            <Field label="Invoice Date" value={invoice.invoiceDate} onChange={(v) => setField('invoiceDate', v)} type="date" />
            <Field label="Due Date" value={invoice.dueDate} onChange={(v) => setField('dueDate', v)} type="date" />
            <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 500 }}>
                    Currency
                </label>
                <select
                    className="modern-input"
                    value={invoice.currency}
                    onChange={(e) => setField('currency', e.target.value)}
                    style={{ cursor: 'pointer' }}
                >
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'INR'].map((c) => (
                        <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Tax & Discount */}
        <div className="panel-section">
            <div className="section-label">Tax & Discount</div>
            <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 500 }}>Tax %</label>
                    <input
                        className="modern-input"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step={0.5}
                        value={invoice.taxRate}
                        onChange={(e) => setField('taxRate', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 500 }}>Discount %</label>
                    <input
                        className="modern-input"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step={0.5}
                        value={invoice.discountRate}
                        onChange={(e) => setField('discountRate', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>
        </div>

        {/* Notes & Terms */}
        <div className="panel-section">
            <div className="section-label">Notes & Terms</div>
            <Field label="Notes" value={invoice.notes} onChange={(v) => setField('notes', v)} multiline placeholder="Thank you for your business!" />
            <Field label="Terms" value={invoice.terms} onChange={(v) => setField('terms', v)} multiline placeholder="Payment due within 30 days." />
            <Field label="Payment Info" value={invoice.paymentInfo} onChange={(v) => setField('paymentInfo', v)} multiline placeholder="Bank: Chase &#10;Routing: 021000021 &#10;Account: 123456789" />
        </div>
    </div>
);

export default InvoiceForm;
