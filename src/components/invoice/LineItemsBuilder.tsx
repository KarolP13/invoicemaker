import React from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import type { LineItem } from '../../types/invoice.types';

interface Props {
    items: LineItem[];
    onUpdate: (id: string, field: keyof LineItem, value: unknown) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
}

const LineItemsBuilder: React.FC<Props> = ({ items, onUpdate, onAdd, onRemove }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    return (
        <div className="panel-section">
            <div className="section-label">Line Items</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        className="animate-fade-in"
                        style={{
                            display: isMobile ? 'flex' : 'grid',
                            flexDirection: isMobile ? 'column' : undefined,
                            gridTemplateColumns: isMobile ? undefined : '1fr 70px 90px 36px',
                            gap: 8,
                            alignItems: isMobile ? 'stretch' : 'end',
                            background: 'rgba(255,255,255,0.03)',
                            padding: isMobile ? '12px' : '10px 12px',
                            borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        {/* Description — full width on mobile */}
                        <div>
                            <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                                {idx === 0 || isMobile ? 'Description' : ''}
                            </label>
                            <input
                                className="modern-input"
                                value={item.description}
                                placeholder="Service or product"
                                onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
                                style={{ padding: '8px 10px' }}
                            />
                        </div>

                        {/* Qty + Rate + Delete — inline row on mobile */}
                        <div style={isMobile ? { display: 'flex', gap: 8, alignItems: 'end' } : undefined}>
                            {/* Qty */}
                            <div style={isMobile ? { flex: 1 } : undefined}>
                                <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                                    {idx === 0 || isMobile ? 'Qty' : ''}
                                </label>
                                <input
                                    className="modern-input"
                                    type="number"
                                    inputMode="decimal"
                                    min={0}
                                    step={1}
                                    value={item.quantity}
                                    onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                    style={{ padding: '8px 10px', textAlign: 'center' }}
                                />
                            </div>

                            {/* Rate */}
                            {!isMobile && (
                                <div style={{ gridColumn: 'auto' }}>
                                    <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                                        {idx === 0 ? 'Rate' : ''}
                                    </label>
                                    <input
                                        className="modern-input"
                                        type="number"
                                        inputMode="decimal"
                                        min={0}
                                        step={0.01}
                                        value={item.rate}
                                        onChange={(e) => onUpdate(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                        style={{ padding: '8px 10px', textAlign: 'right' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Rate on separate row for mobile, and delete */}
                        {isMobile && (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                                        Rate
                                    </label>
                                    <input
                                        className="modern-input"
                                        type="number"
                                        inputMode="decimal"
                                        min={0}
                                        step={0.01}
                                        value={item.rate}
                                        onChange={(e) => onUpdate(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                        style={{ padding: '8px 10px', textAlign: 'right' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                                        Amount
                                    </label>
                                    <div style={{
                                        padding: '8px 10px', textAlign: 'right',
                                        fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
                                        background: 'rgba(255,255,255,0.02)', borderRadius: 8,
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                    }}>
                                        ${(item.quantity * item.rate).toFixed(2)}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    style={{ padding: '8px 8px', borderRadius: 8, flexShrink: 0 }}
                                    onClick={() => onRemove(item.id)}
                                    disabled={items.length <= 1}
                                    title="Remove item"
                                >
                                    <HiOutlineTrash size={14} />
                                </button>
                            </div>
                        )}

                        {/* Remove — desktop only (mobile shown above) */}
                        {!isMobile && (
                            <button
                                className="btn btn-danger"
                                style={{ padding: '8px 8px', borderRadius: 8, marginBottom: 1 }}
                                onClick={() => onRemove(item.id)}
                                disabled={items.length <= 1}
                                title="Remove item"
                            >
                                <HiOutlineTrash size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                className="btn btn-ghost"
                style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}
                onClick={onAdd}
            >
                <HiOutlinePlus size={16} /> Add Item
            </button>
        </div>
    );
};

export default LineItemsBuilder;
