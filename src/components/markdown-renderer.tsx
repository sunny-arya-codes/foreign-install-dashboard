import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  markdown: string;
};

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const normalizedMarkdown = markdown
    .replace(/^#\s+.+\n+/, "")
    .replace(/^Last checked:\s+.+\n+/m, "")
    .trim();

  return (
    <div className="prose prose-stone max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900 prose-li:text-slate-600 prose-a:text-teal-700 prose-a:no-underline hover:prose-a:text-teal-900 prose-table:text-sm prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-slate-900 prose-code:before:content-[''] prose-code:after:content-['']">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {normalizedMarkdown}
      </ReactMarkdown>
    </div>
  );
}
