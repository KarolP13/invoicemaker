import type { LineItem } from '../types/invoice.types';

export function calcLineAmount(item: LineItem): number {
    return +(item.quantity * item.rate).toFixed(2);
}

export function calcSubtotal(items: LineItem[]): number {
    return +items.reduce((sum, i) => sum + i.quantity * i.rate, 0).toFixed(2);
}

export function calcTax(subtotal: number, rate: number): number {
    return +(subtotal * rate / 100).toFixed(2);
}

export function calcDiscount(subtotal: number, rate: number): number {
    return +(subtotal * rate / 100).toFixed(2);
}

export function calcTotal(subtotal: number, tax: number, discount: number): number {
    return +(subtotal + tax - discount).toFixed(2);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
