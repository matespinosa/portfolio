import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex w-[min(1100px,100%-2.5rem)] flex-wrap items-center justify-between gap-4 text-[13px] text-faint">
        <p>© 2026 {profile.name}. Diseñado, codeado y AI-assisted.</p>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="accent-text font-semibold">✦</span>
            Next.js · Framer Motion · Claude
          </span>
          <a href="#home" className="font-medium transition-colors hover:text-accent">
            ↑ arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
