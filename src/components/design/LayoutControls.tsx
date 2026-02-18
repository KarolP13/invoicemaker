import React from 'react';
import type { LayoutConfig } from '../../types/theme.types';

interface Props {
    layout: LayoutConfig;
    onChange: (updates: Partial<LayoutConfig>) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const LayoutControls: React.FC<Props> = ({ layout, onChange }) => (
    <div className="panel-section">
        <div className="section-label">Layout</div>

        {/* Border radius */}
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Corner Radius</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{layout.borderRadius}px</span>
            </div>
            <input
                type="range"
                className="modern-slider"
                min={0} max={32} step={2}
                value={layout.borderRadius}
                onChange={(e) => onChange({ borderRadius: parseInt(e.target.value) })}
            />
        </div>

        {/* Padding */}
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Card Padding</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{layout.cardPadding}px</span>
            </div>
            <input
                type="range"
                className="modern-slider"
                min={20} max={60} step={2}
                value={layout.cardPadding}
                onChange={(e) => onChange({ cardPadding: parseInt(e.target.value) })}
            />
        </div>

        {/* Spacing */}
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Spacing</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
                {(['compact', 'normal', 'airy'] as const).map((s) => (
                    <button
                        key={s}
                        className="btn btn-ghost"
                        style={{
                            flex: 1,
                            padding: '6px 0',
                            fontSize: 11,
                            textAlign: 'center',
                            justifyContent: 'center',
                            ...(layout.spacing === s
                                ? { background: 'rgba(102,126,234,0.2)', borderColor: 'rgba(102,126,234,0.4)', color: '#fff' }
                                : {}),
                        }}
                        onClick={() => onChange({ spacing: s })}
                    >
                        {capitalize(s)}
                    </button>
                ))}
            </div>
        </div>

        {/* Style */}
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Card Style</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
                {(['card', 'full-bleed'] as const).map((s) => (
                    <button
                        key={s}
                        className="btn btn-ghost"
                        style={{
                            flex: 1,
                            padding: '6px 0',
                            fontSize: 11,
                            textAlign: 'center',
                            justifyContent: 'center',
                            ...(layout.style === s
                                ? { background: 'rgba(102,126,234,0.2)', borderColor: 'rgba(102,126,234,0.4)', color: '#fff' }
                                : {}),
                        }}
                        onClick={() => onChange({ style: s })}
                    >
                        {s === 'full-bleed' ? 'Full Bleed' : 'Card'}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default LayoutControls;
