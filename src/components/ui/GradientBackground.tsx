import React from 'react';

interface Props {
    colors: string[];
}

/** Animated multi-blob gradient mesh background */
const GradientBackground: React.FC<Props> = ({ colors }) => {
    const blobs = colors.slice(0, 4);
    return (
        <div className="gradient-mesh">
            {blobs.map((color, i) => (
                <div
                    key={i}
                    className="blob"
                    style={{ background: color }}
                />
            ))}
        </div>
    );
};

export default GradientBackground;
