import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ChatPreview } from "./components/ChatPreview";
import { ExportOptions } from "./components/ExportOptions";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ManualPaste } from "./components/ManualPaste";
import { SavedChats } from "./components/SavedChats";
import { WorkflowSteps } from "./components/WorkflowSteps";
import { useFetchChatPage, useSaveChat } from "./hooks/useQueries";
import { type ParsedChat, parseChatHtml } from "./utils/chatParser";

function generateId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [parsedChat, setParsedChat] = useState<ParsedChat | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fetchMutation = useFetchChatPage();
  const saveMutation = useSaveChat();

  const handleFetch = async (url: string) => {
    setCurrentUrl(url);
    setFetchError(null);
    setParsedChat(null);
    setIsSaved(false);

    try {
      const html = await fetchMutation.mutateAsync(url);
      const chat = parseChatHtml(html, url);

      if (chat.messages.length === 0) {
        setFetchError(
          "Parsed 0 messages from this page. The chat might be protected or rendered with JavaScript. Please copy-paste the chat text instead.",
        );
      } else {
        setParsedChat(chat);
        toast.success(`Loaded ${chat.messages.length} messages!`);
      }
    } catch (err: any) {
      const msg =
        err?.message ||
        "Failed to fetch the page. Try the copy-paste fallback below.";
      setFetchError(msg);
      toast.error("Fetch failed");
    }
  };

  const handleParsedPaste = (chat: ParsedChat) => {
    setParsedChat(chat);
    setFetchError(null);
    setIsSaved(false);
    toast.success(`Parsed ${chat.messages.length} messages from pasted text!`);
  };

  const handleSave = async () => {
    if (!parsedChat) return;
    const id = generateId();
    await saveMutation.mutateAsync({
      id,
      title: parsedChat.title,
      platform: parsedChat.platform,
      messagesJson: JSON.stringify(parsedChat.messages),
    });
    setIsSaved(true);
    toast.success("Chat saved!");
  };

  const handleLoadSaved = (chat: ParsedChat) => {
    setParsedChat(chat);
    setFetchError(null);
    setIsSaved(true);
    setShowSaved(false);
  };

  const hasChat = parsedChat && parsedChat.messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />

      <Header onShowSaved={() => setShowSaved(true)} />

      <main className="flex-1">
        {/* Hero with URL input */}
        <Hero onFetch={handleFetch} isFetching={fetchMutation.isPending} />

        {/* How it works */}
        <WorkflowSteps />

        {/* Main Content Area */}
        <section className="py-12 px-4 bg-background" id="faq">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "oklch(var(--navy))" }}
              >
                Chat Preview &amp; Export
              </h2>
              <p
                className="text-sm"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Fetch a link or paste text to get started
              </p>
            </div>

            {/* Error / fallback paste */}
            <AnimatePresence>
              {fetchError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  data-ocid="fetch.error_state"
                >
                  <ManualPaste
                    error={fetchError}
                    onParsed={handleParsedPaste}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat preview */}
            <AnimatePresence>
              {(hasChat || (!fetchError && !fetchMutation.isPending)) && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border bg-white p-6 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      Chat Preview
                    </span>
                    <div className="flex gap-2">
                      {hasChat && (
                        <button
                          type="button"
                          onClick={() => handleFetch(currentUrl)}
                          className="text-xs px-3 py-1 rounded-full border font-medium transition-colors hover:bg-muted"
                          style={{
                            borderColor: "oklch(var(--primary) / 0.4)",
                            color: "oklch(var(--primary))",
                          }}
                        >
                          Refresh
                        </button>
                      )}
                    </div>
                  </div>

                  <ChatPreview
                    messages={parsedChat?.messages || []}
                    platform={parsedChat?.platform || ""}
                    title={parsedChat?.title || ""}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Export options */}
            <div data-ocid="export.section">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "oklch(var(--navy))" }}
              >
                Export Options
              </h3>
              <ExportOptions
                messages={parsedChat?.messages || []}
                title={parsedChat?.title || "Chat Export"}
                platform={parsedChat?.platform || "unknown"}
                onSave={handleSave}
                isSaving={saveMutation.isPending}
                isSaved={isSaved}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Saved Chats Modal */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            key="saved-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SavedChats
              onLoad={handleLoadSaved}
              onClose={() => setShowSaved(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
