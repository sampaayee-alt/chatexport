import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check, FileDown, FileText, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ChatMessage } from "../utils/chatParser";
import { exportToPdf, exportToWord } from "../utils/exportUtils";

interface Props {
  messages: ChatMessage[];
  title: string;
  platform: string;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isSaved: boolean;
}

export function ExportOptions({
  messages,
  title,
  platform,
  onSave,
  isSaving,
  isSaved,
}: Props) {
  const [fontSize, setFontSize] = useState("medium");
  const [includeHeader, setIncludeHeader] = useState(true);

  const handlePdf = () => {
    try {
      exportToPdf(messages, { title, platform, includeHeader, fontSize });
      toast.success("Print dialog opened — save as PDF");
    } catch (_e) {
      toast.error("Export failed");
    }
  };

  const handleWord = () => {
    try {
      exportToWord(messages, { title, platform, includeHeader, fontSize });
      toast.success("Word document downloaded!");
    } catch (_e) {
      toast.error("Export failed");
    }
  };

  const disabled = messages.length === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Document Settings */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Document Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="font-size-select" className="text-sm">
              Font Size
            </Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger
                id="font-size-select"
                data-ocid="export.font_size.select"
              >
                <SelectValue placeholder="Medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (10pt)</SelectItem>
                <SelectItem value="medium">Medium (12pt)</SelectItem>
                <SelectItem value="large">Large (14pt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="header-toggle" className="text-sm">
              Include header &amp; metadata
            </Label>
            <Switch
              id="header-toggle"
              checked={includeHeader}
              onCheckedChange={setIncludeHeader}
              data-ocid="export.include_header.switch"
            />
          </div>

          <div
            className="rounded-md p-3 text-xs"
            style={{
              background: "oklch(var(--muted))",
              color: "oklch(var(--muted-foreground))",
            }}
          >
            Preview: <strong>{messages.length}</strong> messages • Platform:{" "}
            <strong className="capitalize">{platform || "—"}</strong>
          </div>
        </CardContent>
      </Card>

      {/* Download */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Download</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full h-11 font-semibold"
            disabled={disabled}
            onClick={handlePdf}
            style={{
              background: disabled ? undefined : "oklch(var(--primary))",
              color: disabled ? undefined : "oklch(var(--primary-foreground))",
            }}
            data-ocid="export.download_pdf.primary_button"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 font-medium"
            disabled={disabled}
            onClick={handleWord}
            data-ocid="export.download_word.secondary_button"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Word (.doc)
          </Button>

          <Button
            variant="ghost"
            className="w-full h-11 text-sm"
            disabled={disabled || isSaving || isSaved}
            onClick={onSave}
            data-ocid="export.save_chat.button"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <Check className="mr-2 h-4 w-4 text-green-600" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaved ? "Saved to My Chats" : "Save Chat"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
