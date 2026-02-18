import React from 'react';
import type { EffectConfig } from '../../types/theme.types';

interface Props {
    effects: EffectConfig;
    onChange: (updates: Partial<EffectConfig>) => void;
}

const Slider: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    suffix?: string;
}> = ({ label, value, min, max, step, onChange, suffix = '' }) => (
    <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                {typeof value === 'number' ? (value < 1 && max <= 1 ? Math.round(value * 100) + '%' : value + suffix) : value}
            </span>
        </div>
        <input
            type="range"
            className="modern-slider"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
        />
    </div>
);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const VisualEffectsPanel: React.FC<Props> = ({ effects, onChange }) => (
    <div className="panel-section">
        <div className="section-label">Visual Effects</div>
        <Slider
            label="Grain Intensity"
            value={effects.grainIntensity}
            min={0} max={0.2} step={0.005}
            onChange={(v) => onChange({ grainIntensity: v })}
        />
        <Slider
            label="Blur Strength"
            value={effects.blurStrength}
            min={0} max={40} step={1}
            onChange={(v) => onChange({ blurStrength: v })}
            suffix="px"
        />
        <Slider
            label="Glow Intensity"
            value={effects.glowIntensity}
            min={0} max={1} step={0.05}
            onChange={(v) => onChange({ glowIntensity: v })}
        />
        <Slider
            label="Gradient Angle"
            value={effects.gradientAngle}
            min={0} max={360} step={5}
            onChange={(v) => onChange({ gradientAngle: v })}
            suffix="°"
        />
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Shadow Depth</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
                {(['soft', 'medium', 'strong'] as const).map((d) => (
                    <button
                        key={d}
                        className={`btn btn-ghost`}
                        style={{
                            flex: 1,
                            padding: '6px 0',
                            fontSize: 11,
                            textAlign: 'center',
                            justifyContent: 'center',
                            ...(effects.shadowDepth === d
                                ? { background: 'rgba(102,126,234,0.2)', borderColor: 'rgba(102,126,234,0.4)', color: '#fff' }
                                : {}),
                        }}
                        onClick={() => onChange({ shadowDepth: d })}
                    >
                        {capitalize(d)}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default VisualEffectsPanel;
