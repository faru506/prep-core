import { useId, useRef, useState } from "react";

import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote
} from "lucide-react";

import MarkdownPreview from "./MarkdownPreview";

const toolbarActions = [
  {
    label: "Bold",
    icon: Bold,
    apply: (text) => `**${text || "bold text"}**`
  },
  {
    label: "Italic",
    icon: Italic,
    apply: (text) => `*${text || "italic text"}*`
  },
  {
    label: "Heading 1",
    icon: Heading1,
    apply: (text) => `# ${text || "Heading"}`
  },
  {
    label: "Heading 2",
    icon: Heading2,
    apply: (text) => `## ${text || "Subheading"}`
  },
  {
    label: "Quote",
    icon: Quote,
    apply: (text) => `> ${text || "Quoted note"}`
  },
  {
    label: "Bullet List",
    icon: List,
    apply: (text) => `- ${text || "List item"}`
  },
  {
    label: "Numbered List",
    icon: ListOrdered,
    apply: (text) => `1. ${text || "List item"}`
  },
  {
    label: "Inline Code",
    icon: Code2,
    apply: (text) => `\`${text || "code"}\``
  },
  {
    label: "Link",
    icon: Link2,
    apply: (text) => `[${text || "link text"}](https://example.com)`
  }
];

const codeBlockTemplate = "```js\nconst answer = 'Add your example here';\n```";

const insertAtSelection = (value, selectionStart, selectionEnd, nextText) => ({
  nextValue: `${value.slice(0, selectionStart)}${nextText}${value.slice(selectionEnd)}`,
  nextSelectionStart: selectionStart,
  nextSelectionEnd: selectionStart + nextText.length
});

const MarkdownEditor = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState("write");
  const textareaRef = useRef(null);
  const helpTextId = useId();

  const applyToolbarAction = (formatter) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      onChange(formatter(""));
      return;
    }

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const formattedText = formatter(selectedText);
    const { nextValue, nextSelectionStart, nextSelectionEnd } = insertAtSelection(
      value,
      selectionStart,
      selectionEnd,
      formattedText
    );

    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-[0_20px_60px_rgba(2,6,23,0.55)]">
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-3 py-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">
              Answer Editor
            </p>
            <p className="text-xs text-slate-400">
              Write in Markdown and preview it before saving.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900 p-1">
            {["write", "preview"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "write" && (
          <div className="flex flex-wrap items-center gap-2">
            {toolbarActions.map((action) => {
              const ActionIcon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  aria-label={action.label}
                  title={action.label}
                  onClick={() => applyToolbarAction(action.apply)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                >
                  <ActionIcon size={16} />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => applyToolbarAction(() => codeBlockTemplate)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            >
              Code Block
            </button>
          </div>
        )}
      </div>

      {activeTab === "write" ? (
        <div className="space-y-3 p-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="markdown-textarea min-h-[360px] w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            placeholder={"Use Markdown for structure.\n\nExample:\n## Approach\n- Explain the idea\n- Add tradeoffs\n\n```js\nconsole.log('example');\n```"}
            aria-describedby={helpTextId}
            spellCheck={false}
          />

          <p id={helpTextId} className="text-xs text-slate-500">
            Use fenced code blocks for examples so preview and InterviewQA stay identical.
          </p>
        </div>
      ) : (
        <div className="min-h-[360px] bg-slate-950/60 px-5 py-5">
          {value.trim() ? (
            <MarkdownPreview content={value} />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-800 text-sm text-slate-500">
              Nothing to preview yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
