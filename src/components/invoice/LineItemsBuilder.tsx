import React from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import type { LineItem } from '../../types/invoice.types';

interface Props {
    items: LineItem[];
    onUpdate: (id: string, field: keyof LineItem, value: unknown) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
}

const LineItemsBuilder: React.FC<Props> = ({ items, onUpdate, onAdd, onRemove }) => (
    <div className="panel-section">
        <div className="section-label">Line Items</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((item, idx) => (
                <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 70px 90px 36px',
                        gap: 8,
                        alignItems: 'end',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.05)',
                    }}
                >
                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                            {idx === 0 ? 'Description' : ''}
                        </label>
                        <input
                            className="modern-input"
                            value={item.description}
                            placeholder="Service or product"
                            onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
                            style={{ padding: '8px 10px' }}
                        />
                    </div>

                    {/* Qty */}
                    <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                            {idx === 0 ? 'Qty' : ''}
                        </label>
                        <input
                            className="modern-input"
                            type="number"
                            min={0}
                            step={1}
                            value={item.quantity}
                            onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            style={{ padding: '8px 10px', textAlign: 'center' }}
                        />
                    </div>

                    {/* Rate */}
                    <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                            {idx === 0 ? 'Rate' : ''}
                        </label>
                        <input
                            className="modern-input"
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.rate}
                            onChange={(e) => onUpdate(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            style={{ padding: '8px 10px', textAlign: 'right' }}
                        />
                    </div>

                    {/* Remove */}
                    <button
                        className="btn btn-danger"
                        style={{ padding: '8px 8px', borderRadius: 8, marginBottom: 1 }}
                        onClick={() => onRemove(item.id)}
                        disabled={items.length <= 1}
                        title="Remove item"
                    >
                        <HiOutlineTrash size={14} />
                    </button>
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

export default LineItemsBuilder;
