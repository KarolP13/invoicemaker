import React from 'react';

interface Props { opacity?: number }

/** SVG feTurbulence grain texture overlay — sits on top of everything, pointer-events: none */
const GrainOverlay: React.FC<Props> = ({ opacity = 0.04 }) => (
    <>
        <svg style={{ position: 'fixed', width: 0, height: 0 }} aria-hidden="true">
            <filter id="grain-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
            </filter>
        </svg>
        <div
            className="grain-overlay"
            style={{
                opacity,
                filter: 'url(#grain-filter)',
                width: '200%',
                height: '200%',
            }}
        />
    </>
);

export default GrainOverlay;
