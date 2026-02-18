import { useReducer, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import type { Invoice, LineItem } from '../types/invoice.types';
import { defaultInvoice } from '../types/invoice.types';
import { calcSubtotal, calcTax, calcDiscount, calcTotal, calcLineAmount } from '../utils/calculations';

// ── Presets ──────────────────────────────────
export interface InvoicePreset {
    id: string;
    name: string;
    description: string;
    data: Partial<Invoice>;
}

export const invoicePresets: InvoicePreset[] = [
    {
        id: 'blank',
        name: 'Blank Invoice',
        description: 'Start fresh with an empty invoice',
        data: {},
    },
    {
        id: 'freelancer',
        name: 'Freelancer',
        description: 'Hourly-based freelance work invoice',
        data: {
            companyName: 'John Doe Design',
            companyAddress: '456 Creative Ave\nNew York, NY 10001',
            companyEmail: 'john@johndoedesign.com',
            companyWebsite: 'johndoedesign.com',
            companyPhone: '+1 (555) 234-5678',
            clientName: 'Startup Labs Inc.',
            clientAddress: '789 Innovation Blvd\nSan Francisco, CA 94102',
            clientEmail: 'billing@startuplabs.io',
            invoiceNumber: 'INV-2026-001',
            taxRate: 0,
            discountRate: 0,
            notes: 'Thank you for your business! Payment via bank transfer preferred.',
            terms: 'Net 30. Late payments subject to 1.5% monthly interest.',
            items: [
                { id: uuid(), description: 'UI/UX Design — Landing Page', quantity: 40, rate: 85, amount: 3400 },
                { id: uuid(), description: 'Brand Identity Package', quantity: 1, rate: 2500, amount: 2500 },
                { id: uuid(), description: 'Responsive Development', quantity: 24, rate: 95, amount: 2280 },
                { id: uuid(), description: 'Design System Documentation', quantity: 8, rate: 85, amount: 680 },
            ],
        },
    },
    {
        id: 'agency',
        name: 'Agency',
        description: 'Project-based agency invoice with retainer',
        data: {
            companyName: 'Nexus Creative Agency',
            companyAddress: '100 Agency Row, Suite 400\nLos Angeles, CA 90015',
            companyEmail: 'invoices@nexuscreative.co',
            companyWebsite: 'nexuscreative.co',
            companyPhone: '+1 (323) 555-8000',
            clientName: 'GlobalTech Corporation',
            clientAddress: '1 Enterprise Plaza\nChicago, IL 60601',
            clientEmail: 'accounts@globaltech.com',
            invoiceNumber: 'NCA-2026-0042',
            taxRate: 8.25,
            discountRate: 5,
            notes: 'This invoice covers the Q1 retainer and additional project deliverables.',
            terms: 'Payment due within 15 business days. Wire transfer or ACH accepted.',
            items: [
                { id: uuid(), description: 'Monthly Retainer — Creative Services', quantity: 3, rate: 8000, amount: 24000 },
                { id: uuid(), description: 'Video Production — Product Launch', quantity: 1, rate: 15000, amount: 15000 },
                { id: uuid(), description: 'Social Media Campaign Management', quantity: 3, rate: 3500, amount: 10500 },
                { id: uuid(), description: 'Paid Media Strategy & Optimization', quantity: 1, rate: 4500, amount: 4500 },
                { id: uuid(), description: 'Analytics Reporting & Insights', quantity: 3, rate: 1200, amount: 3600 },
            ],
        },
    },
    {
        id: 'saas',
        name: 'SaaS / Software',
        description: 'Software licensing and subscription invoice',
        data: {
            companyName: 'CloudStack Software',
            companyAddress: '200 Tech Park Drive\nAustin, TX 78701',
            companyEmail: 'billing@cloudstack.dev',
            companyWebsite: 'cloudstack.dev',
            companyPhone: '+1 (512) 555-9090',
            clientName: 'Meridian Enterprises',
            clientAddress: '55 Commerce Street\nBoston, MA 02110',
            clientEmail: 'procurement@meridian.com',
            invoiceNumber: 'CS-INV-003847',
            taxRate: 6.5,
            discountRate: 10,
            notes: 'Enterprise license includes premium support and SLA.',
            terms: 'Net 45. Auto-renewal unless cancelled 30 days prior.',
            items: [
                { id: uuid(), description: 'Enterprise Platform License (Annual)', quantity: 1, rate: 24000, amount: 24000 },
                { id: uuid(), description: 'Additional User Seats (50)', quantity: 50, rate: 180, amount: 9000 },
                { id: uuid(), description: 'Premium Support Package', quantity: 1, rate: 6000, amount: 6000 },
                { id: uuid(), description: 'Data Migration & Onboarding', quantity: 1, rate: 3500, amount: 3500 },
                { id: uuid(), description: 'Custom API Integration', quantity: 20, rate: 150, amount: 3000 },
            ],
        },
    },
    {
        id: 'consulting',
        name: 'Consulting',
        description: 'Professional consulting engagement invoice',
        data: {
            companyName: 'Summit Advisory Group',
            companyAddress: '350 Financial Center\nNew York, NY 10004',
            companyEmail: 'billing@summitadvisory.com',
            companyWebsite: 'summitadvisory.com',
            companyPhone: '+1 (212) 555-7700',
            clientName: 'Pacific Holdings LLC',
            clientAddress: '800 Harbor View\nSeattle, WA 98101',
            clientEmail: 'finance@pacificholdings.com',
            invoiceNumber: 'SAG-2026-0118',
            taxRate: 0,
            discountRate: 0,
            notes: 'Engagement as per SOW dated January 15, 2026.',
            terms: 'Net 30. Travel expenses billed at cost.',
            items: [
                { id: uuid(), description: 'Strategic Planning Workshop (2 days)', quantity: 2, rate: 5000, amount: 10000 },
                { id: uuid(), description: 'Market Analysis & Report', quantity: 1, rate: 8500, amount: 8500 },
                { id: uuid(), description: 'Executive Coaching Sessions', quantity: 6, rate: 750, amount: 4500 },
                { id: uuid(), description: 'Travel & Accommodation', quantity: 1, rate: 2200, amount: 2200 },
            ],
        },
    },
];

// ── Actions ──────────────────────────────────
type Action =
    | { type: 'SET_FIELD'; field: keyof Invoice; value: unknown }
    | { type: 'SET_LOGO'; value: string | null }
    | { type: 'ADD_ITEM' }
    | { type: 'REMOVE_ITEM'; id: string }
    | { type: 'UPDATE_ITEM'; id: string; field: keyof LineItem; value: unknown }
    | { type: 'REORDER_ITEMS'; items: LineItem[] }
    | { type: 'RECALCULATE' }
    | { type: 'LOAD_PRESET'; data: Partial<Invoice> };

// ── Reducer ──────────────────────────────────
function recalc(state: Invoice): Invoice {
    const items = state.items.map((i) => ({ ...i, amount: calcLineAmount(i) }));
    const subtotal = calcSubtotal(items);
    const taxAmount = calcTax(subtotal, state.taxRate);
    const discountAmount = calcDiscount(subtotal, state.discountRate);
    const total = calcTotal(subtotal, taxAmount, discountAmount);
    return { ...state, items, subtotal, taxAmount, discountAmount, total };
}

function reducer(state: Invoice, action: Action): Invoice {
    switch (action.type) {
        case 'SET_FIELD':
            return recalc({ ...state, [action.field]: action.value });
        case 'SET_LOGO':
            return { ...state, companyLogo: action.value };
        case 'ADD_ITEM': {
            const newItem: LineItem = { id: uuid(), description: '', quantity: 1, rate: 0, amount: 0 };
            return recalc({ ...state, items: [...state.items, newItem] });
        }
        case 'REMOVE_ITEM':
            return recalc({ ...state, items: state.items.filter((i) => i.id !== action.id) });
        case 'UPDATE_ITEM': {
            const items = state.items.map((i) =>
                i.id === action.id ? { ...i, [action.field]: action.value } : i,
            );
            return recalc({ ...state, items });
        }
        case 'REORDER_ITEMS':
            return recalc({ ...state, items: action.items });
        case 'RECALCULATE':
            return recalc(state);
        case 'LOAD_PRESET':
            return recalc({ ...defaultInvoice, ...action.data });
        default:
            return state;
    }
}

// ── Hook ─────────────────────────────────────
export function useInvoiceState() {
    const [invoice, dispatch] = useReducer(reducer, defaultInvoice, recalc);

    const setField = useCallback(
        (field: keyof Invoice, value: unknown) => dispatch({ type: 'SET_FIELD', field, value }),
        [],
    );

    const setLogo = useCallback(
        (value: string | null) => dispatch({ type: 'SET_LOGO', value }),
        [],
    );

    const addItem = useCallback(() => dispatch({ type: 'ADD_ITEM' }), []);

    const removeItem = useCallback(
        (id: string) => dispatch({ type: 'REMOVE_ITEM', id }),
        [],
    );

    const updateItem = useCallback(
        (id: string, field: keyof LineItem, value: unknown) =>
            dispatch({ type: 'UPDATE_ITEM', id, field, value }),
        [],
    );

    const loadPreset = useCallback(
        (data: Partial<Invoice>) => dispatch({ type: 'LOAD_PRESET', data }),
        [],
    );

    return { invoice, setField, setLogo, addItem, removeItem, updateItem, loadPreset };
}
