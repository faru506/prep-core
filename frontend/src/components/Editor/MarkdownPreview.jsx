import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownPreview = ({ content = "", className = "" }) => (
  <div className={`markdown-preview prose prose-invert max-w-none text-slate-300 ${className}`.trim()}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownPreview;
