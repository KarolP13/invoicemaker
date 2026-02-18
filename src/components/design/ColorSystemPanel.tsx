import React from 'react';
import type { ColorScheme } from '../../types/theme.types';

interface Props {
    colors: ColorScheme;
    onChange: (updates: Partial<ColorScheme>) => void;
}

const ColorInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({
    label,
    value,
    onChange,
}) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <input
            type="color"
            value={value.startsWith('rgba') || value.startsWith('#') && value.length > 7 ? '#667eea' : value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: 28,
                height: 28,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                background: 'transparent',
                padding: 0,
            }}
        />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
    </div>
);

const ColorSystemPanel: React.FC<Props> = ({ colors, onChange }) => (
    <div className="panel-section">
        <div className="section-label">Colors</div>
        <ColorInput
            label="Accent"
            value={colors.accent}
            onChange={(v) => onChange({ accent: v })}
        />
        <ColorInput
            label="Accent Secondary"
            value={colors.accentSecondary}
            onChange={(v) => onChange({ accentSecondary: v })}
        />
        <ColorInput
            label="Text Primary"
            value={colors.textPrimary}
            onChange={(v) => onChange({ textPrimary: v })}
        />
        <ColorInput
            label="Text Secondary"
            value={colors.textSecondary}
            onChange={(v) => onChange({ textSecondary: v })}
        />
        <ColorInput
            label="Border"
            value={colors.border}
            onChange={(v) => onChange({ border: v })}
        />

        {/* Gradient stops */}
        <div style={{ marginTop: 12 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Gradient Stops
            </span>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {colors.gradientStops.map((stop, i) => (
                    <input
                        key={i}
                        type="color"
                        value={stop}
                        onChange={(e) => {
                            const stops = [...colors.gradientStops];
                            stops[i] = e.target.value;
                            onChange({ gradientStops: stops });
                        }}
                        style={{
                            width: 32,
                            height: 32,
                            border: '2px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            cursor: 'pointer',
                            padding: 0,
                            background: 'transparent',
                        }}
                    />
                ))}
            </div>
        </div>
    </div>
);

export default ColorSystemPanel;
