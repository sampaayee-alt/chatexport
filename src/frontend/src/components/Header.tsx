import { Button } from "@/components/ui/button";
import { BookMarked, Menu, MessageSquare, X } from "lucide-react";
import { useState } from "react";

interface Props {
  onShowSaved: () => void;
}

export function Header({ onShowSaved }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "oklch(var(--navy))" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <MessageSquare
            className="h-6 w-6"
            style={{ color: "oklch(var(--primary))" }}
          />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "oklch(var(--navy-foreground))" }}
          >
            ChatArchiver
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {["How it Works", "Features", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "oklch(var(--navy-foreground) / 0.75)" }}
              data-ocid={`nav.${item.toLowerCase().replace(/ /g, "-")}.link`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* My Saved Chats */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowSaved}
            className="border text-sm font-medium"
            style={{
              borderColor: "oklch(var(--navy-foreground) / 0.3)",
              color: "oklch(var(--navy-foreground))",
              background: "transparent",
            }}
            data-ocid="header.saved_chats.button"
          >
            <BookMarked className="mr-2 h-4 w-4" />
            My Saved Chats
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ color: "oklch(var(--navy-foreground))" }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{ background: "oklch(var(--navy))" }}
        >
          {["How it Works", "Features", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-medium py-1"
              style={{ color: "oklch(var(--navy-foreground) / 0.8)" }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMenuOpen(false);
              onShowSaved();
            }}
            className="w-full border text-sm"
            style={{
              borderColor: "oklch(var(--navy-foreground) / 0.3)",
              color: "oklch(var(--navy-foreground))",
              background: "transparent",
            }}
          >
            <BookMarked className="mr-2 h-4 w-4" />
            My Saved Chats
          </Button>
        </div>
      )}
    </header>
  );
}
