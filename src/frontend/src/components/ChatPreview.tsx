import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "../utils/chatParser";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Props {
  messages: ChatMessage[];
  platform: string;
  title: string;
}

/** Stable key for a message — role + first 32 chars of content */
function msgKey(msg: ChatMessage, pos: number): string {
  return `${msg.role}-${pos}-${msg.content.slice(0, 16)}`;
}

function PlatformBadge({ platform }: { platform: string }) {
  const label =
    platform === "chatgpt"
      ? "ChatGPT"
      : platform === "grok"
        ? "Grok"
        : "Unknown";
  return (
    <Badge variant="secondary" className="text-xs capitalize">
      {label}
    </Badge>
  );
}

export function ChatPreview({ messages, platform, title }: Props) {
  if (messages.length === 0) {
    return (
      <div
        className="rounded-xl border border-dashed flex flex-col items-center justify-center py-16 text-center"
        data-ocid="chat_preview.empty_state"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "oklch(var(--primary) / 0.08)" }}
        >
          <Bot className="h-8 w-8" style={{ color: "oklch(var(--primary))" }} />
        </div>
        <p
          className="font-medium"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Example Chat Preview
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Your conversation will appear here after fetching
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="chat_preview.panel">
      <div className="flex items-center justify-between">
        <h3
          className="font-semibold text-sm"
          style={{ color: "oklch(var(--foreground))" }}
        >
          {title}
        </h3>
        <PlatformBadge platform={platform} />
      </div>

      <ScrollArea className="h-[480px] rounded-xl border bg-white pr-1">
        <div className="p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msgKey(msg, idx)}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
              data-ocid={`chat_preview.item.${idx + 1}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    msg.role === "user"
                      ? "oklch(var(--bubble-user))"
                      : "oklch(var(--primary) / 0.15)",
                }}
              >
                {msg.role === "user" ? (
                  <User
                    className="h-4 w-4"
                    style={{ color: "oklch(var(--navy))" }}
                  />
                ) : (
                  <Bot
                    className="h-4 w-4"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                }`}
                style={{
                  background:
                    msg.role === "user"
                      ? "oklch(var(--bubble-user))"
                      : "oklch(var(--bubble-ai))",
                  color: "oklch(var(--foreground))",
                }}
              >
                <MarkdownRenderer content={msg.content} />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <p
        className="text-xs"
        style={{ color: "oklch(var(--muted-foreground))" }}
      >
        {messages.length} messages total
      </p>
    </div>
  );
}
