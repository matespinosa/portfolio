"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// La superficie no forma parte del JS inicial: se monta al primer uso y se
// precarga en idle para que el primer ⌘K no espere red.
const CommandSurface = dynamic(
  () => import("./CommandSurface").then((m) => m.CommandSurface),
  { ssr: false },
);

interface CommandSurfaceContextValue {
  openSurface: () => void;
  closeSurface: () => void;
}

const Ctx = createContext<CommandSurfaceContextValue | null>(null);

export function useCommandSurface(): CommandSurfaceContextValue {
  const value = useContext(Ctx);
  if (!value) throw new Error("useCommandSurface debe usarse dentro de <CommandProvider>");
  return value;
}

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openSurface = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);
  const closeSurface = useCallback(() => setOpen(false), []);

  // Atajos globales: ⌘K / Ctrl+K siempre; `/` solo fuera de campos de texto.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMounted(true);
        setOpen((v) => !v);
        return;
      }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const typing =
          !!target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable);
        if (!typing) {
          event.preventDefault();
          setMounted(true);
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prefetch del chunk en idle, sin bloquear el arranque.
  useEffect(() => {
    const load = () => {
      void import("./CommandSurface");
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(load, 2500);
    return () => window.clearTimeout(id);
  }, []);

  const value = useMemo(
    () => ({ openSurface, closeSurface }),
    [openSurface, closeSurface],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {mounted ? <CommandSurface open={open} onClose={closeSurface} /> : null}
    </Ctx.Provider>
  );
}
