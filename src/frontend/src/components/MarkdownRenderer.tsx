import type { ReactNode } from "react";

interface Props {
  content: string;
  className?: string;
}

function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Code span
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={key++}
          className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
        >
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }
    // Bold
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }
    // Italic
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }
    // Regular char
    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }
  return parts;
}

export function MarkdownRenderer({ content, className }: Props) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={key++}
          className="bg-muted rounded-md p-3 overflow-x-auto my-2 text-sm font-mono"
          data-lang={lang}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      const cls =
        level === 1
          ? "text-lg font-bold mt-3 mb-1"
          : level === 2
            ? "text-base font-semibold mt-2 mb-1"
            : "text-sm font-semibold mt-2 mb-1";
      elements.push(
        <Tag key={key++} className={cls}>
          {parseInline(text)}
        </Tag>,
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*+]\s+/)) {
      const items: ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^[-*+]\s+/)) {
        items.push(
          <li key={i}>{parseInline(lines[i].replace(/^[-*+]\s+/, ""))}</li>,
        );
        i++;
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside my-1 space-y-0.5">
          {items}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      const items: ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(
          <li key={i}>{parseInline(lines[i].replace(/^\d+\.\s+/, ""))}</li>,
        );
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside my-1 space-y-0.5">
          {items}
        </ol>,
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<br key={key++} />);
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} className="leading-relaxed">
        {parseInline(line)}
      </p>,
    );
    i++;
  }

  return <div className={className}>{elements}</div>;
}
