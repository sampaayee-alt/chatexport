import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, MessageSquare, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useDeleteChat, useListChats } from "../hooks/useQueries";
import type { ParsedChat } from "../utils/chatParser";

interface Props {
  onLoad: (chat: ParsedChat) => void;
  onClose: () => void;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SavedChats({ onLoad, onClose }: Props) {
  const { data: chats, isLoading } = useListChats();
  const deleteChat = useDeleteChat();
  const { actor } = useActor();

  const handleLoad = async (id: string) => {
    if (!actor) return;
    try {
      const chat = await actor.getChat(id);
      const messages = JSON.parse(chat.messagesJson);
      onLoad({
        title: chat.title,
        platform: chat.platform as any,
        messages,
      });
      toast.success("Chat loaded");
    } catch {
      toast.error("Failed to load chat");
    }
  };

  const handleDelete = (id: string) => {
    deleteChat.mutate(id, {
      onSuccess: () => toast.success("Chat deleted"),
      onError: () => toast.error("Delete failed"),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      data-ocid="saved_chats.modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "oklch(var(--border))" }}
        >
          <h2
            className="font-bold text-lg"
            style={{ color: "oklch(var(--navy))" }}
          >
            My Saved Chats
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Close"
            data-ocid="saved_chats.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {isLoading ? (
            ["s1", "s2", "s3"].map((k) => (
              <Skeleton key={k} className="h-16 w-full rounded-lg" />
            ))
          ) : !chats || chats.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="saved_chats.empty_state"
            >
              <MessageSquare
                className="h-10 w-10 mb-3"
                style={{ color: "oklch(var(--muted-foreground))" }}
              />
              <p className="font-medium">No saved chats yet</p>
              <p
                className="text-sm mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Fetch and save a chat to see it here
              </p>
            </div>
          ) : (
            chats.map((chat, idx) => (
              <div
                key={chat.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                style={{ borderColor: "oklch(var(--border))" }}
                data-ocid={`saved_chats.item.${idx + 1}`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "oklch(var(--primary) / 0.1)" }}
                >
                  <MessageSquare
                    className="h-4 w-4"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{chat.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {chat.platform}
                    </Badge>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      {formatDate(chat.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleLoad(chat.id)}
                    title="Load chat"
                    data-ocid={`saved_chats.load.button.${idx + 1}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(chat.id)}
                    disabled={deleteChat.isPending}
                    title="Delete"
                    data-ocid={`saved_chats.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
