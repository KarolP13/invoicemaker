import React from 'react';
import type { Theme } from '../../types/theme.types';

interface Props {
    themes: Theme[];
    activeId: string;
    onSelect: (id: string) => void;
}

const ThemeGallery: React.FC<Props> = ({ themes, activeId, onSelect }) => (
    <div className="panel-section">
        <div className="section-label">Themes</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {themes.map((t) => (
                <div
                    key={t.id}
                    className={`theme-card${t.id === activeId ? ' active' : ''}`}
                    onClick={() => onSelect(t.id)}
                    title={t.description}
                >
                    <div className="theme-preview" style={{ background: t.previewGradient }} />
                    <div className="theme-name">{t.name}</div>
                </div>
            ))}
        </div>
    </div>
);

export default ThemeGallery;
