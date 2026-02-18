import React, { useState, useCallback, useRef, useEffect } from 'react';
import { HiOutlineDownload, HiOutlineDocumentText, HiOutlineColorSwatch, HiOutlineUpload, HiOutlineEye, HiOutlineCloud, HiOutlineSave } from 'react-icons/hi';
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
import { savePresetToCloud, loadPresetFromCloud, isValidCode, getShareableId, setShareableId } from './utils/cloudPresets';

type Tab = 'data' | 'design';
type MobileView = 'form' | 'design' | 'preview';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

const App: React.FC = () => {
  const { invoice, setField, setLogo, addItem, removeItem, updateItem, loadPreset } = useInvoiceState();
  const { theme, allThemes, selectTheme, updateEffects, updateColors, updateTypography, updateLayout } = useTheme();

  const [previewScale, setPreviewScale] = useState(0.55);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('data');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<MobileView>('form');

  // Cloud presets
  const [presetCode, setPresetCode] = useState('');
  const [presetSaving, setPresetSaving] = useState(false);
  const [showCloudPanel, setShowCloudPanel] = useState(false);
  const [storeId, setStoreId] = useState(getShareableId() || '');

  // Auto-scale preview to fill viewport on mobile
  useEffect(() => {
    if (isMobile) {
      const scale = Math.min((window.innerWidth - 16) / 794, 0.5);
      setPreviewScale(scale);
    }
  }, [isMobile]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setImportStatus({ type, message });
    setTimeout(() => setImportStatus(null), 4000);
  }, []);

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
    e.target.value = '';

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = parseInvoiceJSON(text);
        loadPreset(parsed);
        showToast('success', `Imported "${file.name}" successfully`);
      } else if (file.name.endsWith('.pdf')) {
        showToast('success', 'Parsing PDF… this may take a moment');
        const parsed = await parsePDFToInvoice(file);
        loadPreset(parsed);
        showToast('success', `Imported "${file.name}" — review extracted fields`);
      } else {
        showToast('error', 'Supported formats: .json or .pdf');
      }
    } catch (err) {
      console.error('Import failed:', err);
      showToast('error', `Import failed: ${err instanceof Error ? err.message : 'Invalid file format'}`);
    }
  }, [loadPreset, showToast]);

  const handleSavePreset = useCallback(async () => {
    if (!isValidCode(presetCode)) {
      showToast('error', 'Code must be 3-8 letters/numbers');
      return;
    }
    setPresetSaving(true);
    try {
      const blobId = await savePresetToCloud(presetCode, invoice);
      setStoreId(blobId);
      showToast('success', `Saved as "${presetCode.toUpperCase()}"! Store ID: ${blobId.slice(0, 8)}…`);
    } catch (err) {
      showToast('error', `Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setPresetSaving(false);
    }
  }, [presetCode, invoice, showToast]);

  const handleLoadPreset = useCallback(async () => {
    if (!isValidCode(presetCode)) {
      showToast('error', 'Enter a 3-8 character code');
      return;
    }
    try {
      const data = await loadPresetFromCloud(presetCode);
      loadPreset(data);
      showToast('success', `Loaded preset "${presetCode.toUpperCase()}" — update numbers & export!`);
    } catch (err) {
      showToast('error', `Load failed: ${err instanceof Error ? err.message : 'Not found'}`);
    }
  }, [presetCode, loadPreset, showToast]);

  const handleSetStoreId = useCallback(() => {
    if (storeId.trim().length > 10) {
      setShareableId(storeId.trim());
      showToast('success', 'Store ID set! You can now load codes from this store.');
    } else {
      showToast('error', 'Enter a valid Store ID');
    }
  }, [storeId, showToast]);

  const panelWidth = isMobile ? 0 : (leftPanelOpen ? 340 : 0);

  // ── Render ──────────────────────────────────

  const renderPanel = () => (
    <>
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
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: isMobile ? 80 : 40 }}>
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
    </>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#09090b' }}>
      {/* Subtle gradient glow */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)',
      }} />
      <GrainOverlay opacity={0.025} />

      {/* ── Nav ── */}
      <nav className={isMobile ? 'mobile-nav' : ''} style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: isMobile ? 'auto' : 52, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '8px 12px' : '0 16px',
        background: 'rgba(9,9,11,0.82)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? 6 : 0,
      }}>
        {/* Logo */}
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

        {/* Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          {/* Zoom — hidden on mobile */}
          {!isMobile && (
            <div className="zoom-controls" style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
              <button className="btn btn-ghost" style={{ padding: '5px 9px', fontSize: 12 }}
                onClick={() => setPreviewScale((s) => Math.max(0.25, s - 0.1))}>−</button>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 32, textAlign: 'center' }}>
                {Math.round(previewScale * 100)}%
              </span>
              <button className="btn btn-ghost" style={{ padding: '5px 9px', fontSize: 12 }}
                onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.1))}>+</button>
            </div>
          )}

          {/* Cloud Presets */}
          <button className="btn btn-ghost" onClick={() => setShowCloudPanel(!showCloudPanel)}
            style={{ fontSize: 12, padding: '7px 12px' }}>
            <HiOutlineCloud size={15} />
            {isMobile ? '' : 'Presets'}
          </button>

          {/* Import */}
          <button className="btn btn-ghost" onClick={() => importRef.current?.click()}
            style={{ fontSize: 12, padding: '7px 12px' }}>
            <HiOutlineUpload size={15} />
            {isMobile ? '' : 'Import'}
          </button>
          <input ref={importRef} type="file" accept=".json,.pdf" style={{ display: 'none' }}
            onChange={handleImportFile} />

          {/* Export JSON */}
          {!isMobile && (
            <button className="btn btn-ghost" onClick={handleExportJSON}
              style={{ fontSize: 12, padding: '7px 12px' }}>
              <HiOutlineSave size={15} />
              Save JSON
            </button>
          )}

          {/* Download PDF */}
          <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}
            style={{ fontSize: 12, padding: '7px 14px' }}>
            <HiOutlineDownload size={15} />
            {downloading ? '…' : (isMobile ? 'PDF' : 'Download PDF')}
          </button>
        </div>
      </nav>

      {/* Cloud Presets Panel */}
      {showCloudPanel && (
        <div style={{
          position: 'fixed', top: isMobile ? 60 : 52, right: isMobile ? 8 : 16, zIndex: 150,
          width: isMobile ? 'calc(100% - 16px)' : 340, padding: 16,
          background: 'rgba(14,14,17,0.97)', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          animation: 'fade-in 0.2s ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#fafafa' }}>Cloud Presets</span>
            <button onClick={() => setShowCloudPanel(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16,
            }}>✕</button>
          </div>

          {/* Code input + Save/Load */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Preset Code
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="modern-input"
                value={presetCode}
                onChange={(e) => setPresetCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                placeholder="e.g. MYCO"
                style={{
                  flex: 1, fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 14, fontWeight: 600,
                }}
                maxLength={8}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadPreset()}
              />
              <button className="btn btn-primary" onClick={handleSavePreset} disabled={presetSaving || presetCode.length < 3}
                style={{ fontSize: 11, padding: '8px 12px', whiteSpace: 'nowrap' }}>
                {presetSaving ? '…' : 'Save'}
              </button>
              <button className="btn btn-ghost" onClick={handleLoadPreset} disabled={presetCode.length < 3}
                style={{ fontSize: 11, padding: '8px 12px', whiteSpace: 'nowrap' }}>
                Load
              </button>
            </div>
          </div>

          {/* Store ID for cross-device */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Store ID (for syncing across devices)
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="modern-input"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                placeholder="Paste Store ID here"
                style={{ flex: 1, fontSize: 11, fontFamily: "'SF Mono', 'Fira Code', monospace" }}
              />
              <button className="btn btn-ghost" onClick={handleSetStoreId}
                style={{ fontSize: 11, padding: '8px 12px', whiteSpace: 'nowrap' }}>
                Set
              </button>
            </div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6, lineHeight: 1.5 }}>
              Save a preset to get a Store ID. Share it to load your presets on any device.
            </p>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {importStatus && (
        <div style={{
          position: 'fixed', top: isMobile ? 70 : 60, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
          padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, maxWidth: isMobile ? 'calc(100% - 32px)' : 'auto',
          textAlign: 'center',
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
      {isMobile ? (
        /* ════════ MOBILE LAYOUT ════════ */
        <div style={{ paddingTop: 64, paddingBottom: 60, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          {mobileView === 'preview' ? (
            <main style={{
              padding: '8px',
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <ModernInvoicePreview
                invoice={invoice}
                theme={theme}
                scale={previewScale}
              />
            </main>
          ) : (
            <aside style={{
              background: 'rgba(14,14,17,0.95)',
              minHeight: 'calc(100vh - 124px)',
              display: 'flex', flexDirection: 'column',
            }}>
              {mobileView === 'form' ? (
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
                  <InvoiceForm invoice={invoice} setField={setField} setLogo={setLogo} />
                  <LineItemsBuilder items={invoice.items} onUpdate={updateItem} onAdd={addItem} onRemove={removeItem} />

                  {/* Mobile-only: Export buttons */}
                  <div className="panel-section" style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" onClick={handleExportJSON} style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>
                      <HiOutlineSave size={14} /> Save JSON
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
                  {renderPanel()}
                </div>
              )}
            </aside>
          )}

          {/* Mobile Bottom Navigation */}
          <div className="mobile-bottom-bar">
            <button className={mobileView === 'form' ? 'active' : ''} onClick={() => setMobileView('form')}>
              <HiOutlineDocumentText size={20} />
              Invoice
            </button>
            <button className={mobileView === 'design' ? 'active' : ''} onClick={() => setMobileView('design')}>
              <HiOutlineColorSwatch size={20} />
              Design
            </button>
            <button className={mobileView === 'preview' ? 'active' : ''} onClick={() => setMobileView('preview')}>
              <HiOutlineEye size={20} />
              Preview
            </button>
          </div>
        </div>
      ) : (
        /* ════════ DESKTOP LAYOUT ════════ */
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
            {renderPanel()}
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
            {leftPanelOpen ? '◀' : '▶'}
          </button>

          {/* ── Center Canvas ── */}
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
      )}
    </div>
  );
};

export default App;
