import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Link2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Props {
  onFetch: (url: string) => void;
  isFetching: boolean;
}

export function Hero({ onFetch, isFetching }: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onFetch(url.trim());
  };

  return (
    <section
      className="py-20 px-4"
      style={{ background: "oklch(var(--navy))" }}
      id="how-it-works"
    >
      <div className="container mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6 border"
            style={{
              borderColor: "oklch(var(--primary) / 0.5)",
              color: "oklch(var(--primary))",
              background: "oklch(var(--primary) / 0.1)",
            }}
          >
            <Link2 className="h-3 w-3" />
            ChatGPT &amp; Grok Supported
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ color: "oklch(var(--navy-foreground))" }}
          >
            Export Your AI Chats{" "}
            <span style={{ color: "oklch(var(--primary))" }}>Perfectly</span>
          </h1>
          <p
            className="text-base md:text-lg mb-10 max-w-xl mx-auto"
            style={{ color: "oklch(var(--navy-foreground) / 0.7)" }}
          >
            Paste a shared ChatGPT or Grok link to preview and export the full
            conversation — styled beautifully as PDF or Word, preserving every
            detail.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Link2
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "oklch(var(--muted-foreground))" }}
              />
              <Input
                type="url"
                placeholder="https://chatgpt.com/share/... or https://grok.com/share/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-sm bg-white border-white/20"
                data-ocid="hero.url.input"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isFetching || !url.trim()}
              className="h-12 px-6 font-semibold"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
              data-ocid="hero.fetch.primary_button"
            >
              {isFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {isFetching ? "Fetching..." : "Fetch Chat"}
            </Button>
          </form>

          <p
            className="mt-3 text-xs"
            style={{ color: "oklch(var(--navy-foreground) / 0.45)" }}
          >
            Paste a shared link above to begin. The chat must have public
            sharing enabled.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
