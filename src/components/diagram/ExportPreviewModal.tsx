import { useMemo, useState } from 'react';
import { X, Copy, Download, Check } from 'lucide-react';
import type { Diagram } from '../../types/diagram';
import { generateDiagramHTML } from '../../export/htmlExporter';

interface Props {
  diagram: Diagram;
  onClose: () => void;
}

export function ExportPreviewModal({ diagram, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const html = useMemo(() => generateDiagramHTML(diagram), [diagram]);
  const blob = useMemo(() => new Blob([html], { type: 'text/html' }), [html]);
  const previewUrl = useMemo(() => URL.createObjectURL(blob), [blob]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${diagram.title.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl w-[90vw] h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-medium text-text">Export Preview</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-3 py-1.5 text-xs text-text-muted hover:text-text bg-surface-hover rounded-lg"
            >
              {showCode ? 'Preview' : 'Code'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-surface-hover hover:bg-border text-text rounded-lg"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Kopiert!' : 'Kopieren'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary hover:bg-primary-hover text-white rounded-lg font-medium"
            >
              <Download size={13} /> .html
            </button>
            <button onClick={onClose} className="p-1 text-text-muted hover:text-text">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {showCode ? (
            <pre className="p-4 text-xs text-text-muted overflow-auto h-full font-mono whitespace-pre-wrap">
              {html}
            </pre>
          ) : (
            <iframe
              srcDoc={html}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
              title="Diagram Preview"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border text-xs text-text-muted">
          {html.length.toLocaleString()} Zeichen
          {html.length > 10000 && (
            <span className="text-danger ml-2">Webflow 10K Limit überschritten — minifizierte Version empfohlen</span>
          )}
        </div>
      </div>
    </div>
  );
}
