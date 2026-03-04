import type { Editor } from '@tiptap/react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  return (
    <div
      className="absolute -top-11 left-0 flex items-center gap-0.5 bg-surface border border-border rounded-lg px-1.5 py-1 shadow-xl z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <FmtButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold size={14} />
      </FmtButton>
      <FmtButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic size={14} />
      </FmtButton>
      <FmtButton
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <Underline size={14} />
      </FmtButton>
      <div className="w-px h-5 bg-border mx-0.5" />
      <FmtButton
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Align Left"
      >
        <AlignLeft size={14} />
      </FmtButton>
      <FmtButton
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Align Center"
      >
        <AlignCenter size={14} />
      </FmtButton>
      <FmtButton
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Align Right"
      >
        <AlignRight size={14} />
      </FmtButton>
      <div className="w-px h-5 bg-border mx-0.5" />
      <input
        type="color"
        defaultValue="#ffffff"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
        title="Text Color"
      />
    </div>
  );
}

function FmtButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-text hover:bg-surface-hover'
      }`}
    >
      {children}
    </button>
  );
}
