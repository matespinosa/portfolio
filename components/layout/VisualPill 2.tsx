"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  DEFAULT_SKIN,
  SKINS,
  SKIN_STORAGE_KEY,
  isSkinId,
  type SkinId,
} from "@/lib/skins";

function applySkin(id: SkinId) {
  document.documentElement.setAttribute("data-skin", id);
  localStorage.setItem(SKIN_STORAGE_KEY, id);
}

export function VisualPill() {
  const [skin, setSkin] = useState<SkinId>(DEFAULT_SKIN);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  useEffect(() => {
    const stored = localStorage.getItem(SKIN_STORAGE_KEY);
    const next = isSkinId(stored) ? stored : DEFAULT_SKIN;
    applySkin(next);
    setSkin(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = SKINS.find((s) => s.id === skin) ?? SKINS[0];

  const select = (id: SkinId) => {
    setSkin(id);
    applySkin(id);
    setOpen(false);
  };

  if (!ready) return null;

  return (
    <div
      ref={rootRef}
      className={`visual-pill${open ? " is-open" : ""}`}
      role="group"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Variante visual del portafolio
      </span>

      {open ? (
        <div className="visual-pill__menu" role="listbox" aria-label="Skins">
          {SKINS.map((option) => {
            const active = option.id === skin;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                className={`visual-pill__option${active ? " is-active" : ""}`}
                onClick={() => select(option.id)}
              >
                <span
                  className="visual-pill__swatch"
                  style={{ background: option.swatch }}
                  aria-hidden="true"
                />
                <span className="visual-pill__copy">
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        className="visual-pill__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Cambiar variante visual"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="visual-pill__swatch"
          style={{ background: current.swatch }}
          aria-hidden="true"
        />
        <span className="visual-pill__label">{current.label}</span>
        <span className="visual-pill__chev" aria-hidden="true">
          {open ? "×" : "▾"}
        </span>
      </button>
    </div>
  );
}
