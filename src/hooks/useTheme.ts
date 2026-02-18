import { useState, useCallback } from 'react';
import type { Theme, EffectConfig, ColorScheme, TypographyConfig, LayoutConfig } from '../types/theme.types';
import { themes, getThemeById } from '../themes/themes';

export function useTheme() {
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

    const selectTheme = useCallback((id: string) => {
        setCurrentTheme(getThemeById(id));
    }, []);

    const updateEffects = useCallback((effects: Partial<EffectConfig>) => {
        setCurrentTheme((t) => ({ ...t, effects: { ...t.effects, ...effects } }));
    }, []);

    const updateColors = useCallback((colors: Partial<ColorScheme>) => {
        setCurrentTheme((t) => ({ ...t, colors: { ...t.colors, ...colors } }));
    }, []);

    const updateTypography = useCallback((typography: Partial<TypographyConfig>) => {
        setCurrentTheme((t) => ({ ...t, typography: { ...t.typography, ...typography } }));
    }, []);

    const updateLayout = useCallback((layout: Partial<LayoutConfig>) => {
        setCurrentTheme((t) => ({ ...t, layout: { ...t.layout, ...layout } }));
    }, []);

    return {
        theme: currentTheme,
        allThemes: themes,
        selectTheme,
        updateEffects,
        updateColors,
        updateTypography,
        updateLayout,
    };
}
