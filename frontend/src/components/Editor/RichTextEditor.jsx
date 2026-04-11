import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";

const RichTextEditor = ({ value, onChange }) => {

  const editor = useEditor({

    extensions: [

      StarterKit,

      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-slate-900 text-white p-3 rounded"
        }
      }),

      Placeholder.configure({
        placeholder: "Write answer here..."
      })

    ],

    content: value,

    onUpdate({ editor }) {

      onChange(editor.getHTML());

    }

  });

  if (!editor) return null;

  return (

    <div className="border rounded bg-white text-black">

      <div className="flex gap-2 border-b p-2 flex-wrap">

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className="px-2 py-1 bg-slate-200 rounded"
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className="px-2 py-1 bg-slate-200 rounded"
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className="px-2 py-1 bg-slate-200 rounded"
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }
          className="px-2 py-1 bg-slate-200 rounded"
        >
          Code Block
        </button>

      </div>

      <EditorContent
        editor={editor}
        className="p-4 min-h-[250px]"
      />

    </div>

  );

};

export default RichTextEditor;