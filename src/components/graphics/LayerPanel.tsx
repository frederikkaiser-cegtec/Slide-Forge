import { Type, ImagePlus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Layer, TextLayer } from '../../types/layers';

const FONT_FAMILIES = ['Plus Jakarta Sans', 'DM Sans', 'Inter', 'Arial', 'Georgia'];

interface Props {
  layers: Layer[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<Layer>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddText: () => void;
  onOpenLibrary: () => void;
}

export function LayerPanel({ layers, selectedId, onSelect, onUpdate, onDelete, onMoveUp, onMoveDown, onAddText, onOpenLibrary }: Props) {
  const selected = layers.find((l) => l.id === selectedId);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
          Ebenen {layers.length > 0 ? `(${layers.length})` : ''}
        </span>
        <div className="flex gap-1">
          <button onClick={onAddText} title="Text hinzufügen"
            className="flex items-center gap-1 px-2 py-1 text-[11px] bg-muted/50 hover:bg-muted text-text-muted hover:text-text rounded transition-colors">
            <Type size={11} /> Text
          </button>
          <button onClick={onOpenLibrary} title="SVG hinzufügen"
            className="flex items-center gap-1 px-2 py-1 text-[11px] bg-muted/50 hover:bg-muted text-text-muted hover:text-text rounded transition-colors">
            <ImagePlus size={11} /> SVG
          </button>
        </div>
      </div>

      {/* Layer list (reversed: top layer first) */}
      <div className="max-h-28 overflow-y-auto border-t border-border/30">
        {layers.length === 0 && (
          <p className="text-[11px] text-text-muted/40 px-3 py-3 text-center">Keine Ebenen — Text oder SVG hinzufügen</p>
        )}
        {[...layers].reverse().map((layer) => {
          const active = layer.id === selectedId;
          return (
            <div key={layer.id}
              onClick={() => onSelect(active ? null : layer.id)}
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${active ? 'bg-primary/10 text-text' : 'hover:bg-muted/20 text-text-muted'}`}>
              <span className="text-[10px] shrink-0">{layer.type === 'svg' ? '⬡' : 'T'}</span>
              <span className="text-[11px] flex-1 truncate">
                {layer.type === 'text' ? (layer.content || '(leer)') : 'SVG-Ebene'}
              </span>
              <div className="flex gap-0.5 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onMoveUp(layer.id); }}
                  className="p-0.5 hover:text-text rounded"><ChevronUp size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown(layer.id); }}
                  className="p-0.5 hover:text-text rounded"><ChevronDown size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(layer.id); }}
                  className="p-0.5 hover:text-red-400 rounded"><Trash2 size={10} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected layer properties */}
      {selected && (
        <div className="border-t border-border/30 px-3 py-3 space-y-2.5">
          {/* Text content */}
          {selected.type === 'text' && (
            <div>
              <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Text</p>
              <textarea value={selected.content}
                onChange={(e) => onUpdate(selected.id, { content: e.target.value })}
                className="w-full h-16 bg-muted/40 border border-border/50 rounded px-2 py-1.5 text-xs text-text resize-none outline-none focus:border-primary/40" />
            </div>
          )}

          {/* Color */}
          <div>
            <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Farbe</p>
            <div className="flex gap-1.5 items-center">
              <input type="color" value={selected.color} onChange={(e) => onUpdate(selected.id, { color: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border border-border/50 bg-transparent p-0.5 shrink-0" />
              <input type="text" value={selected.color} onChange={(e) => onUpdate(selected.id, { color: e.target.value })}
                className="flex-1 bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text font-mono outline-none focus:border-primary/40" />
            </div>
          </div>

          {/* Text-specific properties */}
          {selected.type === 'text' && (() => {
            const tl = selected as TextLayer;
            return (
              <>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Größe</p>
                    <input type="number" value={tl.fontSize} onChange={(e) => onUpdate(selected.id, { fontSize: +e.target.value })}
                      className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Gewicht</p>
                    <select value={tl.fontWeight} onChange={(e) => onUpdate(selected.id, { fontWeight: e.target.value as any })}
                      className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40">
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Ausricht.</p>
                    <select value={tl.textAlign} onChange={(e) => onUpdate(selected.id, { textAlign: e.target.value as any })}
                      className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40">
                      <option value="left">Links</option>
                      <option value="center">Mitte</option>
                      <option value="right">Rechts</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Schrift</p>
                  <select value={tl.fontFamily} onChange={(e) => onUpdate(selected.id, { fontFamily: e.target.value })}
                    className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40">
                    {FONT_FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </>
            );
          })()}

          {/* Opacity + Rotation */}
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Deckkraft: {selected.opacity}%</p>
              <input type="range" min={10} max={100} value={selected.opacity}
                onChange={(e) => onUpdate(selected.id, { opacity: +e.target.value })}
                className="w-full accent-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Rotation: {selected.rotation}°</p>
              <input type="range" min={0} max={360} value={selected.rotation}
                onChange={(e) => onUpdate(selected.id, { rotation: +e.target.value })}
                className="w-full accent-primary" />
            </div>
          </div>

          {/* Position + Size */}
          <div className="flex gap-1">
            {(['x', 'y', 'width', 'height'] as const).map((k) => (
              <div key={k} className="flex-1">
                <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">{k === 'width' ? 'B' : k === 'height' ? 'H' : k.toUpperCase()}</p>
                <input type="number" value={Math.round(selected[k])}
                  onChange={(e) => onUpdate(selected.id, { [k]: +e.target.value })}
                  className="w-full bg-muted/40 border border-border/50 rounded px-1.5 py-1 text-xs text-text outline-none focus:border-primary/40" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
