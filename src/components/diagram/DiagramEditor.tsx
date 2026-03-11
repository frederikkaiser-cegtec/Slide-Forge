import { useCallback, useEffect, useState } from 'react';
import { DiagramCanvas } from './DiagramCanvas';
import { DiagramSidebar } from './DiagramSidebar';
import { DiagramProperties } from './DiagramProperties';
import { DiagramToolbar } from './DiagramToolbar';
import { AnimationPanel } from './AnimationPanel';
import { AnimationTimelineBar } from './AnimationTimelineBar';
import { PromptInput } from './PromptInput';
import { ExportPreviewModal } from './ExportPreviewModal';
import { ExportOptionsModal } from './ExportOptionsModal';
import { SavedDiagramsModal } from './SavedDiagramsModal';
import { useDiagramStore } from '../../stores/diagramStore';
import { useEditorStore } from '../../stores/editorStore';
import { useSavedDiagramsStore } from '../../stores/savedDiagramsStore';
import { autoLayoutDiagram } from '../../utils/diagramLayout';
import { generateDiagramHTML } from '../../export/htmlExporter';
import { generateAnimatedSVG } from '../../export/svgExporter';
import { exportGIF } from '../../export/gifExporter';
import { exportVideo } from '../../export/videoExporter';

export function DiagramEditor() {
  const { diagram, setNodes, setEdges, removeNode, removeEdge } = useDiagramStore();
  const {
    selectedNodeId,
    selectedEdgeId,
    setDiagramTool,
    clearDiagramSelection,
    showExportPreview,
    setShowExportPreview,
  } = useEditorStore();

  const handleAutoLayout = useCallback(() => {
    const { nodes, edges } = autoLayoutDiagram(diagram.nodes, diagram.edges, diagram.diagramType);
    setNodes(nodes);
    setEdges(edges);
  }, [diagram.nodes, diagram.edges, diagram.diagramType, setNodes, setEdges]);

  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showSavedDiagrams, setShowSavedDiagrams] = useState(false);

  const handleExportHTML = useCallback(() => {
    const html = generateDiagramHTML(diagram);
    navigator.clipboard.writeText(html).then(() => {
      alert('HTML in Zwischenablage kopiert!');
    });
  }, [diagram]);

  const handleExportSVG = useCallback(() => {
    const svg = generateAnimatedSVG(diagram);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagram.title.replace(/\s+/g, '-')}-animated.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [diagram]);

  const handleExportGIF = useCallback(() => {
    setShowExportOptions(true);
  }, []);

  const handleExportVideo = useCallback(() => {
    setShowExportOptions(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'v':
          setDiagramTool('select');
          break;
        case 'n':
          setDiagramTool('addNode');
          break;
        case 'e':
          setDiagramTool('drawEdge');
          break;
        case 'h':
          setDiagramTool('pan');
          break;
        case 'delete':
        case 'backspace':
          if (selectedNodeId) removeNode(selectedNodeId);
          if (selectedEdgeId) removeEdge(selectedEdgeId);
          clearDiagramSelection();
          break;
        case 'escape':
          clearDiagramSelection();
          break;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          useDiagramStore.getState().redo();
        } else {
          useDiagramStore.getState().undo();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const { diagram } = useDiagramStore.getState();
        useSavedDiagramsStore.getState().save(diagram.title || 'Unbenannt', diagram);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, selectedEdgeId, setDiagramTool, removeNode, removeEdge, clearDiagramSelection]);

  return (
    <div className="h-full flex flex-col">
      <DiagramToolbar
        onAutoLayout={handleAutoLayout}
        onExportHTML={handleExportHTML}
        onExportSVG={handleExportSVG}
        onExportGIF={handleExportGIF}
        onExportVideo={handleExportVideo}
        onShowSavedDiagrams={() => setShowSavedDiagrams(true)}
      />
      <PromptInput />
      <div className="flex-1 flex overflow-hidden relative">
        <DiagramSidebar />
        <DiagramCanvas />
        <AnimationPanel />
        <DiagramProperties />
      </div>
      <AnimationTimelineBar />

      {showExportPreview && (
        <ExportPreviewModal
          diagram={diagram}
          onClose={() => setShowExportPreview(false)}
        />
      )}

      {showExportOptions && (
        <ExportOptionsModal
          diagram={diagram}
          onClose={() => setShowExportOptions(false)}
        />
      )}

      {showSavedDiagrams && (
        <SavedDiagramsModal onClose={() => setShowSavedDiagrams(false)} />
      )}
    </div>
  );
}
