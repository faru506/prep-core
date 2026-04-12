import { useEffect, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  RotateCcw,
  Strikethrough
} from "lucide-react";

const formatOptions = [
  {
    label: "Paragraph",
    icon: Pilcrow,
    isActive: (editor) => editor.isActive("paragraph"),
    run: (editor) => editor.chain().focus().setParagraph().run()
  },
  {
    label: "Heading 1",
    icon: Heading1,
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run()
  },
  {
    label: "Heading 2",
    icon: Heading2,
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run()
  },
  {
    label: "Heading 3",
    icon: Heading3,
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run()
  }
];

const ToolbarButton = ({
  label,
  onClick,
  isActive = false,
  disabled = false,
  children
}) => (

  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition ${
      isActive
        ? "border-indigo-400/70 bg-indigo-500/15 text-indigo-100 shadow-[0_0_0_1px_rgba(129,140,248,0.16)]"
        : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
    } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
  >
    {children}
  </button>

);

const ToolbarDivider = () => (
  <div className="mx-1 h-8 w-px bg-slate-700/80" />
);

const RichTextEditor = ({ value, onChange }) => {
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "editor-code-block"
        }
      }),
      Placeholder.configure({
        placeholder: "Write the answer here. Use headings, lists, quotes, and code blocks to keep it clean."
      })
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "editor-surface"
      }
    },
    onUpdate({ editor: nextEditor }) {
      onChange(nextEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const nextValue = value || "";

    if (currentHtml !== nextValue) {
      editor.commands.setContent(nextValue, false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!showFormatMenu) return undefined;

    const handleWindowClick = () => {
      setShowFormatMenu(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [showFormatMenu]);

  if (!editor) return null;

  const activeFormat =
    formatOptions.find((option) =>
      option.isActive(editor)
    ) || formatOptions[0];

  return (

    <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-[0_20px_60px_rgba(2,6,23,0.55)]">

      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-3 py-3">

        <div className="mb-3 flex items-center justify-between gap-3">

          <div>
            <p className="text-sm font-semibold text-slate-100">
              Answer Editor
            </p>
            <p className="text-xs text-slate-400">
              Structure long answers with headings, lists, quotes, and code.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <ToolbarButton
              label="Undo"
              onClick={() =>
                editor.chain().focus().undo().run()
              }
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <RotateCcw size={16} />
            </ToolbarButton>

            <ToolbarButton
              label="Redo"
              onClick={() =>
                editor.chain().focus().redo().run()
              }
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <Redo2 size={16} />
            </ToolbarButton>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          <div className="relative">

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setShowFormatMenu((current) => !current);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              <activeFormat.icon size={16} />
              <span>{activeFormat.label}</span>
              <ChevronDown size={16} className={`transition ${showFormatMenu ? "rotate-180" : ""}`} />
            </button>

            {showFormatMenu && (

              <div
                className="absolute left-0 top-12 z-20 w-52 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl shadow-black/40"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                {formatOptions.map((option) => {
                  const OptionIcon = option.icon;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        option.run(editor);
                        setShowFormatMenu(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                        option.isActive(editor)
                          ? "bg-indigo-500/15 text-indigo-100"
                          : "text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <OptionIcon size={16} />
                      <span>{option.label}</span>
                    </button>
                  );
                })}

              </div>

            )}

          </div>

          <ToolbarDivider />

          <ToolbarButton
            label="Bold"
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            isActive={editor.isActive("bold")}
          >
            <Bold size={16} />
          </ToolbarButton>

          <ToolbarButton
            label="Italic"
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            isActive={editor.isActive("italic")}
          >
            <Italic size={16} />
          </ToolbarButton>

          <ToolbarButton
            label="Strike"
            onClick={() =>
              editor.chain().focus().toggleStrike().run()
            }
            isActive={editor.isActive("strike")}
          >
            <Strikethrough size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Bullet List"
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            isActive={editor.isActive("bulletList")}
          >
            <List size={16} />
          </ToolbarButton>

          <ToolbarButton
            label="Numbered List"
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            isActive={editor.isActive("orderedList")}
          >
            <ListOrdered size={16} />
          </ToolbarButton>

          <ToolbarButton
            label="Blockquote"
            onClick={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
            isActive={editor.isActive("blockquote")}
          >
            <Quote size={16} />
          </ToolbarButton>

          <ToolbarButton
            label="Code Block"
            onClick={() =>
              editor.chain().focus().toggleCodeBlock().run()
            }
            isActive={editor.isActive("codeBlock")}
          >
            <Code2 size={16} />
          </ToolbarButton>

          <ToolbarButton
            label="Horizontal Rule"
            onClick={() =>
              editor.chain().focus().setHorizontalRule().run()
            }
          >
            <Minus size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
          >
            <RemoveFormatting size={16} />
            <span>Clear</span>
          </button>

        </div>

      </div>

      <div className="border-t border-slate-800 bg-slate-950">
        <EditorContent editor={editor} />
      </div>

    </div>

  );

};

export default RichTextEditor;
