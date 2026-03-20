import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface TextBlock {
  type: "text";
  content: string;
}

interface CodeBlock {
  type: "code";
  lang: string;
  code: string;
}

interface InfoBlock {
  type: "info";
  variant: "tip" | "warn" | "note" | "danger";
  content: string;
}

interface RealWorldBlock {
  type: "real-world";
  content: string;
}

interface MathBlock {
  type: "math";
  title: string;
  content: string;
}

interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

interface OutputBlock {
  type: "output";
  content: string;
}

type Block = TextBlock | CodeBlock | InfoBlock | RealWorldBlock | MathBlock | TableBlock | OutputBlock;

interface NoteSection {
  heading: string;
  icon?: string;
  blocks: Block[];
}

interface NotesData {
  title: string;
  subtitle: string;
  tags: string[];
  sections: NoteSection[];
}

interface NotesDisplayProps {
  data: NotesData;
}

const tagColors = [
  "bg-[hsl(225,60%,25%)] text-[hsl(215,80%,70%)] border-[hsl(225,60%,35%)]",
  "bg-[hsl(0,50%,20%)] text-[hsl(0,70%,75%)] border-[hsl(0,50%,30%)]",
  "bg-[hsl(160,50%,15%)] text-[hsl(160,80%,65%)] border-[hsl(160,50%,25%)]",
  "bg-[hsl(45,50%,18%)] text-[hsl(45,80%,70%)] border-[hsl(45,50%,28%)]",
];

const infoVariants = {
  tip: {
    bg: "bg-[hsl(160,40%,8%)]",
    border: "border-[hsl(160,60%,30%)]",
    text: "text-[hsl(160,60%,80%)]",
    icon: "💡",
  },
  warn: {
    bg: "bg-[hsl(45,40%,8%)]",
    border: "border-[hsl(45,60%,30%)]",
    text: "text-[hsl(45,60%,80%)]",
    icon: "⚠️",
  },
  note: {
    bg: "bg-[hsl(250,40%,10%)]",
    border: "border-[hsl(250,60%,35%)]",
    text: "text-[hsl(250,60%,80%)]",
    icon: "📝",
  },
  danger: {
    bg: "bg-[hsl(0,40%,10%)]",
    border: "border-[hsl(0,60%,30%)]",
    text: "text-[hsl(0,60%,80%)]",
    icon: "🚨",
  },
};

