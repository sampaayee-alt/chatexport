export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ParsedChat {
  title: string;
  platform: "chatgpt" | "grok" | "unknown";
  messages: ChatMessage[];
}

function detectPlatform(url: string): "chatgpt" | "grok" | "unknown" {
  if (url.includes("chatgpt.com") || url.includes("chat.openai.com"))
    return "chatgpt";
  if (url.includes("grok.com") || url.includes("x.com/i/grok")) return "grok";
  return "unknown";
}

function parseChatGPTHtml(html: string): ChatMessage[] {
  try {
    const nextDataMatch = html.match(
      /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/,
    );
    if (nextDataMatch) {
      const data = JSON.parse(nextDataMatch[1]);
      const pageProps = data?.props?.pageProps;
      const serverResponse = pageProps?.serverResponse?.data;

      let rawMessages: any[] = [];

      if (serverResponse?.linear_conversation) {
        rawMessages = serverResponse.linear_conversation;
      } else if (serverResponse?.mapping) {
        const mapping = serverResponse.mapping;
        const nodes = Object.values(mapping) as any[];
        const rootNode = nodes.find(
          (n: any) => !n.parent || !mapping[n.parent],
        );
        if (rootNode) {
          const ordered: any[] = [];
          const traverse = (nodeId: string) => {
            const node = mapping[nodeId];
            if (!node) return;
            if (node.message) ordered.push(node);
            for (const childId of node.children || []) {
              traverse(childId);
            }
          };
          traverse(rootNode.id);
          rawMessages = ordered;
        } else {
          rawMessages = nodes.filter((n: any) => n.message);
        }
      }

      const messages: ChatMessage[] = [];
      for (const node of rawMessages) {
        const msg = node?.message || node;
        if (!msg) continue;
        const role = msg?.author?.role || msg?.role;
        if (!role || role === "system" || role === "tool") continue;
        const parts = msg?.content?.parts || [];
        const text = parts.filter((p: any) => typeof p === "string").join("\n");
        if (!text.trim()) continue;
        messages.push({
          role: role === "assistant" ? "assistant" : "user",
          content: text,
        });
      }
      if (messages.length > 0) return messages;
    }
  } catch (_e) {
    // fall through
  }

  return parseFallbackHtml(html);
}

function parseGrokHtml(html: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const selectors = [
    { sel: "[class*='user-message']", role: "user" as const },
    { sel: "[class*='assistant-message']", role: "assistant" as const },
    { sel: "[class*='human']", role: "user" as const },
    { sel: "[class*='response']", role: "assistant" as const },
  ];

  for (const { sel, role } of selectors) {
    for (const el of doc.querySelectorAll(sel)) {
      const text = el.textContent?.trim() || "";
      if (text) messages.push({ role, content: text });
    }
  }

  if (messages.length > 0) return messages;

  for (const script of doc.querySelectorAll("script")) {
    const content = script.textContent || "";
    if (content.includes('"role"') && content.includes('"content"')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]+\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          const conv = data?.conversation || data?.messages || [];
          for (const m of conv) {
            if (m.role && m.content) {
              messages.push({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
              });
            }
          }
          if (messages.length > 0) return messages;
        }
      } catch {}
    }
  }

  return parseFallbackHtml(html);
}

function parseFallbackHtml(html: string): ChatMessage[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const candidates = doc.querySelectorAll(
    "[data-message-author-role], [data-testid*='message'], .message, [class*='message']",
  );
  const messages: ChatMessage[] = [];

  for (const el of candidates) {
    const role =
      el.getAttribute("data-message-author-role") ||
      (el.className.includes("user") ? "user" : "assistant");
    const text = el.textContent?.trim() || "";
    if (text.length > 5) {
      messages.push({
        role: role === "user" ? "user" : "assistant",
        content: text,
      });
    }
  }

  return messages;
}

export function parsePlainText(text: string): ParsedChat {
  const messages: ChatMessage[] = [];
  const lines = text.split("\n");
  let currentRole: "user" | "assistant" | null = null;
  let currentLines: string[] = [];

  const flushCurrent = () => {
    if (currentRole && currentLines.length > 0) {
      const content = currentLines.join("\n").trim();
      if (content) messages.push({ role: currentRole, content });
    }
    currentLines = [];
  };

  for (const line of lines) {
    const userMatch = line.match(/^(You|User|Human|Me):\s*(.*)$/i);
    const aiMatch = line.match(
      /^(ChatGPT|Assistant|AI|GPT|Grok|Claude|Bot):\s*(.*)$/i,
    );

    if (userMatch) {
      flushCurrent();
      currentRole = "user";
      if (userMatch[2].trim()) currentLines.push(userMatch[2]);
    } else if (aiMatch) {
      flushCurrent();
      currentRole = "assistant";
      if (aiMatch[2].trim()) currentLines.push(aiMatch[2]);
    } else if (currentRole) {
      currentLines.push(line);
    }
  }
  flushCurrent();

  if (messages.length === 0) {
    const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 10);
    for (let i = 0; i < paragraphs.length; i++) {
      messages.push({
        role: i % 2 === 0 ? "user" : "assistant",
        content: paragraphs[i].trim(),
      });
    }
  }

  const title =
    messages.length > 0
      ? `${messages[0].content.slice(0, 60)}...`
      : "Pasted Chat";
  return { title, platform: "unknown", messages };
}

export function parseChatHtml(html: string, url: string): ParsedChat {
  const platform = detectPlatform(url);
  let messages: ChatMessage[] = [];

  if (platform === "chatgpt") {
    messages = parseChatGPTHtml(html);
  } else if (platform === "grok") {
    messages = parseGrokHtml(html);
  } else {
    messages = parseFallbackHtml(html);
  }

  const firstUser = messages.find((m) => m.role === "user");
  const title = firstUser
    ? firstUser.content.slice(0, 60) +
      (firstUser.content.length > 60 ? "..." : "")
    : "Chat Export";

  return { title, platform, messages };
}
