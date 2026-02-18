import type { Theme } from '../types/theme.types';

// ──────────────────────────────────────────────
// 8 Distinct Invoice Templates
// Each has a unique templateId that drives layout structure
// ──────────────────────────────────────────────

export const themes: Theme[] = [
    // 1 ─ Modern Brutalist (DEFAULT)
    {
        id: 'modern-brutalist',
        name: 'Modern Brutalist',
        description: 'Bold typography, stark contrasts, geometric shapes',
        templateId: 'brutalist',
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
        layout: { borderRadius: 0, cardPadding: 36, spacing: 'compact', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'strong', glowIntensity: 0, gradientAngle: 180 },
    },

    // 2 ─ Executive Suite
    {
        id: 'executive-suite',
        name: 'Executive Suite',
        description: 'Formal serif typography with gold accents, centered header',
        templateId: 'executive',
        previewGradient: 'linear-gradient(135deg, #f8f6f0 0%, #ede8df 50%, #d4c5a9 100%)',
        colors: {
            gradientStops: ['#f8f6f0', '#ede8df', '#d4c5a9'],
            accent: '#8b6914',
            accentSecondary: '#5c4a1e',
            cardBg: '#fffef9',
            textPrimary: '#1c1a15',
            textSecondary: '#6b6356',
            border: '#d4c5a9',
            tableHeaderBg: '#f5f0e5',
            tableAltRow: '#faf8f3',
        },
        typography: {
            fontFamily: "'Lora', serif",
            headingFontFamily: "'Playfair Display', serif",
            baseFontSize: 13,
            headingWeight: 600,
            bodyWeight: 400,
            letterSpacing: 0.01,
            lineHeight: 1.6,
        },
        layout: { borderRadius: 0, cardPadding: 44, spacing: 'airy', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'soft', glowIntensity: 0, gradientAngle: 180 },
    },

    // 3 ─ Midnight Pro
    {
        id: 'midnight-pro',
        name: 'Midnight Pro',
        description: 'Dark paper with glowing sidebar accent strip',
        templateId: 'midnight',
        previewGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        colors: {
            gradientStops: ['#0f172a', '#1e293b', '#0f172a'],
            accent: '#38bdf8',
            accentSecondary: '#818cf8',
            cardBg: '#1e293b',
            textPrimary: '#e2e8f0',
            textSecondary: '#94a3b8',
            border: '#334155',
            tableHeaderBg: '#334155',
            tableAltRow: '#253347',
        },
        typography: {
            fontFamily: "'DM Sans', sans-serif",
            headingFontFamily: "'Plus Jakarta Sans', sans-serif",
            baseFontSize: 13,
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: -0.01,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 0, cardPadding: 40, spacing: 'normal', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'strong', glowIntensity: 0, gradientAngle: 180 },
    },

    // 4 ─ Clean Minimal
    {
        id: 'clean-minimal',
        name: 'Clean Minimal',
        description: 'Maximum whitespace, hairline dividers, ultra-clean',
        templateId: 'minimal',
        previewGradient: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        colors: {
            gradientStops: ['#ffffff', '#fafafa', '#f5f5f5'],
            accent: '#18181b',
            accentSecondary: '#71717a',
            cardBg: '#ffffff',
            textPrimary: '#18181b',
            textSecondary: '#71717a',
            border: '#e4e4e7',
            tableHeaderBg: 'transparent',
            tableAltRow: '#fafafa',
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            headingFontFamily: "'Inter', sans-serif",
            baseFontSize: 12.5,
            headingWeight: 500,
            bodyWeight: 400,
            letterSpacing: 0,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 0, cardPadding: 48, spacing: 'airy', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'soft', glowIntensity: 0, gradientAngle: 180 },
    },

    // 5 ─ Corporate Classic
    {
        id: 'corporate-classic',
        name: 'Corporate Classic',
        description: 'Blue header banner, traditional business layout',
        templateId: 'classic',
        previewGradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1e40af 100%)',
        colors: {
            gradientStops: ['#1e3a5f', '#2563eb', '#1e40af'],
            accent: '#1e40af',
            accentSecondary: '#2563eb',
            cardBg: '#ffffff',
            textPrimary: '#1e293b',
            textSecondary: '#64748b',
            border: '#e2e8f0',
            tableHeaderBg: '#1e40af',
            tableAltRow: '#f1f5f9',
        },
        typography: {
            fontFamily: "'Open Sans', sans-serif",
            headingFontFamily: "'Montserrat', sans-serif",
            baseFontSize: 13,
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: 0,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 0, cardPadding: 0, spacing: 'normal', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'medium', glowIntensity: 0, gradientAngle: 180 },
    },

    // 6 ─ Tech Startup
    {
        id: 'tech-startup',
        name: 'Tech Startup',
        description: 'Monospace accents, dotted lines, pill badges',
        templateId: 'tech',
        previewGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        colors: {
            gradientStops: ['#f0fdf4', '#dcfce7', '#bbf7d0'],
            accent: '#059669',
            accentSecondary: '#10b981',
            cardBg: '#ffffff',
            textPrimary: '#064e3b',
            textSecondary: '#6b7280',
            border: '#d1fae5',
            tableHeaderBg: '#ecfdf5',
            tableAltRow: '#f0fdf4',
        },
        typography: {
            fontFamily: "'DM Sans', sans-serif",
            headingFontFamily: "'Space Grotesk', sans-serif",
            baseFontSize: 13,
            headingWeight: 600,
            bodyWeight: 400,
            letterSpacing: -0.01,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 8, cardPadding: 40, spacing: 'normal', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'soft', glowIntensity: 0, gradientAngle: 180 },
    },

    // 7 ─ Elegant
    {
        id: 'elegant',
        name: 'Elegant',
        description: 'Refined serif headings, thin accent borders, graceful spacing',
        templateId: 'elegant',
        previewGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
        colors: {
            gradientStops: ['#fdf2f8', '#fce7f3', '#fbcfe8'],
            accent: '#9d174d',
            accentSecondary: '#be185d',
            cardBg: '#ffffff',
            textPrimary: '#1c1917',
            textSecondary: '#78716c',
            border: '#e7e5e4',
            tableHeaderBg: '#faf5f0',
            tableAltRow: '#fdfcfb',
        },
        typography: {
            fontFamily: "'Lora', serif",
            headingFontFamily: "'Cormorant Garamond', serif",
            baseFontSize: 13,
            headingWeight: 600,
            bodyWeight: 400,
            letterSpacing: 0.02,
            lineHeight: 1.6,
        },
        layout: { borderRadius: 0, cardPadding: 48, spacing: 'airy', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'soft', glowIntensity: 0, gradientAngle: 180 },
    },

    // 8 ─ Fresh Modern
    {
        id: 'fresh-modern',
        name: 'Fresh Modern',
        description: 'Colored accent sidebar, clean modern sans-serif',
        templateId: 'fresh',
        previewGradient: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 50%, #8b5cf6 100%)',
        colors: {
            gradientStops: ['#ede9fe', '#c4b5fd', '#8b5cf6'],
            accent: '#7c3aed',
            accentSecondary: '#a78bfa',
            cardBg: '#ffffff',
            textPrimary: '#1e1b4b',
            textSecondary: '#6b7280',
            border: '#e5e7eb',
            tableHeaderBg: '#f5f3ff',
            tableAltRow: '#faf5ff',
        },
        typography: {
            fontFamily: "'Manrope', sans-serif",
            headingFontFamily: "'Outfit', sans-serif",
            baseFontSize: 13,
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: -0.01,
            lineHeight: 1.5,
        },
        layout: { borderRadius: 0, cardPadding: 40, spacing: 'normal', style: 'full-bleed' },
        effects: { grainIntensity: 0, blurStrength: 0, shadowDepth: 'medium', glowIntensity: 0, gradientAngle: 180 },
    },
];

export const getThemeById = (id: string): Theme =>
    themes.find((t) => t.id === id) ?? themes[0];
