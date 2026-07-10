"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { getConsoleAnswer, suggestedPrompts, type ConsoleAnswer } from "@/lib/ai-console";

type Exchange = {
  id: string;
  query: string;
  answer: ConsoleAnswer | null; // null mientras "escribe"
};

const MAX_EXCHANGES = 3;

// Colorea solo strings ("...") en acento; el resto queda en ink/soft.
// Monocromo + un acento — nada de resaltado multicolor tipo rainbow.
function CodeLine({ line }: { line: string }) {
  const parts: { text: string; isString: boolean }[] = [];
  const regex = /"([^"]*)"/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line))) {
    if (match.index > lastIndex) {
      parts.push({ text: line.slice(lastIndex, match.index), isString: false });
    }
    parts.push({ text: `"${match[1]}"`, isString: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) parts.push({ text: line.slice(lastIndex), isString: false });

  return (
    <div className="whitespace-pre-wrap break-words">
      {parts.map((p, i) =>
        p.isString ? (
          <span key={i} className="accent-text">
            {p.text}
          </span>
        ) : (
          <span key={i} className="text-ink">
            {p.text}
          </span>
        )
      )}
    </div>
  );
}

function AnswerBlock({ answer }: { answer: ConsoleAnswer }) {
  return (
    <div className="mt-2 rounded-xl border border-line bg-elev p-4">
      <p className="mb-2 font-mono text-[12.5px] text-faint">{answer.comment}</p>
      <div className="space-y-0.5 font-mono text-[12.5px] leading-relaxed">
        {answer.code.map((line, i) => (
          <CodeLine key={i} line={line} />
        ))}
      </div>
      {answer.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {answer.links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {l.label}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H8M17 7v9" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function AIConsole() {
  const reduce = useReducedMotion();
  const inputId = useId();
  const [value, setValue] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [exchanges, reduce]);

  function ask(query: string) {
    const q = query.trim();
    if (!q) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setExchanges((prev) => [...prev.slice(-(MAX_EXCHANGES - 1)), { id, query: q, answer: null }]);
    setValue("");

    const delay = reduce ? 0 : 550 + Math.random() * 350;
    window.setTimeout(() => {
      const answer = getConsoleAnswer(q);
      setExchanges((prev) => prev.map((e) => (e.id === id ? { ...e, answer } : e)));
    }, delay);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(value);
  }

  return (
    <div className="gradient-border mx-auto max-w-2xl overflow-hidden rounded-2xl text-left shadow-2xl shadow-black/10" id="ask">
      {/* barra de título estilo editor */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full border border-line" />
        <span className="h-2.5 w-2.5 rounded-full border border-line" />
        <span className="h-2.5 w-2.5 rounded-full border border-line" />
        <span className="ml-2 font-mono text-xs text-faint">pregunta-a-mateo.ts</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          listo
        </span>
      </div>

      {/* intro fija */}
      <div className="border-b border-line px-4 py-3.5 font-mono text-[12.5px] text-faint">
        {"// pregúntame qué proyectos ha hecho, cuál es su experiencia,"}
        <br />
        {"// en qué áreas ha trabajado, o cómo usa IA en su proceso."}
      </div>

      {/* log de intercambios */}
      {exchanges.length > 0 && (
        <div ref={logRef} className="max-h-[360px] overflow-y-auto px-4 py-3" aria-live="polite">
          <AnimatePresence initial={false}>
            {exchanges.map((ex) => (
              <motion.div
                key={ex.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mb-4 last:mb-0"
              >
                <p className="font-mono text-[13px] text-ink">
                  <span className="text-faint">{"> "}</span>
                  {ex.query}
                </p>
                {ex.answer ? (
                  <AnswerBlock answer={ex.answer} />
                ) : (
                  <div className="mt-2 flex items-center gap-1 rounded-xl border border-line bg-elev px-4 py-3 text-faint">
                    <span className="typing-dot" style={{ animationDelay: "0ms" }} />
                    <span className="typing-dot" style={{ animationDelay: "150ms" }} />
                    <span className="typing-dot" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* prompts sugeridos */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-line px-4 py-3">
        {suggestedPrompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => ask(p)}
            className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-[12.5px] font-medium text-soft transition-colors hover:border-accent hover:text-ink"
          >
            {p}
          </button>
        ))}
      </div>

      {/* input */}
      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line p-3">
        <label htmlFor={inputId} className="sr-only">
          Pregúntame sobre este portafolio
        </label>
        <span className="pl-1 font-mono text-soft">{">"}</span>
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe tu pregunta…"
          className="flex-1 bg-transparent font-mono text-[13.5px] text-ink placeholder:text-faint focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Enviar pregunta"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[var(--accent-ink)] transition-transform hover:scale-105 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
