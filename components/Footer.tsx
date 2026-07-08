import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex w-[min(1180px,100%-2.5rem)] flex-wrap items-center justify-between gap-4 font-mono text-xs text-faint">
        <p>© 2026 {profile.name}. Diseñado y codeado con cariño.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Next.js · Three.js · Framer Motion
          </span>
          <a href="#home" className="transition-colors hover:text-accent">
            ↑ arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
