import React, { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { HiOutlineCloudUpload, HiOutlineTrash } from 'react-icons/hi';

interface Props {
    logo: string | null;
    logoScale: number;
    onLogoChange: (dataUrl: string | null) => void;
    onLogoScaleChange: (scale: number) => void;
}

const LogoUploader: React.FC<Props> = ({ logo, logoScale, onLogoChange, onLogoScaleChange }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => onLogoChange(reader.result as string);
        reader.readAsDataURL(file);
    };

    const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <div className="section-label">Company Logo</div>

            {logo ? (
                <div>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                maxWidth: 140,
                                maxHeight: 70,
                                objectFit: 'contain',
                                borderRadius: 8,
                                background: 'rgba(255,255,255,0.05)',
                                padding: 8,
                                transform: `scale(${logoScale})`,
                                transformOrigin: 'top left',
                            }}
                        />
                        <button
                            className="btn btn-danger"
                            style={{ position: 'absolute', top: -6, right: -6, padding: '4px 6px', fontSize: 11, borderRadius: 8 }}
                            onClick={() => onLogoChange(null)}
                            title="Remove logo"
                        >
                            <HiOutlineTrash size={14} />
                        </button>
                    </div>

                    {/* Logo Scale Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Logo Scale</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{Math.round(logoScale * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            className="modern-slider"
                            min={0.3}
                            max={2}
                            step={0.05}
                            value={logoScale}
                            onChange={(e) => onLogoScaleChange(parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            ) : (
                <div
                    className={`logo-upload-zone${dragging ? ' drag-over' : ''}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileRef.current?.click()}
                >
                    <HiOutlineCloudUpload size={28} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        Drop logo here or click to upload
                    </span>
                </div>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
        </div>
    );
};

export default LogoUploader;
