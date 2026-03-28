# ChatExport

## Current State
New project with empty Motoko backend and no frontend implemented.

## Requested Changes (Diff)

### Add
- URL input to accept ChatGPT (chat.openai.com/share/...) and Grok shared links
- Backend HTTP outcall to fetch shared chat page HTML, parse `__NEXT_DATA__` JSON (ChatGPT) or equivalent for Grok, and return structured conversation data
- Chat preview UI displaying the full conversation with proper user/assistant message styling (bubbles, avatars)
- Export to PDF (using browser print API / html2canvas + jspdf)
- Export to Word/DOCX (using docx.js library)
- Document settings panel (font size, include header/footer toggle)
- Responsive layout so exported/viewed chat works on any device

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: `fetchChatPage(url: Text) : async Result<Text, Text>` - HTTP outcall to fetch shared link HTML, return raw HTML body
2. Frontend: URL input form with platform detection (ChatGPT vs Grok)
3. Frontend: HTML parser to extract conversation from `__NEXT_DATA__` script tag (ChatGPT) and build message array
4. Frontend: Chat preview component with styled user/assistant bubbles preserving markdown formatting
5. Frontend: PDF export using jspdf + html2canvas on the chat preview DOM
6. Frontend: Word export using the `docx` npm package to generate .docx
7. Frontend: Document settings (font size, header/footer toggle)
8. Frontend: Hero + nav layout matching design preview
