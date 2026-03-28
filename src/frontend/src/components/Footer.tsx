import { Github, Linkedin, MessageSquare, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer className="py-10 px-4" style={{ background: "oklch(var(--navy))" }}>
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <MessageSquare
              className="h-5 w-5"
              style={{ color: "oklch(var(--primary))" }}
            />
            <span
              className="font-bold"
              style={{ color: "oklch(var(--navy-foreground))" }}
            >
              ChatArchiver
            </span>
            <span
              className="text-xs ml-2"
              style={{ color: "oklch(var(--navy-foreground) / 0.45)" }}
            >
              © {year}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Support"].map((link) => (
              <button
                key={link}
                type="button"
                className="text-xs transition-opacity hover:opacity-80 bg-transparent border-none cursor-pointer"
                style={{ color: "oklch(var(--navy-foreground) / 0.55)" }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs mr-1"
              style={{ color: "oklch(var(--navy-foreground) / 0.45)" }}
            >
              Follow us
            </span>
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Github, label: "GitHub" },
              { icon: Linkedin, label: "LinkedIn" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="p-2 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                style={{
                  color: "oklch(var(--navy-foreground) / 0.55)",
                }}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Caffeine attribution */}
        <div
          className="mt-6 pt-5 text-center text-xs border-t"
          style={{
            borderColor: "oklch(var(--navy-foreground) / 0.1)",
            color: "oklch(var(--navy-foreground) / 0.4)",
          }}
        >
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
