import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Chat, ChatSummary } from "../backend.d";
import { useActor } from "./useActor";

export function useListChats() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatSummary[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetChat(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Chat>({
    queryKey: ["chat", id],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getChat(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useFetchChatPage() {
  const { actor } = useActor();
  return useMutation<string, Error, string>({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.fetchChatPage(url);
    },
  });
}

export function useSaveChat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      platform,
      messagesJson,
    }: {
      id: string;
      title: string;
      platform: string;
      messagesJson: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.saveChat(id, title, platform, messagesJson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useDeleteChat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteChat(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
