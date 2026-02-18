import React, { useState, useCallback, useRef } from 'react';
import { HiOutlineDownload, HiOutlineAdjustments, HiOutlineDocumentText, HiOutlineColorSwatch, HiOutlineUpload } from 'react-icons/hi';
import { useInvoiceState } from './hooks/useInvoiceState';
import { useTheme } from './hooks/useTheme';

import GrainOverlay from './components/ui/GrainOverlay';

import ThemeGallery from './components/design/ThemeGallery';
import VisualEffectsPanel from './components/design/VisualEffectsPanel';
import ColorSystemPanel from './components/design/ColorSystemPanel';
import TypographyControls from './components/design/TypographyControls';
import LayoutControls from './components/design/LayoutControls';

import InvoiceForm from './components/invoice/InvoiceForm';
import LineItemsBuilder from './components/invoice/LineItemsBuilder';
import ModernInvoicePreview from './components/invoice/ModernInvoicePreview';

import { downloadInvoicePDF, downloadInvoiceJSON, parseInvoiceJSON } from './components/export/PDFInvoiceDocument';
import { parsePDFToInvoice } from './utils/parsePDF';

type Tab = 'data' | 'design';

const App: React.FC = () => {
  const { invoice, setField, setLogo, addItem, removeItem, updateItem, loadPreset } = useInvoiceState();
  const { theme, allThemes, selectTheme, updateEffects, updateColors, updateTypography, updateLayout } = useTheme();

  const [previewScale, setPreviewScale] = useState(0.55);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('data');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      await downloadInvoicePDF(invoice, theme);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [invoice, theme]);

  const handleExportJSON = useCallback(() => {
    downloadInvoiceJSON(invoice);
  }, [invoice]);

  const handleImportFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be re-imported
    e.target.value = '';

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = parseInvoiceJSON(text);
        loadPreset(parsed);
        setImportStatus({ type: 'success', message: `Imported "${file.name}" successfully` });
      } else if (file.name.endsWith('.pdf')) {
        setImportStatus({ type: 'success', message: 'Parsing PDF… this may take a moment' });
        const parsed = await parsePDFToInvoice(file);
        loadPreset(parsed);
        setImportStatus({ type: 'success', message: `Imported "${file.name}" — review extracted fields` });
      } else {
        setImportStatus({ type: 'error', message: 'Supported formats: .json or .pdf' });
      }
    } catch (err) {
      console.error('Import failed:', err);
      setImportStatus({ type: 'error', message: `Import failed: ${err instanceof Error ? err.message : 'Invalid file format'}` });
    }

    // Clear status after 4 seconds
    setTimeout(() => setImportStatus(null), 4000);
  }, [loadPreset]);

  const panelWidth = leftPanelOpen ? 340 : 0;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#09090b' }}>
      {/* Subtle gradient glow */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)',
      }} />
      <GrainOverlay opacity={0.025} />

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 52, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        background: 'rgba(9,9,11,0.82)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em',
          }}>
            IN
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 15,
            color: '#fafafa', letterSpacing: '-0.02em',
          }}>
            Invoice Creator
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
            <button className="btn btn-ghost" style={{ padding: '5px 9px', fontSize: 12 }}
              onClick={() => setPreviewScale((s) => Math.max(0.25, s - 0.1))}>−</button>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 32, textAlign: 'center' }}>
              {Math.round(previewScale * 100)}%
            </span>
            <button className="btn btn-ghost" style={{ padding: '5px 9px', fontSize: 12 }}
              onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.1))}>+</button>
          </div>

          {/* Import */}
          <button className="btn btn-ghost" onClick={() => importRef.current?.click()}
            style={{ fontSize: 12, padding: '7px 12px' }}>
            <HiOutlineUpload size={15} />
            Import
          </button>
          <input ref={importRef} type="file" accept=".json,.pdf" style={{ display: 'none' }}
            onChange={handleImportFile} />

          {/* Export JSON */}
          <button className="btn btn-ghost" onClick={handleExportJSON}
            style={{ fontSize: 12, padding: '7px 12px' }}>
            Save JSON
          </button>

          {/* Download PDF */}
          <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}
            style={{ fontSize: 12, padding: '7px 14px' }}>
            <HiOutlineDownload size={15} />
            {downloading ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </nav>

      {/* Import status toast */}
      {importStatus && (
        <div style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
          padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: importStatus.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: importStatus.type === 'success' ? '#34d399' : '#f87171',
          border: `1px solid ${importStatus.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          backdropFilter: 'blur(12px)',
          animation: 'fade-in 0.3s ease-out',
        }}>
          {importStatus.message}
        </div>
      )}

      {/* ── Main ── */}
      <div style={{ display: 'flex', paddingTop: 52, height: '100vh', position: 'relative', zIndex: 1 }}>

        {/* ── Left Panel ── */}
        <aside style={{
          width: panelWidth, flexShrink: 0,
          height: 'calc(100vh - 52px)',
          overflow: leftPanelOpen ? 'hidden' : 'hidden',
          background: 'rgba(14,14,17,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transition: 'width 0.25s ease',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {([
              { key: 'data' as Tab, icon: <HiOutlineDocumentText size={14} />, label: 'Invoice Data' },
              { key: 'design' as Tab, icon: <HiOutlineColorSwatch size={14} />, label: 'Design' },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 5, padding: '10px 0', fontSize: 11, fontWeight: 500,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: activeTab === tab.key ? '#fafafa' : 'rgba(255,255,255,0.3)',
                  borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
            {activeTab === 'data' ? (
              <>
                <InvoiceForm invoice={invoice} setField={setField} setLogo={setLogo} />
                <LineItemsBuilder items={invoice.items} onUpdate={updateItem} onAdd={addItem} onRemove={removeItem} />
              </>
            ) : (
              <>
                <ThemeGallery themes={allThemes} activeId={theme.id} onSelect={selectTheme} />
                <VisualEffectsPanel effects={theme.effects} onChange={updateEffects} />
                <ColorSystemPanel colors={theme.colors} onChange={updateColors} />
                <TypographyControls typography={theme.typography} onChange={updateTypography} />
                <LayoutControls layout={theme.layout} onChange={updateLayout} />
              </>
            )}
          </div>
        </aside>

        {/* Toggle sidebar */}
        <button
          onClick={() => setLeftPanelOpen((v) => !v)}
          style={{
            position: 'fixed', bottom: 16, left: leftPanelOpen ? panelWidth + 8 : 8,
            zIndex: 200, width: 32, height: 32, borderRadius: 8,
            background: 'rgba(14,14,17,0.9)',
            backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s ease',
          }}
          title={leftPanelOpen ? 'Hide panel' : 'Show panel'}
        >
          <HiOutlineAdjustments size={16} />
        </button>

        {/* ── Center Canvas (STICKY) ── */}
        <main style={{
          flex: 1,
          height: 'calc(100vh - 52px)',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '32px 24px 80px',
        }}>
          <div style={{ position: 'sticky', top: 32 }}>
            <ModernInvoicePreview
              invoice={invoice}
              theme={theme}
              scale={previewScale}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
