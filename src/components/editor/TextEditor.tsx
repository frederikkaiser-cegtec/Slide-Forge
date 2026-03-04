import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useEffect, useRef } from 'react';
import { FloatingToolbar } from './FloatingToolbar';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur: () => void;
  pushUndo: () => void;
}

export function TextEditor({ content, onChange, onBlur, pushUndo }: TextEditorProps) {
  const hasUndoPushed = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      if (!hasUndoPushed.current) {
        pushUndo();
        hasUndoPushed.current = true;
      }
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
        style: 'outline: none; height: 100%;',
      },
      handleKeyDown: (_view, event) => {
        if (event.key === 'Escape') {
          onBlur();
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus('end');
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <FloatingToolbar editor={editor} />
      <EditorContent editor={editor} style={{ height: '100%' }} />
    </>
  );
}
