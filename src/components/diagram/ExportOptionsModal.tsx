import { useState, useRef } from 'react';
import { X, Download, Film, FileImage, Loader2 } from 'lucide-react';
import type { Diagram } from '../../types/diagram';
import { exportGIF } from '../../export/gifExporter';
import { exportVideo } from '../../export/videoExporter';

interface Props {
  diagram: Diagram;
  onClose: () => void;
}

type ExportFormat = 'gif' | 'video';

export function ExportOptionsModal({ diagram, onClose }: Props) {
  const [format, setFormat] = useState<ExportFormat>('gif');
  const [fps, setFps] = useState(10);
  const [duration, setDuration] = useState(3);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    // Find the diagram canvas element
    const canvasEl = document.querySelector('.flex-1.overflow-hidden.relative') as HTMLElement;
    if (!canvasEl) {
      alert('Diagram-Container nicht gefunden');
      return;
    }

    // Find the zoom/pan container inside
    const zoomContainer = canvasEl.querySelector('[style*="transform"]') as HTMLElement;
    const target = zoomContainer || canvasEl;

    setExporting(true);
    setProgress(0);

    try {
      let blob: Blob;

      if (format === 'gif') {
        blob = await exportGIF(target, {
          fps,
          duration,
          onProgress: setProgress,
        });
      } else {
        blob = await exportVideo(target, {
          fps: Math.min(fps * 3, 30),
          duration,
          onProgress: setProgress,
        });
      }

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${diagram.title.replace(/\s+/g, '-')}.${format === 'gif' ? 'gif' : 'webm'}`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      alert(`Export fehlgeschlagen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
    }}>
      <div style={{
        background: '#0c0c18',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        width: 400,
        padding: 24,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Animation exportieren</span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Format selection */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <FormatButton
            active={format === 'gif'}
            onClick={() => setFormat('gif')}
            icon={<FileImage size={16} />}
            label="GIF"
            desc="Animiertes Bild"
          />
          <FormatButton
            active={format === 'video'}
            onClick={() => setFormat('video')}
            icon={<Film size={16} />}
            label="Video"
            desc="WebM Video"
          />
        </div>

        {/* Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>FPS</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{fps}</span>
            </div>
            <input
              type="range"
              min={5}
              max={format === 'gif' ? 20 : 30}
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#3B4BF9' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Dauer</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{duration}s</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#3B4BF9' }}
            />
          </div>
        </div>

        {/* Progress bar */}
        {exporting && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              height: 4,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #3B4BF9, #E93BCD)',
                borderRadius: 2,
                transition: 'width 0.2s',
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, textAlign: 'center' }}>
              {Math.round(progress * 100)}% — Frames werden erfasst...
            </div>
          </div>
        )}

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            width: '100%',
            padding: '12px',
            background: exporting ? 'rgba(59,75,249,0.3)' : 'linear-gradient(135deg, #3B4BF9, #6875FF)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            border: 'none',
            cursor: exporting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: exporting ? 'none' : '0 4px 16px rgba(59,75,249,0.4)',
          }}
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {exporting ? 'Exportiere...' : `${format === 'gif' ? 'GIF' : 'Video'} exportieren`}
        </button>
      </div>
    </div>
  );
}

function FormatButton({
  active,
  onClick,
  icon,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px',
        background: active ? 'linear-gradient(135deg, #3B4BF910, #E93BCD10)' : 'rgba(255,255,255,0.04)',
        border: active ? '1px solid #3B4BF960' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 10, opacity: 0.6 }}>{desc}</span>
    </button>
  );
}
