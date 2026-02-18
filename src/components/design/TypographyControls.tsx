import React from 'react';
import type { TypographyConfig } from '../../types/theme.types';

interface Props {
    typography: TypographyConfig;
    onChange: (updates: Partial<TypographyConfig>) => void;
}

const fontOptions = [
    { label: 'Inter', value: "'Inter', sans-serif" },
    { label: 'Outfit', value: "'Outfit', sans-serif" },
    { label: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
];

const TypographyControls: React.FC<Props> = ({ typography, onChange }) => (
    <div className="panel-section">
        <div className="section-label">Typography</div>

        {/* Body font */}
        <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>Body Font</span>
            <select
                className="modern-input"
                value={typography.fontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
                style={{ cursor: 'pointer' }}
            >
                {fontOptions.map((f) => (
                    <option key={f.value} value={f.value} style={{ background: '#1a1a2e' }}>
                        {f.label}
                    </option>
                ))}
            </select>
        </div>

        {/* Heading font */}
        <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>Heading Font</span>
            <select
                className="modern-input"
                value={typography.headingFontFamily}
                onChange={(e) => onChange({ headingFontFamily: e.target.value })}
                style={{ cursor: 'pointer' }}
            >
                {fontOptions.map((f) => (
                    <option key={f.value} value={f.value} style={{ background: '#1a1a2e' }}>
                        {f.label}
                    </option>
                ))}
            </select>
        </div>

        {/* Font size */}
        <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Base Size</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{typography.baseFontSize}px</span>
            </div>
            <input
                type="range"
                className="modern-slider"
                min={10} max={18} step={0.5}
                value={typography.baseFontSize}
                onChange={(e) => onChange({ baseFontSize: parseFloat(e.target.value) })}
            />
        </div>

        {/* Heading weight */}
        <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Heading Weight</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{typography.headingWeight}</span>
            </div>
            <input
                type="range"
                className="modern-slider"
                min={300} max={800} step={100}
                value={typography.headingWeight}
                onChange={(e) => onChange({ headingWeight: parseInt(e.target.value) })}
            />
        </div>

        {/* Letter spacing */}
        <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Letter Spacing</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{typography.letterSpacing}em</span>
            </div>
            <input
                type="range"
                className="modern-slider"
                min={-0.05} max={0.1} step={0.005}
                value={typography.letterSpacing}
                onChange={(e) => onChange({ letterSpacing: parseFloat(e.target.value) })}
            />
        </div>

        {/* Line height */}
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Line Height</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{typography.lineHeight}</span>
            </div>
            <input
                type="range"
                className="modern-slider"
                min={1.2} max={2} step={0.05}
                value={typography.lineHeight}
                onChange={(e) => onChange({ lineHeight: parseFloat(e.target.value) })}
            />
        </div>
    </div>
);

export default TypographyControls;
