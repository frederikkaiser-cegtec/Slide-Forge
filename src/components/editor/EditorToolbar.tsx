import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Download,
  Upload,
  Plus,
  Palette,
  Undo2,
  Redo2,
  FileJson,
  FilePlus2,
  ChevronDown,
  RatioIcon,
} from 'lucide-react';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { FORMAT_PRESETS, getFormat } from '../../utils/formats';
import { exportSlideAsImage, exportAllSlidesAsZip } from '../../utils/exportImage';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export function EditorToolbar() {
  const title = usePresentationStore((s) => s.presentation.title);
  const setTitle = usePresentationStore((s) => s.setTitle);
  const undo = usePresentationStore((s) => s.undo);
  const redo = usePresentationStore((s) => s.redo);
  const undoStack = usePresentationStore((s) => s.undoStack);
  const redoStack = usePresentationStore((s) => s.redoStack);
  const exportJSON = usePresentationStore((s) => s.exportJSON);
  const importJSON = usePresentationStore((s) => s.importJSON);
  const resetPresentation = usePresentationStore((s) => s.resetPresentation);
  const slides = usePresentationStore((s) => s.presentation.slides);
  const formatId = usePresentationStore((s) => s.presentation.formatId);
  const setFormat = usePresentationStore((s) => s.setFormat);
  const enterPresentationMode = useEditorStore((s) => s.enterPresentationMode);
  const setShowTemplatePicker = useEditorStore((s) => s.setShowTemplatePicker);
  const setShowThemePicker = useEditorStore((s) => s.setShowThemePicker);
  const selectedSlideId = useEditorStore((s) => s.selectedSlideId);

  const format = getFormat(formatId ?? '16:9');
  const currentSlideIndex = slides.findIndex((s) => s.id === selectedSlideId);
  const safeFilename = title.replace(/\s+/g, '-').toLowerCase();

  const handleExportJSON = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => importJSON(reader.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportPDF = async () => {
    const container = document.getElementById('slide-export-container');
    if (container) container.style.display = 'block';

    const isLandscape = format.width >= format.height;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [format.width, format.height],
    });

    for (let i = 0; i < slides.length; i++) {
      const slideEl = document.getElementById(`slide-export-${i}`);
      if (!slideEl) continue;

      const dataUrl = await toPng(slideEl, {
        width: format.width,
        height: format.height,
        pixelRatio: 1.5,
        style: { transform: 'none', transformOrigin: '0 0' },
      });

      if (i > 0) pdf.addPage([format.width, format.height], isLandscape ? 'landscape' : 'portrait');
      pdf.addImage(dataUrl, 'PNG', 0, 0, format.width, format.height);
    }

    if (container) container.style.display = 'none';
    pdf.save(`${safeFilename}.pdf`);
  };

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-surface border-b border-border shrink-0">
      <div className="flex items-center gap-3">
        <div className="font-bold text-primary text-sm tracking-tight">SlideForge</div>
        <div className="w-px h-5 bg-border" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-text font-medium w-48 hover:bg-surface-hover px-2 py-1 rounded transition-colors"
        />
      </div>

      <div className="flex items-center gap-1">
        <ToolbarButton icon={FilePlus2} onClick={() => { if (confirm('Neue Präsentation erstellen? Ungespeicherte Änderungen gehen verloren.')) resetPresentation(); }} title="New Presentation" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={Undo2} onClick={undo} disabled={undoStack.length === 0} title="Undo (Ctrl+Z)" />
        <ToolbarButton icon={Redo2} onClick={redo} disabled={redoStack.length === 0} title="Redo (Ctrl+Shift+Z)" />
        <div className="w-px h-5 bg-border mx-1" />

        {/* Format Dropdown */}
        <FormatDropdown currentFormatId={formatId ?? '16:9'} onSelect={setFormat} />

        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={Plus} onClick={() => setShowTemplatePicker(true)} title="Add Slide" />
        <ToolbarButton icon={Palette} onClick={() => setShowThemePicker(true)} title="Change Theme" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={FileJson} onClick={handleExportJSON} title="Export JSON" />
        <ToolbarButton icon={Upload} onClick={handleImportJSON} title="Import JSON" />

        {/* Export Dropdown */}
        <ExportDropdown
          onExportPDF={handleExportPDF}
          onExportCurrentPNG={() => {
            if (currentSlideIndex >= 0) exportSlideAsImage(currentSlideIndex, format, `${safeFilename}-slide-${currentSlideIndex + 1}`, 'png');
          }}
          onExportCurrentJPG={() => {
            if (currentSlideIndex >= 0) exportSlideAsImage(currentSlideIndex, format, `${safeFilename}-slide-${currentSlideIndex + 1}`, 'jpeg');
          }}
          onExportAllPNG={() => exportAllSlidesAsZip(slides.length, format, `${safeFilename}-png`, 'png')}
          onExportAllJPG={() => exportAllSlidesAsZip(slides.length, format, `${safeFilename}-jpg`, 'jpeg')}
          hasSelectedSlide={currentSlideIndex >= 0}
        />

        <div className="w-px h-5 bg-border mx-1" />
        <button
          onClick={() => enterPresentationMode(Math.max(0, currentSlideIndex))}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-sm rounded-md transition-colors font-medium"
        >
          <Play size={14} fill="currentColor" />
          Present
        </button>
      </div>
    </div>
  );
}

function FormatDropdown({ currentFormatId, onSelect }: { currentFormatId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const current = FORMAT_PRESETS.find((f) => f.id === currentFormatId);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        title="Format"
        className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text text-xs transition-colors"
      >
        <RatioIcon size={14} />
        <span>{current?.id ?? '16:9'}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-surface border border-border rounded-lg shadow-xl z-50 min-w-[200px] py-1">
          {FORMAT_PRESETS.map((f) => (
            <button
              key={f.id}
              onClick={() => { onSelect(f.id); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-hover transition-colors ${
                f.id === currentFormatId ? 'text-primary font-medium' : 'text-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportDropdown({
  onExportPDF,
  onExportCurrentPNG,
  onExportCurrentJPG,
  onExportAllPNG,
  onExportAllJPG,
  hasSelectedSlide,
}: {
  onExportPDF: () => void;
  onExportCurrentPNG: () => void;
  onExportCurrentJPG: () => void;
  onExportAllPNG: () => void;
  onExportAllJPG: () => void;
  hasSelectedSlide: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const items = [
    { label: 'PDF', onClick: onExportPDF },
    { label: 'Current Slide as PNG', onClick: onExportCurrentPNG, disabled: !hasSelectedSlide },
    { label: 'Current Slide as JPG', onClick: onExportCurrentJPG, disabled: !hasSelectedSlide },
    { label: 'All Slides as PNG (ZIP)', onClick: onExportAllPNG },
    { label: 'All Slides as JPG (ZIP)', onClick: onExportAllJPG },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        title="Export"
        className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text text-xs transition-colors"
      >
        <Download size={14} />
        <span>Export</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-surface border border-border rounded-lg shadow-xl z-50 min-w-[220px] py-1">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => { item.onClick(); setOpen(false); }}
              disabled={item.disabled}
              className="w-full text-left px-3 py-2 text-xs hover:bg-surface-hover text-text transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  onClick,
  disabled,
  title,
}: {
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text disabled:opacity-30 disabled:pointer-events-none transition-colors"
    >
      <Icon size={16} />
    </button>
  );
}
