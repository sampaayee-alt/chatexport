import type { ChatMessage } from "./chatParser";

interface ExportOptions {
  title: string;
  platform: string;
  includeHeader: boolean;
  fontSize: string;
}

// ===== PDF Export via window.print() =====
export function exportToPdf(messages: ChatMessage[], options: ExportOptions) {
  // Build print area HTML
  let printArea = document.getElementById("print-area");
  if (!printArea) {
    printArea = document.createElement("div");
    printArea.id = "print-area";
    document.body.appendChild(printArea);
  }

  const fontSizeMap: Record<string, string> = {
    small: "10pt",
    medium: "12pt",
    large: "14pt",
  };
  const fs = fontSizeMap[options.fontSize] || "12pt";

  let html = `<div id="chat-print-content" style="font-size:${fs}">`;

  if (options.includeHeader) {
    html += `
      <div class="print-header-info">
        <h1>${escapeHtml(options.title)}</h1>
        <p>Platform: ${escapeHtml(options.platform)} &nbsp;&bull;&nbsp; Exported: ${new Date().toLocaleString()}</p>
      </div>`;
  }

  for (const msg of messages) {
    const label = msg.role === "user" ? "You" : platformLabel(options.platform);
    const bodyClass = `print-message-body ${msg.role === "assistant" ? "ai" : ""}`;
    html += `
      <div class="print-message">
        <div class="print-message-header">${escapeHtml(label)}</div>
        <div class="${bodyClass}">${formatContentForPrint(msg.content)}</div>
      </div>`;
  }

  html += "</div>";
  printArea.innerHTML = html;

  setTimeout(() => {
    window.print();
    // Clean up after print
    setTimeout(() => {
      if (printArea) printArea.innerHTML = "";
    }, 1000);
  }, 100);
}

// ===== Word Export via HTML blob (.doc) =====
export function exportToWord(messages: ChatMessage[], options: ExportOptions) {
  const fontSizeMap: Record<string, string> = {
    small: "10pt",
    medium: "12pt",
    large: "14pt",
  };
  const fs = fontSizeMap[options.fontSize] || "12pt";

  let body = "";

  if (options.includeHeader) {
    body += `
      <h1 style="font-family:Arial,sans-serif;color:#1F2A36">${escapeHtml(options.title)}</h1>
      <p style="color:#666;font-size:10pt">Platform: ${escapeHtml(options.platform)} &bull; Exported: ${new Date().toLocaleString()}</p>
      <hr style="margin:12pt 0"/>`;
  }

  for (const msg of messages) {
    const label = msg.role === "user" ? "You" : platformLabel(options.platform);
    const bgColor = msg.role === "user" ? "#E6E9EE" : "#D9ECFF";
    body += `
      <div style="margin-bottom:14pt;font-size:${fs};font-family:Arial,sans-serif">
        <p style="font-weight:bold;margin:0 0 4pt;font-size:10pt;color:#555">${escapeHtml(label)}</p>
        <div style="background:${bgColor};padding:10pt 14pt;border-radius:4pt">${formatContentForWord(msg.content)}</div>
      </div>`;
  }

  const htmlDoc = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(options.title)}</title>
      <!--[if gte mso 9]>
      <xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; margin: 1in; }
        p { margin: 0; line-height: 1.6; }
        code { font-family: Courier New, monospace; background: #f0f0f0; padding: 1pt 3pt; }
        pre { font-family: Courier New, monospace; background: #f0f0f0; padding: 8pt; border: 1pt solid #ddd; white-space: pre-wrap; }
      </style>
    </head>
    <body>${body}</body>
    </html>`;

  const blob = new Blob([htmlDoc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFilename(options.title)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== Helpers =====
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_ ]/g, "").slice(0, 60) || "chat-export";
}

function platformLabel(platform: string): string {
  if (platform === "chatgpt") return "ChatGPT";
  if (platform === "grok") return "Grok";
  return "Assistant";
}

function formatContentForPrint(content: string): string {
  let html = escapeHtml(content);
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // Newlines
  html = html.replace(/\n/g, "<br>");
  return html;
}

function formatContentForWord(content: string): string {
  let html = escapeHtml(content);
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\n/g, "<br>");
  return html;
}
