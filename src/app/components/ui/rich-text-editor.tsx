import { useEffect, useCallback, useState, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
  Table as TableIcon,
  Pilcrow,
  Trash2,
  Columns2,
  ArrowLeft,
  ArrowRight,
  PanelLeftClose,
  Rows3,
  ArrowUp,
  ArrowDown,
  PanelTopClose,
} from "lucide-react";
import { cn } from "./utils";

/* ================================================================
   Types
   ================================================================ */

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

/* ================================================================
   Toolbar Button
   ================================================================ */

function ToolbarButton({
  onClick,
  disabled = false,
  active = false,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer",
        "hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-gray-200 text-gray-900",
        !active && "text-gray-600",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="mx-1 h-6 w-px bg-gray-200" />;
}

/* ================================================================
   Table Controls (shown when cursor is inside a table)
   ================================================================ */

function TableControls({ editor }: { editor: Editor }) {
  if (!editor.isActive("table")) return null;

  return (
    <>
      <ToolbarSeparator />
      {/* Add column before */}
      <ToolbarButton
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Add column before"
      >
        <Columns2 className="h-4 w-4" />
        <ArrowLeft className="h-3 w-3" />
      </ToolbarButton>

      {/* Add column after */}
      <ToolbarButton
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add column after"
      >
        <Columns2 className="h-4 w-4" />
        <ArrowRight className="h-3 w-3" />
      </ToolbarButton>

      {/* Delete column */}
      <ToolbarButton
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="Delete column"
      >
        <PanelLeftClose className="h-4 w-4" />
      </ToolbarButton>

      {/* Add row before */}
      <ToolbarButton
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Add row before"
      >
        <Rows3 className="h-4 w-4" />
        <ArrowUp className="h-3 w-3" />
      </ToolbarButton>

      {/* Add row after */}
      <ToolbarButton
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add row after"
      >
        <Rows3 className="h-4 w-4" />
        <ArrowDown className="h-3 w-3" />
      </ToolbarButton>

      {/* Delete row */}
      <ToolbarButton
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="Delete row"
      >
        <PanelTopClose className="h-4 w-4" />
      </ToolbarButton>

      {/* Delete table */}
      <ToolbarButton
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Delete table"
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
    </>
  );
}

/* ================================================================
   Link Dialog
   ================================================================ */

function LinkDialog({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(
    (editor.getAttributes("link").href as string) ?? "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (url.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url.trim(), target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div
        className="rounded-lg border bg-white p-4 shadow-lg w-96"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-semibold mb-2">Insert Link</p>
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mb-3"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-800 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Toolbar
   ================================================================ */

function Toolbar({ editor }: { editor: Editor }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const setLink = useCallback(() => {
    if (editor.isActive("link")) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      setShowLinkDialog(true);
    }
  }, [editor]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-input bg-gray-50 px-2 py-1.5">
        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Paragraph */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph") && !editor.isActive("heading")}
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>

        {/* Headings */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Table */}
        <ToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>

        {/* Table controls (add/remove rows/columns) */}
        <TableControls editor={editor} />
      </div>

      {showLinkDialog && (
        <LinkDialog editor={editor} onClose={() => setShowLinkDialog(false)} />
      )}
    </>
  );
}

/* ================================================================
   Main Component
   ================================================================ */

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  minHeight = "200px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] px-4 py-3",
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  // Sync external value changes (e.g., form reset)
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!editor) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const currentContent = editor.getHTML();
    if (value !== currentContent) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  // Mark internal updates to avoid loops
  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      isInternalUpdate.current = true;
    };
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-input bg-background shadow-sm overflow-hidden",
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
