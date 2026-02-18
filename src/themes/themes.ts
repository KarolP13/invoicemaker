import type { Theme } from '../types/theme.types';

// ──────────────────────────────────────────────
// 8 Modern Invoice Themes
// Modern Brutalist is the default (index 0)
// ──────────────────────────────────────────────

export const themes: Theme[] = [
    // 1 ─ Modern Brutalist (DEFAULT)
    {
        id: 'modern-brutalist',
        name: 'Modern Brutalist',
        description: 'Bold typography, stark contrasts, geometric shapes',
        previewGradient: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
        colors: {
            gradientStops: ['#ffffff', '#f5f5f5', '#eeeeee'],
            accent: '#1a1a1a',
            accentSecondary: '#ff4500',
            cardBg: '#ffffff',
            textPrimary: '#111111',
            textSecondary: '#555555',
            border: '#222222',
            tableHeaderBg: '#1a1a1a',
            tableAltRow: '#f5f5f5',
        },
        typography: {
            fontFamily: "'Space Grotesk', sans-serif",
            headingFontFamily: "'Space Grotesk', sans-serif",
            baseFontSize: 13,
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: -0.03,
            lineHeight: 1.4,
        },
        layout: { borderRadius: 0, cardPadding: 36, spacing: 'compact', style: 'card' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'strong', glowIntensity: 0, gradientAngle: 180 },
    },

    // 2 ─ Gradient Mesh
    {
        id: 'gradient-mesh',
        name: 'Gradient Mesh',
        description: 'Multi-color gradient backgrounds with glassmorphic cards',
        previewGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        colors: {
            gradientStops: ['#667eea', '#764ba2', '#f093fb'],
            accent: '#667eea',
            accentSecondary: '#f093fb',
            cardBg: 'rgba(255,255,255,0.92)',
            textPrimary: '#1a1a2e',
            textSecondary: '#555580',
            border: 'rgba(102,126,234,0.2)',
            tableHeaderBg: 'rgba(102,126,234,0.08)',
            tableAltRow: 'rgba(102,126,234,0.03)',
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            headingFontFamily: "'Outfit', sans-serif",
            baseFontSize: 13,
            headingWeight: 600,
            bodyWeight: 400,
            letterSpacing: -0.01,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 16, cardPadding: 40, spacing: 'normal', style: 'card' },
        effects: { grainIntensity: 0.03, blurStrength: 12, shadowDepth: 'medium', glowIntensity: 0.3, gradientAngle: 135 },
    },

    // 3 ─ Grainy Dark
    {
        id: 'grainy-dark',
        name: 'Grainy Dark',
        description: 'Dark mode with film grain texture and neon accents',
        previewGradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        colors: {
            gradientStops: ['#0a0a0f', '#1a1a2e', '#16213e'],
            accent: '#00d4ff',
            accentSecondary: '#ff6b9d',
            cardBg: 'rgba(20,20,35,0.95)',
            textPrimary: '#e8e8f0',
            textSecondary: '#8888aa',
            border: 'rgba(0,212,255,0.15)',
            tableHeaderBg: 'rgba(0,212,255,0.06)',
            tableAltRow: 'rgba(255,255,255,0.02)',
        },
        typography: {
            fontFamily: "'Space Grotesk', sans-serif",
            headingFontFamily: "'Space Grotesk', sans-serif",
            baseFontSize: 13,
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: -0.02,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 12, cardPadding: 40, spacing: 'normal', style: 'card' },
        effects: { grainIntensity: 0.08, blurStrength: 20, shadowDepth: 'strong', glowIntensity: 0.5, gradientAngle: 135 },
    },

    // 4 ─ Liquid Glass
    {
        id: 'liquid-glass',
        name: 'Liquid Glass',
        description: 'Frosted glass panels with soft shadows and blurs',
        previewGradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        colors: {
            gradientStops: ['#e0c3fc', '#8ec5fc', '#d5fefd'],
            accent: '#7c3aed',
            accentSecondary: '#3b82f6',
            cardBg: 'rgba(255,255,255,0.6)',
            textPrimary: '#1e293b',
            textSecondary: '#64748b',
            border: 'rgba(124,58,237,0.15)',
            tableHeaderBg: 'rgba(124,58,237,0.06)',
            tableAltRow: 'rgba(124,58,237,0.02)',
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            headingFontFamily: "'Outfit', sans-serif",
            baseFontSize: 13,
            headingWeight: 600,
            bodyWeight: 400,
            letterSpacing: -0.01,
            lineHeight: 1.55,
        },
        layout: { borderRadius: 20, cardPadding: 44, spacing: 'airy', style: 'card' },
        effects: { grainIntensity: 0.02, blurStrength: 24, shadowDepth: 'soft', glowIntensity: 0.2, gradientAngle: 150 },
    },

    // 5 ─ Minimal Grain
    {
        id: 'minimal-grain',
        name: 'Minimal Grain',
        description: 'Clean white with subtle noise texture, single accent color',
        previewGradient: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
        colors: {
            gradientStops: ['#fafafa', '#f5f5f5', '#eeeeee'],
            accent: '#e11d48',
            accentSecondary: '#be185d',
            cardBg: '#ffffff',
            textPrimary: '#111827',
            textSecondary: '#6b7280',
            border: '#e5e7eb',
            tableHeaderBg: '#fafafa',
            tableAltRow: '#fdfcfc',
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            headingFontFamily: "'Inter', sans-serif",
            baseFontSize: 13,
            headingWeight: 600,
            bodyWeight: 400,
            letterSpacing: -0.01,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 8, cardPadding: 40, spacing: 'normal', style: 'card' },
        effects: { grainIntensity: 0.04, blurStrength: 0, shadowDepth: 'soft', glowIntensity: 0, gradientAngle: 180 },
    },

    // 6 ─ Neon Dreams
    {
        id: 'neon-dreams',
        name: 'Neon Dreams',
        description: 'Dark background with vibrant neon highlights',
        previewGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0030 50%, #000820 100%)',
        colors: {
            gradientStops: ['#0a0a0a', '#1a0030', '#000820'],
            accent: '#ff00ff',
            accentSecondary: '#00ffff',
            cardBg: 'rgba(15,15,25,0.92)',
            textPrimary: '#f0f0ff',
            textSecondary: '#9090bb',
            border: 'rgba(255,0,255,0.2)',
            tableHeaderBg: 'rgba(255,0,255,0.05)',
            tableAltRow: 'rgba(0,255,255,0.02)',
        },
        typography: {
            fontFamily: "'Space Grotesk', sans-serif",
            headingFontFamily: "'Outfit', sans-serif",
            baseFontSize: 13,
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: 0,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 12, cardPadding: 40, spacing: 'normal', style: 'card' },
        effects: { grainIntensity: 0.05, blurStrength: 16, shadowDepth: 'strong', glowIntensity: 0.7, gradientAngle: 135 },
    },

    // 7 ─ Soft Ambient
    {
        id: 'soft-ambient',
        name: 'Soft Ambient',
        description: 'Pastel gradients with floating elements',
        previewGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
        colors: {
            gradientStops: ['#ffecd2', '#fcb69f', '#ff9a9e'],
            accent: '#e17055',
            accentSecondary: '#fd79a8',
            cardBg: 'rgba(255,255,255,0.88)',
            textPrimary: '#2d3436',
            textSecondary: '#636e72',
            border: 'rgba(225,112,85,0.15)',
            tableHeaderBg: 'rgba(225,112,85,0.06)',
            tableAltRow: 'rgba(225,112,85,0.02)',
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            headingFontFamily: "'Outfit', sans-serif",
            baseFontSize: 13,
            headingWeight: 500,
            bodyWeight: 400,
            letterSpacing: 0,
            lineHeight: 1.6,
        },
        layout: { borderRadius: 24, cardPadding: 44, spacing: 'airy', style: 'card' },
        effects: { grainIntensity: 0.02, blurStrength: 16, shadowDepth: 'soft', glowIntensity: 0.15, gradientAngle: 145 },
    },

    // 8 ─ Startup Energy
    {
        id: 'startup-energy',
        name: 'Startup Energy',
        description: 'Bright gradients, playful but professional',
        previewGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 30%, #4facfe 60%, #667eea 100%)',
        colors: {
            gradientStops: ['#43e97b', '#38f9d7', '#4facfe', '#667eea'],
            accent: '#0ea5e9',
            accentSecondary: '#10b981',
            cardBg: 'rgba(255,255,255,0.93)',
            textPrimary: '#0f172a',
            textSecondary: '#475569',
            border: 'rgba(14,165,233,0.15)',
            tableHeaderBg: 'rgba(14,165,233,0.06)',
            tableAltRow: 'rgba(14,165,233,0.02)',
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            headingFontFamily: "'Outfit', sans-serif",
            baseFontSize: 13,
            headingWeight: 600,
            bodyWeight: 400,
            letterSpacing: -0.01,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 16, cardPadding: 40, spacing: 'normal', style: 'card' },
        effects: { grainIntensity: 0.02, blurStrength: 12, shadowDepth: 'medium', glowIntensity: 0.25, gradientAngle: 135 },
    },
];

export const getThemeById = (id: string): Theme =>
    themes.find((t) => t.id === id) ?? themes[0];
