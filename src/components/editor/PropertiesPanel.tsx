import { useState } from 'react';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { Trash2, ImagePlus, Lock, Unlock, Type } from 'lucide-react';
import type { SlideElement, ElementStyle } from '../../types';
import { generateId } from '../../utils/id';
import { getTheme } from '../../themes';
import { AssetLibraryModal } from '../graphics/AssetLibraryModal';

export function PropertiesPanel() {
  const slides = usePresentationStore((s) => s.presentation.slides);
  const themeId = usePresentationStore((s) => s.presentation.themeId);
  const selectedSlideId = useEditorStore((s) => s.selectedSlideId);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const updateElement = usePresentationStore((s) => s.updateElement);
  const removeElement = usePresentationStore((s) => s.removeElement);
  const addElement = usePresentationStore((s) => s.addElement);
  const pushUndo = usePresentationStore((s) => s.pushUndo);
  const clearSelection = useEditorStore((s) => s.clearSelection);

  const slide = slides.find((s) => s.id === selectedSlideId);
  const element = slide?.elements.find((e) => e.id === selectedElementId);
  const theme = getTheme(themeId);

  const handleUpdate = (updates: Partial<SlideElement>) => {
    if (selectedSlideId && selectedElementId) {
      updateElement(selectedSlideId, selectedElementId, updates);
    }
  };

  const handleStyleUpdate = (styleUpdates: Partial<ElementStyle>) => {
    if (selectedSlideId && selectedElementId && element) {
      updateElement(selectedSlideId, selectedElementId, {
        style: { ...element.style, ...styleUpdates },
      });
    }
  };

  const handleToggleLock = () => {
    if (selectedSlideId && selectedElementId && element) {
      pushUndo();
      updateElement(selectedSlideId, selectedElementId, { locked: !element.locked });
    }
  };

  const handleAddText = () => {
    if (!selectedSlideId) return;
    pushUndo();
    addElement(selectedSlideId, {
      id: generateId(),
      type: 'text',
      x: 20, y: 40, width: 60, height: 20,
      rotation: 0,
      content: '<p>New text</p>',
      style: { fontSize: 32, color: theme.colors.text, textAlign: 'center' },
    });
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !selectedSlideId) return;
      const reader = new FileReader();
      reader.onload = () => {
        pushUndo();
        addElement(selectedSlideId, {
          id: generateId(),
          type: 'image',
          x: 20, y: 20, width: 60, height: 60,
          rotation: 0,
          content: reader.result as string,
          style: { objectFit: 'cover', borderRadius: 8 },
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const isLocked = !!element?.locked;
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);

  const handleAddSvg = (svg: string) => {
    if (!selectedSlideId) return;
    pushUndo();
    addElement(selectedSlideId, {
      id: generateId(),
      type: 'svg',
      x: 10, y: 10, width: 20, height: 20,
      rotation: 0,
      content: svg,
      style: { color: '#ffffff', opacity: 1 },
    });
  };

  return (
    <div className="w-64 bg-surface border-l border-border flex flex-col shrink-0">
      <div className="p-3 border-b border-border">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Properties</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Add elements */}
        <div>
          <label className="text-xs text-text-muted font-medium block mb-2">Add Element</label>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleAddText} className="flex-1 py-2 text-xs bg-surface-hover hover:bg-border rounded-md text-text transition-colors flex items-center justify-center gap-1">
              <Type size={11} /> Text
            </button>
            <button onClick={handleAddImage} className="flex-1 py-2 text-xs bg-surface-hover hover:bg-border rounded-md text-text transition-colors flex items-center justify-center gap-1">
              <ImagePlus size={11} /> Image
            </button>
            <button onClick={() => setShowAssetLibrary(true)} className="w-full py-2 text-xs bg-surface-hover hover:bg-border rounded-md text-text transition-colors flex items-center justify-center gap-1">
              <ImagePlus size={11} /> SVG aus Library
            </button>
          </div>
        </div>

        {/* Layer list */}
        {slide && slide.elements.length > 0 && (
          <div>
            <label className="text-xs text-text-muted font-medium block mb-2">Ebenen ({slide.elements.length})</label>
            <div className="space-y-1">
              {[...slide.elements].reverse().map((el) => (
                <div key={el.id}
                  onClick={() => useEditorStore.getState().selectElement(el.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors ${selectedElementId === el.id ? 'bg-primary/15 text-text' : 'hover:bg-surface-hover text-text-muted'}`}>
                  <span className="shrink-0 text-[10px]">{el.type === 'text' ? 'T' : el.type === 'svg' ? '⬡' : el.type === 'image' ? '🖼' : '▭'}</span>
                  <span className="flex-1 truncate">{el.type === 'text' ? el.content.replace(/<[^>]+>/g, '').slice(0, 20) || '(leer)' : el.type === 'svg' ? 'SVG' : el.type === 'image' ? 'Bild' : 'Form'}</span>
                  <button onClick={(e) => { e.stopPropagation(); if (!el.locked) { pushUndo(); removeElement(selectedSlideId!, el.id); clearSelection(); } }}
                    className="shrink-0 hover:text-red-400 transition-colors disabled:opacity-30" disabled={!!el.locked}>
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {element ? (
          <>
            <div className="w-full h-px bg-border" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-text-muted font-medium">
                  {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element
                </label>
                <button
                  onClick={handleToggleLock}
                  title={isLocked ? 'Unlock element' : 'Lock element'}
                  className={`p-1 rounded transition-colors ${
                    isLocked
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'hover:bg-surface-hover text-text-muted hover:text-text'
                  }`}
                >
                  {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <PropInput label="X %" value={element.x} onChange={(v) => handleUpdate({ x: v })} disabled={isLocked} />
                <PropInput label="Y %" value={element.y} onChange={(v) => handleUpdate({ y: v })} disabled={isLocked} />
                <PropInput label="W %" value={element.width} onChange={(v) => handleUpdate({ width: v })} disabled={isLocked} />
                <PropInput label="H %" value={element.height} onChange={(v) => handleUpdate({ height: v })} disabled={isLocked} />
              </div>

              {/* Style options */}
              {element.type === 'text' && (
                <div className="space-y-2">
                  <PropInput
                    label="Font Size"
                    value={element.style.fontSize || 24}
                    onChange={(v) => handleStyleUpdate({ fontSize: v })}
                  />
                  <div>
                    <label className="text-[10px] text-text-muted">Color</label>
                    <input
                      type="color"
                      value={element.style.color || '#ffffff'}
                      onChange={(e) => handleStyleUpdate({ color: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer bg-transparent border border-border"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-muted">Align</label>
                    <div className="flex gap-1 mt-1">
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => handleStyleUpdate({ textAlign: align })}
                          className={`flex-1 py-1 text-xs rounded ${
                            element.style.textAlign === align ? 'bg-primary text-white' : 'bg-surface-hover text-text-muted'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {element.type === 'svg' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-text-muted">Farbe</label>
                    <input type="color" value={element.style.color || '#ffffff'}
                      onChange={(e) => handleStyleUpdate({ color: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer bg-transparent border border-border" />
                  </div>
                  <PropInput label="Deckkraft %" value={(element.style.opacity ?? 1) * 100}
                    onChange={(v) => handleStyleUpdate({ opacity: v / 100 })} />
                </div>
              )}

              {(element.type === 'shape' || element.type === 'image') && (
                <div className="space-y-2">
                  {element.type === 'shape' && (
                    <div>
                      <label className="text-[10px] text-text-muted">Background</label>
                      <input
                        type="color"
                        value={element.style.backgroundColor || '#333333'}
                        onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
                        className="w-full h-8 rounded cursor-pointer bg-transparent border border-border"
                      />
                    </div>
                  )}
                  <PropInput
                    label="Border Radius"
                    value={element.style.borderRadius || 0}
                    onChange={(v) => handleStyleUpdate({ borderRadius: v })}
                  />
                  {element.type === 'image' && (
                    <PropInput
                      label="Scale %"
                      value={element.style.scale ?? 100}
                      onChange={(v) => handleStyleUpdate({ scale: v })}
                    />
                  )}
                  <PropInput
                    label="Opacity"
                    value={(element.style.opacity ?? 1) * 100}
                    onChange={(v) => handleStyleUpdate({ opacity: v / 100 })}
                  />
                </div>
              )}

              <button
                onClick={() => {
                  if (selectedSlideId && selectedElementId) {
                    if (isLocked) return;
                    pushUndo();
                    removeElement(selectedSlideId, selectedElementId);
                    clearSelection();
                  }
                }}
                disabled={isLocked}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs bg-danger/10 text-danger hover:bg-danger/20 rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Trash2 size={12} /> Delete Element
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-text-muted">Select an element to edit its properties</p>
        )}
      </div>
      {showAssetLibrary && (
        <AssetLibraryModal
          onClose={() => setShowAssetLibrary(false)}
          onInsert={(svg) => { handleAddSvg(svg); setShowAssetLibrary(false); }}
        />
      )}
    </div>
  );
}

function PropInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] text-text-muted">{label}</label>
      <input
        type="number"
        value={Math.round(value * 10) / 10}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        className="w-full bg-bg border border-border rounded px-2 py-1 text-xs text-text outline-none focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  );
}