function HighlightedText({ content }: { content: string }) {
  const parts = content.split(/(<hl>.*?<\/hl>)/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^<hl>(.*)<\/hl>$/);
        if (match) {
          return (
            <span key={i} className="text-[hsl(160,80%,65%)] font-semibold">
              {match[1]}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function CodeBlockRenderer({ block }: { block: CodeBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[10px] border border-[hsl(240,15%,20%)] overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[hsl(240,15%,12%)] border-b border-[hsl(240,15%,20%)]">
        <span className="font-mono text-[0.72rem] font-semibold text-[hsl(250,100%,75%)] uppercase tracking-wider">
          {block.lang}
        </span>
        <button
          onClick={handleCopy}
          className="font-mono text-[0.72rem] px-2 py-0.5 border border-[hsl(240,15%,20%)] text-[hsl(240,20%,50%)] rounded hover:border-[hsl(250,100%,75%)] hover:text-[hsl(250,100%,75%)] transition-colors"
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" /> copied
            </span>
          ) : (
            "copy"
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-[0.82rem] leading-[1.7] text-[hsl(240,20%,85%)] bg-[hsl(240,20%,5%)]">
        <code>{block.code}</code>
      </pre>
    </div>
  );
}

function InfoBlockRenderer({ block }: { block: InfoBlock }) {
  const style = infoVariants[block.variant] || infoVariants.note;
  return (
    <div
      className={`rounded-[10px] p-3 px-4 my-3 flex gap-3 items-start border ${style.bg} ${style.border} ${style.text}`}
    >
      <span className="text-lg shrink-0 mt-0.5">{style.icon}</span>
      <p className="text-[0.88rem] leading-[1.7]">
        <HighlightedText content={block.content} />
      </p>
    </div>
  );
}

function RealWorldRenderer({ block }: { block: RealWorldBlock }) {
  return (
    <div className="my-3 rounded-[10px] border border-[hsl(45,60%,30%)] border-l-4 border-l-[hsl(45,80%,60%)] bg-gradient-to-r from-[hsl(45,30%,7%)] to-[hsl(0,20%,6%)] p-4 px-5">
      <div className="font-mono text-[0.7rem] font-bold tracking-[2px] uppercase text-[hsl(45,80%,60%)] mb-2">
        🌍 Real World Example
      </div>
      <p className="text-[0.88rem] text-[hsl(45,60%,80%)] leading-[1.7]">
        <HighlightedText content={block.content} />
      </p>
    </div>
  );
}

function MathBlockRenderer({ block }: { block: MathBlock }) {
  return (
    <div className="my-3 rounded-[10px] border border-[hsl(250,60%,35%)] border-l-4 border-l-[hsl(250,100%,70%)] bg-gradient-to-r from-[hsl(250,30%,8%)] to-[hsl(160,20%,6%)] p-4 px-5">
      <div className="font-mono text-[0.7rem] font-bold tracking-[2px] uppercase text-[hsl(250,100%,70%)] mb-2">
        {block.title}
      </div>
      <pre className="font-mono text-[0.9rem] text-[hsl(250,40%,85%)] leading-[1.8] whitespace-pre-wrap">
        {block.content}
      </pre>
    </div>
  );
}

function TableBlockRenderer({ block }: { block: TableBlock }) {
  return (
    <div className="overflow-x-auto my-3 rounded-[10px] border border-[hsl(240,15%,20%)]">
      <table className="w-full text-[0.85rem] border-collapse">
        <thead>
          <tr>
            {block.headers.map((h, i) => (
              <th
                key={i}
                className="bg-[hsl(240,15%,12%)] px-4 py-2.5 text-left font-mono text-[0.75rem] uppercase tracking-wider text-[hsl(240,20%,50%)] border-b border-[hsl(240,15%,20%)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-[hsl(250,30%,12%)] transition-colors">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-2.5 border-b border-[hsl(240,10%,15%)] text-[hsl(240,15%,70%)] leading-[1.5]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OutputBlockRenderer({ block }: { block: OutputBlock }) {
  return (
    <div className="my-3">
      <div className="font-mono text-[0.65rem] tracking-[2px] uppercase text-[hsl(240,20%,50%)] mb-1">
        Output
      </div>
      <div className="bg-[hsl(240,20%,3%)] border border-dashed border-[hsl(240,15%,20%)] rounded-lg p-3 font-mono text-[0.8rem] text-[hsl(120,100%,75%)] leading-[1.7] whitespace-pre-wrap">
        {block.content}
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-[0.92rem] leading-[1.75] text-[hsl(240,15%,70%)] my-2">
          <HighlightedText content={block.content} />
        </p>
      );
    case "code":
      return <CodeBlockRenderer block={block} />;
    case "info":
      return <InfoBlockRenderer block={block} />;
    case "real-world":
      return <RealWorldRenderer block={block} />;
    case "math":
      return <MathBlockRenderer block={block} />;
    case "table":
      return <TableBlockRenderer block={block} />;
    case "output":
      return <OutputBlockRenderer block={block} />;
    default:
      return null;
  }
}

export default function NotesDisplay({ data }: NotesDisplayProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center mb-2">
          {data.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-[0.75rem] font-bold font-mono tracking-wider border ${tagColors[i % tagColors.length]}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Table of Contents */}
      <div className="bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-xl p-4">
        <div className="font-mono text-[0.75rem] font-bold tracking-[2px] uppercase text-[hsl(240,20%,45%)] mb-3">
          📚 Table of Contents
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {data.sections.map((section, i) => (
            <a
              key={i}
              href={`#note-section-${i}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[hsl(240,15%,14%)] transition-colors text-[0.88rem] text-[hsl(240,15%,65%)] hover:text-[hsl(240,15%,90%)]"
            >
              <span className="font-mono text-[0.75rem] text-[hsl(250,100%,70%)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      {data.sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          id={`note-section-${sectionIndex}`}
          className="animate-fade-in"
          style={{ animationDelay: `${sectionIndex * 0.08}s` }}
        >
          {/* Section Header */}
          <button
            onClick={() => toggleSection(sectionIndex)}
            className="w-full flex items-center gap-3 mb-4 pb-3 border-b border-[hsl(240,15%,20%)] cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[hsl(250,100%,70%)] to-[hsl(160,80%,55%)] rounded-[10px] flex items-center justify-center font-mono text-[0.85rem] font-bold text-white shrink-0">
              {String(sectionIndex + 1).padStart(2, "0")}
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-extrabold text-[hsl(240,15%,92%)] tracking-tight">
                {section.icon && <span className="mr-2">{section.icon}</span>}
                {section.heading}
              </div>
            </div>
            <div className="shrink-0 text-[hsl(240,15%,50%)] group-hover:text-[hsl(250,100%,70%)] transition-colors">
              {collapsedSections.has(sectionIndex) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </div>
          </button>

          {/* Section Content */}
          {!collapsedSections.has(sectionIndex) && (
            <div className="bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-xl p-5 mb-2">
              {section.blocks.map((block, blockIndex) => (
                <BlockRenderer key={blockIndex} block={block} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export type { NotesData, NoteSection, Block };
