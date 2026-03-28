import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ClipboardPaste } from "lucide-react";
import { useState } from "react";
import { type ParsedChat, parsePlainText } from "../utils/chatParser";

interface Props {
  error: string;
  onParsed: (chat: ParsedChat) => void;
}

export function ManualPaste({ error, onParsed }: Props) {
  const [text, setText] = useState("");

  const handleParse = () => {
    if (text.trim()) {
      onParsed(parsePlainText(text));
    }
  };

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
      <div className="flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-sm text-destructive">
            Could not fetch the chat automatically
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            {error ||
              "This page may require JavaScript rendering or CORS access. Please copy all text from the chat page and paste it below."}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="manual-paste">
          Paste chat text here
        </label>
        <Textarea
          id="manual-paste"
          placeholder="You: Hello...
ChatGPT: Hi there! How can I help you today?..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="text-sm font-mono"
          data-ocid="manual_paste.textarea"
        />
      </div>

      <Button
        onClick={handleParse}
        disabled={!text.trim()}
        className="w-full"
        style={{
          background: "oklch(var(--primary))",
          color: "oklch(var(--primary-foreground))",
        }}
        data-ocid="manual_paste.parse.primary_button"
      >
        <ClipboardPaste className="mr-2 h-4 w-4" />
        Parse Pasted Text
      </Button>
    </div>
  );
}
