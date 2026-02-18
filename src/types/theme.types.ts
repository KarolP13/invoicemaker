// ──────────────────────────────────────────────
// Theme Types
// ──────────────────────────────────────────────

export interface ColorScheme {
    /** Up to 3 gradient stops for the invoice background */
    gradientStops: string[];
    /** Primary accent colour used for headings, buttons */
    accent: string;
    /** Secondary accent */
    accentSecondary: string;
    /** Invoice card background */
    cardBg: string;
    /** Card text colour */
    textPrimary: string;
    /** Muted text colour */
    textSecondary: string;
    /** Border / divider colour */
    border: string;
    /** Table header bg */
    tableHeaderBg: string;
    /** Table alt row bg */
    tableAltRow: string;
}

export interface TypographyConfig {
    fontFamily: string;
    headingFontFamily: string;
    baseFontSize: number;      // px
    headingWeight: number;
    bodyWeight: number;
    letterSpacing: number;     // em
    lineHeight: number;
}

export interface LayoutConfig {
    borderRadius: number;      // px
    cardPadding: number;       // px
    spacing: 'compact' | 'normal' | 'airy';
    style: 'card' | 'full-bleed';
}

export interface EffectConfig {
    grainIntensity: number;    // 0–1
    blurStrength: number;      // px
    shadowDepth: 'soft' | 'medium' | 'strong';
    glowIntensity: number;     // 0–1
    gradientAngle: number;     // degrees
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    colors: ColorScheme;
    typography: TypographyConfig;
    layout: LayoutConfig;
    effects: EffectConfig;
    /** Tiny preview gradient for the gallery card */
    previewGradient: string;
}
