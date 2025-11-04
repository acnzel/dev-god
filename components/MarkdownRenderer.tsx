"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Customize code blocks
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          // Customize links
          a({ children, href, ...props }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Customize tables
          table({ children, ...props }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td className="border border-gray-300 px-4 py-2" {...props}>
                {children}
              </td>
            );
          },
          // Customize lists
          ul({ children, ...props }: any) {
            return (
              <ul className="list-disc list-inside my-2 space-y-1" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: any) {
            return (
              <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
                {children}
              </ol>
            );
          },
          // Customize headings
          h1({ children, ...props }: any) {
            return (
              <h1 className="text-2xl font-bold mt-4 mb-2" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            return (
              <h2 className="text-xl font-bold mt-3 mb-2" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            return (
              <h3 className="text-lg font-bold mt-2 mb-1" {...props}>
                {children}
              </h3>
            );
          },
          // Customize paragraphs
          p({ children, ...props }: any) {
            return (
              <p className="my-2 leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
          // Customize blockquotes
          blockquote({ children, ...props }: any) {
            return (
              <blockquote
                className="border-l-4 border-gray-300 pl-4 py-2 my-2 italic bg-gray-50"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
