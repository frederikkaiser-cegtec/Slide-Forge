import { EditorLayout } from './components/editor/EditorLayout';
import { PresentationMode } from './components/presentation/PresentationMode';
import { TemplatePicker } from './components/editor/TemplatePicker';
import { ThemePicker } from './components/editor/ThemePicker';
import { useEditorStore } from './stores/editorStore';
import { useFileSync } from './hooks/useFileSync';

function App() {
  const isPresentationMode = useEditorStore((s) => s.isPresentationMode);
  useFileSync();

  return (
    <>
      {isPresentationMode ? <PresentationMode /> : <EditorLayout />}
      <TemplatePicker />
      <ThemePicker />
    </>
  );
}

export default App;
