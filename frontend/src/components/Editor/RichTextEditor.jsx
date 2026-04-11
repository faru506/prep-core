import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  List,
  Code
} from "lucide-react";

const RichTextEditor = ({ value, onChange }) => {

  const editor = useEditor({

    extensions: [

      StarterKit,

      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "bg-slate-900 text-white p-4 rounded-lg"
        }
      }),

      Placeholder.configure({
        placeholder:
          "Write answer here... (supports code, lists, formatting)"
      })

    ],

    content: value,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    }

  });

  if (!editor) return null;

  const Button = ({
    onClick,
    isActive,
    children
  }) => (

    <button
      type="button"
      onClick={onClick}
      className={`
        p-2 rounded-md transition
        ${isActive
          ? "bg-indigo-600 text-white"
          : "bg-slate-100 hover:bg-slate-200"}
      `}
    >
      {children}
    </button>

  );

  return (

    <div className="border border-slate-700 rounded-xl overflow-hidden bg-white text-black shadow-lg">

      {/* Toolbar */}

      <div className="flex flex-wrap items-center gap-2 border-b bg-slate-50 p-2">

        <Button
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          isActive={editor.isActive("bold")}
        >
          <Bold size={16} />
        </Button>

]        <Button
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          isActive={editor.isActive("italic")}
        >
          <Italic size={16} />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <Button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          isActive={editor.isActive("bulletList")}
        >
          <List size={16} />
        </Button>

        <Button
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }
          isActive={editor.isActive("codeBlock")}
        >
          <Code size={16} />
        </Button>

      </div>

      <EditorContent
        editor={editor}
        className="
          p-5
          min-h-[300px]
          prose
          max-w-none
          focus:outline-none
        "
      />

    </div>

  );

};

export default RichTextEditor;